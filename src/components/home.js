import React from 'react'
import {useNavigate} from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate()
    
    const handleLogin = () =>{
        navigate('/login')
    }

  return (
    <div>
      hi welcome to home
      <button onClick={handleLogin} >Login</button>
    </div>
  )
}

export default Home
