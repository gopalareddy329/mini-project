import React, { useContext } from 'react'
import AuthContext from '../../context/AuthContext'
import { MdLogout } from "react-icons/md";
import { Link } from 'react-router-dom';
import { IoLogoElectron } from "react-icons/io5";
const NavBar = () => {
  const {user,logoutUser}=useContext(AuthContext)
  return (
    <nav className="flex w-full bg-[#f5f5f5] items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f0f3f4] px-10 py-3"
    style={{
      boxShadow:
        '0 4px 8px rgba(0, 0, 0, 0.2)'
      }
    }
    >
          <div className="flex items-center gap-4 text-[#111517]">
            <div className="size-4">
              <IoLogoElectron className='' size={20}/>
            </div>
            <h2 className="text-[#111517] text-lg font-bold leading-tight tracking-[-0.015em]">Finance Ai</h2>
          </div>

          {user ?(
            <div className='flex justify-center items-center gap-5 h-10'>
                <p>{user.name}</p>
                <span onClick={logoutUser} title='logout' className='cursor-pointer'><MdLogout size={25}/></span>
            </div>
          ):(
            <div className="flex items-center  justify-end">
                      <Link to="/login" type='submit' className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10  bg-[#1f93e0] text-white text-sm font-bold">
                          <span >Log in</span>
                      </Link>
            </div>
          )}

          
    </nav>
  )
}

export default NavBar