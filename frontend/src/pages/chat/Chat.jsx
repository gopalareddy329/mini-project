import React, { useEffect, useState } from 'react'
import NavBar from '../../component/navBar/NavBar'

import { useParams } from 'react-router-dom';
import SideBar from '../../component/sideBar/SideBar';
import ChatComponent from '../../component/chatComponent/ChatComponent';
const Chat = () => {
  const { chatId } = useParams(); 
  return (
    <div className='min-h-[calc(100svh-70px)] overflow-hidden  relative'>
        <NavBar />
        <section className='w-full h-full'>
                <ChatComponent/>
        </section>
      </div>
  )
}

export default Chat