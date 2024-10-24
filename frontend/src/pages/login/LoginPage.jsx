import React, { useContext } from 'react';
import NavBar from '../../component/navBar/NavBar'
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
const LoginPage = () => {
  const {loginUser,user}=useContext(AuthContext)
  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-white "
    >
      <div className=" flex h-full grow flex-col">
        <NavBar/>

        <div className="px-40 flex flex-1 justify-center pb-5">
          <div className="layout-content-container flex flex-col   flex-1">

            <form onSubmit={loginUser} className='w-full '>

            <div className="">

              <div className="@[480px]:p-4">

                <div
                  className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat   items-start justify-end px-4 pb-10 "
                  style={{
                    backgroundImage:
                      'linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://cdn.usegalileo.ai/stability/3ffcfdd4-6fdd-439b-b4d0-edb786732ab6.png")',
                  }}
                >
                        <div className="flex flex-col gap-2 text-left mb-10">
                                <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
                                Welcome back to Finance Ai
                                </h1>
                                <h2 className="text-white text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal">
                                We use AI to help you make better financial decisions. Log in to see your portfolio.
                                </h2>
                        </div>

      
                        <label className="flex mb-10  flex-col min-w-40 h-14 w-full max-w-[480px] ">
                                    <div className="flex flex-col gap-5 w-full flex-1 items-stretch rounded-xl h-full">
                                           
                                            <input
                                                placeholder="Email address"
                                                name='email'
                                                type='email'
                                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111517] focus:outline-0 focus:ring-0 border-none bg-[#f0f3f4] focus:border-none h-14 placeholder:text-[#647987] p-4 text-base font-normal leading-normal"
                                                required={true}
                                            />

                                            <div className='flex justify-center items-center h-full'>
                                                <input
                                                  placeholder="Password"
                                                  name='password'
                                                  type='password'
                                                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111517] focus:outline-0 focus:ring-0 border-none bg-[#f0f3f4] focus:border-none rounded-r-none h-14 placeholder:text-[#647987] p-4 text-base font-normal leading-normal"
                                                  required={true}
                                                  />
                                                  <button type='submit' className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-full px-4 bg-[#1f93e0] text-white text-sm rounded-l-none font-bold leading-normal ">
                                                      <span className='py-5'>Log in</span>
                                                  </button>
                                            </div>
                                    
                                    </div>
                        </label>
                </div>
              </div>
            </div>

                
            </form>


            <div className="pt-2 pb-3 text-sm font-normal leading-normal flex">
                <p>Don't have an account?</p>
                <Link to="/register" >
                    <span  className="text-[#1f93e0] font-bold ml-4">Register</span>
                </Link>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
