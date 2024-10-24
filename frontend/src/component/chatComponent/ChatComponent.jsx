import React, { useContext, useEffect, useRef, useState } from 'react'
import { IoSend } from "react-icons/io5";
import { GiFlowers } from "react-icons/gi";
import { useNavigate, useParams } from 'react-router-dom';
import SideBar from '../sideBar/SideBar';
import { API_BASE_URL } from '../../pages/utils/Base_API';
import AuthContext from '../../context/AuthContext';
const ChatComponent = () => {

    const {chatId}=useParams();
    const navigator=useNavigate();

    const {authToken}=useContext(AuthContext)

    const [history,setHistory]=useState(null)
    const [loading,setLoading]=useState(false)
    const [chatLoading,setChatLoading]=useState(false)

    const [userChat,setUserChat]=useState(null);


    const [disable,setDisable]=useState(true)
    const messagesEndRef = useRef(null)

    const onchange=(e)=>{
        if(e.target.value.trim() === ''){
            setDisable(true)
        }
        else{
            setDisable(false)
        }
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const message = e.target.message?.value.trim();
        if (!message) return; 
      

        e.target.message.value = '';
        setDisable(true);
      
        try {
          if (chatId) {
            await getResponse(message);
          }
        } catch (error) {
          console.error("Error during message submission:", error);
        } finally {
          setDisable(false); 
        }
      };

      const getResponse = async (message) => {
        try {
          const newMessage = { message, bot_reply: '' };
          setUserChat((prev) => [...(prev || []), newMessage]);
      
          const response = await fetch(`${API_BASE_URL}/get_bot_response/`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${String(authToken.access)}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ session_id: chatId, message }),
          });
      
          if (response.ok) {
            setHistory((prev) => {
              const updatedHistory = [...prev];
              if (updatedHistory[0].title==="New Chat") {
                updatedHistory[0].title = message;
              }
              return updatedHistory;
            });
          }
      
          const reader = response.body.getReader();
          const decoder = new TextDecoder('utf-8');
      
          let botReply = '';
          setChatLoading(true);
      
          let { done, value } = await reader.read();
          while (!done) {
            const chunk = decoder.decode(value);
            const word = chunk.replace('data: ', '').trim();
            botReply += `${word} `;
            setUserChat((prev) => {
              if (prev && prev.length > 0) {
                const updatedChat = [...prev];
                updatedChat[updatedChat.length - 1] = {
                  ...updatedChat[updatedChat.length - 1],
                  bot_reply: botReply,
                };
                return updatedChat;
              }
              return prev;
            });
      
            ({ done, value } = await reader.read());
          }
        } catch (err) {
          console.error("Error in getResponse:", err);
        } finally {
          setChatLoading(false); // Stop loading state
        }
      };
      
      const createNewChat = async (message) => {
        try {
          const newSession = { id: '', title: message }; 
      
          const response = await fetch(`${API_BASE_URL}/create_new_session/`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${String(authToken.access)}`,
              'Content-Type': 'application/json',
            },
          });
      
          if (response.ok) {
            const result = await response.json();
            newSession.id = result.id;
            setHistory((prev) => [newSession, ...prev]);
            navigator(`/chat/${result.session_id}`);
          } else {
            console.error("Failed to create new chat session");
          }
        } catch (error) {
          console.error("Error in createNewChat:", error);
        }
      };
   

    const getSession=async ()=>{
        try {
            setChatLoading(true);
            const response = await fetch(API_BASE_URL+`/get_sessions?id=${chatId}`,{
                'headers':{
                    'Authorization': `Bearer `+String(authToken.access),
                    'Content-Type': 'application/json'
                }
            });
      
            if (!response.ok) {
              
              throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
      
            const result = await response.json();
            setUserChat(result);
          } catch (error) {

          } finally {
            setChatLoading(false);
          }
        ;
    }

    const getPreviousSessions=async ()=>{
        try {
            setLoading(true);
            const response = await fetch(API_BASE_URL+'/get_sessions',{
                'headers':{
                    'Authorization': `Bearer `+String(authToken.access),
                    'Content-Type': 'application/json'
                }
            });
      
            if (!response.ok) {
              
              throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
      
            const result = await response.json();
            setHistory(result);
            if(result.length===0){
                createNewChat()
            }
          } catch (error) {
          } finally {
            setLoading(false);
          }
        ;
    }

    useEffect(()=>{
        getPreviousSessions();
    },[chatId])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
      }
    
    useEffect(() => {
        scrollToBottom()
       
    }, [userChat]);

    useEffect(()=>{
        if(chatId){
            getSession()
        }
        setUserChat(null)
    },[chatId])

    
    
  return (
    <div  className='w-full flex'>
        <SideBar data={history} createNewChat={createNewChat} loading={loading} chatLoading={chatLoading}/>
        <div className='w-full relative'>

            
            <div className=' h-full mx-auto  flex flex-col justify-between'>
                        <div className='h-[calc(100svh-130px)] overflow-y-scroll' >
                        
                            <div  className='relative max-h-[80%] w-[65%] max-md:w-[90%] mx-auto max-w-[800px] my-10 pb-[500px]'>
                                {(userChat && userChat.length>0) ? (
                                            userChat.map((item,key)=>(
                                                <div key={key} className='flex flex-col'>
                                                    <div className='bg-[#ebedee] p-2 rounded-lg  w-[50%] ml-auto'>
                                                    
                                                        <p>{item.message}</p>
                                                    </div>
                                                    <div className='my-10 flex items-start gap-5 text-wrap '>
                                                        <span>{<GiFlowers size={20}/>}</span>
                                                        <p>{item.bot_reply}</p>
                                                    </div>
                                                </div>
                                        ))):(
                                            !chatLoading &&(
                                                <div className='absolute w-full translate-y-[-50%] top-[50%]  text-[1.5rem] flex flex-col justify-center items-center '>
                                                    <h3>
                                                    Hello! I'm your financial advisor, here to help you navigate any financial queries</h3>
                                                </div>
                                            )
                                            
                                        )
                                }
                                <div ref={messagesEndRef} />
                            </div>
                        </div>
                        <div className='pb-5 z-10 w-[65%] max-md:w-[90%] max-w-[800px]  mx-auto'>
                            <div className='mx-auto'>
                                <form onSubmit={handleSubmit} className='flex justify-center items-center'>
                                <input onChange={onchange} id="message" placeholder='Message...' name='message' className='w-full text-black bg-[#d9dcde] rounded-l-lg h-10 focus:outline-none p-5'  required/>
                                <button  disabled={disable}  className={`p-2 bg-[#1f93e0] text-white rounded-r-lg ${disable && ('bg-[#7f868b]')}`}><IoSend size={25}/></button>
                                </form>
                            </div>
                        </div>
            </div>
        </div>
    </div>
  )
}

export default ChatComponent