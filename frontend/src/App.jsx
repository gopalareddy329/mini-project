import { useState } from 'react'
import LoginPage from './pages/login/LoginPage'
import RegisterPage from './pages/register/RegisterPage'
import './App.css'
import {createBrowserRouter,RouterProvider} from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Chat from './pages/chat/Chat'
function App() {

  const router=createBrowserRouter([
    {
      path:"/",
      element:<AuthProvider/>,
      children:[
        {
          path:"/login",
          element:<LoginPage/>
    
        },
        {
          path:"/register",
          element:<RegisterPage/>
    
        },
        {
          path:"/chat",
          element:<Chat/>,
          children:[
            {
              path:":chatId",
              element:<Chat/>
            }
          ]
        }
      ]
    }
  ])

  return (
    <>

      <RouterProvider router={router} />

    </>
  )
}

export default App
