import React, { useEffect, useState } from 'react'
import { RiMenu3Line } from "react-icons/ri";
import { Link, useParams } from 'react-router-dom';
import { RiStickyNoteAddLine } from "react-icons/ri";

const SideBar = ({data,loading,chatLoading,createNewChat}) => {
  const [sideBar,setSideBar]=useState(false)
  const {chatId}=useParams();
  
  useEffect(()=>{
    function handleResize(){
      if(window.innerWidth < 768){
        setSideBar(false)
      }
      else{
        setSideBar(true)
      }
    }
    handleResize();
    window.addEventListener("resize",handleResize)
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  },[])
  const handleLinkClick = (e) => {
    if (chatLoading) {
      e.preventDefault();
    }
    if(chatLoading && e.target.value===chatId){
      e.preventDefault();
    }
  };


  return (
    <aside className={` max-h-[calc(100svh-60px)] overflow-y-scroll overflow-x-hidden  md:w-full max-w-[270px] bg-[#fafdff] ${sideBar ? ('w-full'):('w-fit px-2')}`}
            style={{
              boxShadow:
                '0 4px 8px rgba(0, 0, 0, 0.2)'
              }
            }>
              
            {sideBar ? (
                <div className={`w-[250px] min-h-full `}>
                  {!loading &&(
                      <React.Fragment>
            
                            <div onClick={()=> setSideBar(!sideBar)} className='cursor-pointer md:hidden' >
                              <RiMenu3Line size={25}/>
                          </div>
                          <h4 className='pt-2 px-5 font-bold text-[20px] flex justify-between items-center'>History <button onClick={()=>createNewChat()}><RiStickyNoteAddLine size={20}/></button></h4>
                          <div className='pt-5 flex flex-col'>
                            {data?.map((item,key)=>(
                              
                              <Link to={item.id} 
                                value={item.id} 
                                onClick={(e) => handleLinkClick(e)}  
                                key={key} className={`cursor-pointer text-ellipsis my-2   w-full overflow-hidden text-nowrap p-2 pl-4 hover:bg-[#f7f8f9] hover:border rounded-lg h-[45px] ${item.id === chatId &&('bg-[#f7f8f9] border')}`}
                                style={{ 
                                  pointerEvents: chatLoading ? 'none' : 'auto', 
                                  color: chatLoading ? 'gray' : '' 
                                }}
                              >{item.title}</Link>
                            ))}
                          </div>
                      </React.Fragment>
                  )}
                </div>
                              
            ):(
                <div onClick={()=> setSideBar(!sideBar)} className='cursor-pointer md:hidden'>
                    <RiMenu3Line size={25}/>
                </div>
            )
                
          }
              
    </aside>
  )
}

export default SideBar