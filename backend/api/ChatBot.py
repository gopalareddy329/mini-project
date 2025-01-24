import os
import json
from dotenv import load_dotenv
from qdrant_client import QdrantClient
from qdrant_client.http import models
from langchain_groq import ChatGroq
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from langchain_community.embeddings import HuggingFaceEmbeddings
import warnings

warnings.filterwarnings("ignore", category=DeprecationWarning)  # Suppress deprecation warnings

class QdrantGroqService:
    """Service to integrate Qdrant with Groq model for chat-based queries."""

    def __init__(self):
        # Load environment variables
        load_dotenv()

        # Qdrant connection details
        self.QDRANT_URL = "http://localhost:6333"
        self.COLLECTION_NAME = "Heirarchial_Chunks"

        # Initialize Qdrant and Groq clients
        self.qdrant_client = QdrantClient(url=self.QDRANT_URL)
        groq_api_key = os.getenv("GROQ_API_KEY")

        self.chat_model = ChatGroq(
            api_key=groq_api_key,
            model_name="llama3-8b-8192",
            streaming=True,
            callbacks=[StreamingStdOutCallbackHandler()],
            temperature=0
        )
        self.embeddings_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

    def retrieve_context(self, query_vector, limit=5):
        try:
            search_result = self.qdrant_client.search(
                collection_name=self.COLLECTION_NAME,
                query_vector=query_vector,
                limit=limit,
                with_payload=True
            )

            context = ""
            for point in search_result:
                context += json.dumps(point.payload['json_data'], indent=2) + "\n"

            return context
        except Exception as e:
            print(f"An error occurred during context retrieval: {str(e)}")
            return ""

    def create_prompt_template(self, query, context,chat_history):
        return f"""
        Chat History:
        {chat_history}

        Context:
        {context}

        Based on the above, answer the following query and if the question is not related to Context reply what user can ask you:

        {query}
        """

    def generate_response(self, query,chat_history):
        try:
            query_vector = self.embeddings_model.embed_query(query)
            context = self.retrieve_context(query_vector)
            prompt = self.create_prompt_template(query, context,chat_history)

            if not isinstance(prompt, str):
                raise TypeError("Prompt must be a string")

            messages = [
                ("system", "You are a helpful financial advisor who guides users financially."),
                ("human", prompt),
            ]
            response = self.chat_model.invoke(messages)
            return response.content
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return "An error occurred while generating a response."
