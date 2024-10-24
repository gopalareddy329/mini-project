import React, { useContext, useEffect, useRef, useState } from 'react';
import { IoSend } from 'react-icons/io5';
import { GiFlowers } from 'react-icons/gi';
import { useNavigate, useParams } from 'react-router-dom';
import SideBar from '../sideBar/SideBar';
import { API_BASE_URL } from '../../pages/utils/Base_API';
import AuthContext from '../../context/AuthContext';

const parseMessage = (message) => {
  return message
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^\*\s*(.+)/gm, '<li>$1</li>') 
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n+/g, '<br/>')
};

const parseMessageHistory = (message) => {
  return message
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^\*\s*(.+)/gm, '<li>$1</li>')
    .replace(/\n/g, '<br/>')
};

const ChatComponent = () => {
  const { chatId } = useParams();
  const navigator = useNavigate();
  const { authToken } = useContext(AuthContext);

  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [userChat, setUserChat] = useState(null);
  const [disable, setDisable] = useState(true);

  const messagesEndRef = useRef(null);

  const onchange = (e) => {
    setDisable(e.target.value.trim() === '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = e.target.message?.value.trim();
    if (!message) return;

    e.target.message.value = '';
    setDisable(true);

    try {
      if (chatId) await getResponse(message);
    } catch (error) {
      console.error('Error during message submission:', error);
    } finally {
      setDisable(false);
    }
  };

  const getResponse = async (message) => {
    try {
      const newMessage = { message, bot_reply: '' };
      setUserChat((prev) => [...(prev || []), newMessage]);
      setChatLoading(true);

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
          if (updatedHistory[0].title === 'New Chat') {
            updatedHistory[0].title = message;
          }
          return updatedHistory;
        });
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');

      let botReply = '';
      

      let { done, value } = await reader.read();
      while (!done) {
        const chunk = decoder.decode(value, { stream: true });

        botReply += `${chunk} `;

        setUserChat((prev) => {
          if (prev && prev.length > 0) {
            const updatedChat = [...prev];
            updatedChat[updatedChat.length - 1] = {
              ...updatedChat[updatedChat.length - 1],
              bot_reply: parseMessage(botReply),
            };
            return updatedChat;
          }
          return prev;
        });

        ({ done, value } = await reader.read());
      }
    } catch (err) {
      console.error('Error in getResponse:', err);
    } finally {
      setChatLoading(false);
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
        console.error('Failed to create new chat session');
      }
    } catch (error) {
      console.error('Error in createNewChat:', error);
    }
  };

  const getSession = async () => {
    try {
      setChatLoading(true);
      const response = await fetch(`${API_BASE_URL}/get_sessions?id=${chatId}`, {
        headers: {
          Authorization: `Bearer ${String(authToken.access)}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      setUserChat(result);
    } catch (error) {
      console.error('Error fetching session:', error);
    } finally {
      setChatLoading(false);
    }
  };

  const getPreviousSessions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/get_sessions`, {
        headers: {
          Authorization: `Bearer ${String(authToken.access)}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      setHistory(result);
      if (result.length === 0) createNewChat();
    } catch (error) {
      console.error('Error fetching previous sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPreviousSessions();
  }, [chatId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [userChat]);

  useEffect(() => {
    if (chatId) getSession();
    setUserChat(null);
  }, [chatId]);

  return (
    <div className="w-full flex">
      <SideBar data={history} createNewChat={createNewChat} loading={loading} chatLoading={chatLoading} />
      <div className="w-full relative">
        <div className="h-full mx-auto flex flex-col justify-between">
          <div className="h-[calc(100svh-130px)] overflow-y-scroll">
          <div  className='relative max-h-[80%] w-[65%] max-md:w-[90%] mx-auto max-w-[800px] my-10 pb-[500px]'>
              {userChat && userChat.length > 0 ? (
                userChat.map((item, key) => (
                  <div key={key} className="flex flex-col">
                    <div className="bg-[#ebedee] p-2 rounded-lg w-[50%] ml-auto">
                      <p>{item.message}</p>
                    </div>
                    <div className="my-10 flex items-start gap-5">
                      <span className={`${(key===userChat.length-1 && chatLoading)  &&('animate-spin')}`}>{<GiFlowers size={20}/>}</span>
                      <p className='leading-[1.2rem]' dangerouslySetInnerHTML={{ __html: parseMessageHistory(item.bot_reply) }} />
                    </div>
                  </div>
                ))
              ) : (
                !chatLoading && (
                  <div className="absolute w-full top-[50%] translate-y-[-50%] text-[1.5rem] flex flex-col items-center">
                    <h3>Hello! I'm your financial advisor, here to help you navigate any financial queries</h3>
                  </div>
                )
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
          <div className="pb-5 w-[65%] mx-auto">
            <form onSubmit={handleSubmit} className="flex">
              <input
                onChange={onchange}
                autoComplete="off"
                id="message"
                placeholder="Message..."
                name="message"
                className="w-full bg-[#d9dcde] rounded-l-lg h-10 p-5"
                required
              />
              <button disabled={disable} className={`p-2 ${disable ? 'bg-[#7f868b]' : 'bg-[#1f93e0]'} text-white rounded-r-lg`}>
                <IoSend size={25} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
