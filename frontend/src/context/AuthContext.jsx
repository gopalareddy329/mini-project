import {createContext,useState,useEffect} from 'react'
import {Outlet, useNavigate} from 'react-router-dom'
import { jwtDecode } from "jwt-decode";
import { API_BASE_URL } from '../pages/utils/Base_API';
const AuthContext = createContext()

export default AuthContext

export const AuthProvider = () =>{
    let  navigate= useNavigate();
    let [authToken,setAuthToken] = useState(()=> localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    let [user,setUser]= useState(()=> localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')) : null)

    const [loading, setLoading] = useState(true);
    

    
    


    const loginUser = async (e) =>{
        e.preventDefault()
        try{
            let response = await fetch(`${API_BASE_URL}/token/`,{
                method:"POST",
                headers:{
                    'Content-Type':"application/json"
                },
                body:JSON.stringify({username:e.target.email.value,password:e.target.password.value})
            })
            let data = await response.json()
            if(response.status === 200){
                
                setAuthToken(data)
                localStorage.setItem('authTokens', JSON.stringify(data))
                setUser(jwtDecode(data.access))
                navigate('/chat')
            }
            else{
                alert('credentials are wrong!')
            }
            
        }catch(err){
            console.log(err.status)
        }
    }
    const logoutUser = ()=>{
        setAuthToken(null)
        setUser(null)
        localStorage.removeItem('authTokens')
        navigate("/login")
    }
    const registerUser = async (e) =>{
        e.preventDefault();
        try{
            let  res=await fetch (`${API_BASE_URL}/register/`, {
              method:'POST',
              headers:{'Content-type':'Application/json'},
              body: JSON.stringify({
                username:e.target.email.value,
                password:e.target.password.value,
              })
            })
           let data = await res.json()
           if(res.status===201){
                setAuthToken(data)
                localStorage.setItem('authTokens', JSON.stringify(data))
                setUser(jwtDecode(data.access))
                navigate('/chat')

           }else{
            alert("Somthing went to worng....")
           }

        }
        catch(err){
            console.log(err)
        }

    }
    const isTokenExpired = (token) => {
        if (!token) return true;
        const [, payload] = token.split('.');
        const { exp } = JSON.parse(atob(payload));
        const now = Math.floor(Date.now() / 1000); 
        return exp < now;
      };
      
    useEffect(()=>{
        if(isTokenExpired(authToken.access)){
            navigate('/login')
        }
    },[])
    let contextData={
        user:user,
        loginUser:loginUser,
        logoutUser:logoutUser,
        authToken:authToken,
        registerUser:registerUser
    }
    return(
        <AuthContext.Provider value={contextData}>
            <Outlet/>
        </AuthContext.Provider>
    )
}