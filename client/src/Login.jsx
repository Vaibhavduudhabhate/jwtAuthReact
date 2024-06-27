import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const [email ,setEmail] =useState();
    const [password ,setPassword] =useState()
    const navigate = useNavigate()
  
    axios.defaults.withCredentials = true
    const handleSubmit = (e) =>{
      e.preventDefault();
      axios.post('http://localhost:3001/login',{email,password})
      // .then(res=>console.log(res.data))
      .then(res =>{
        if(res.data.Login){
            navigate('/dashboard')
        }else{
            navigate('/')
        }
      })
      .catch(err =>console.log(err))
    }

  return (
    <div className='d-flex justify-content-center align-items-center bg-secondary registerCont'>
      <div className='bg-white p-3 rounded w-25'>
        <h2>Login</h2>
        <form action="" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email :</strong>
            </label>
            <input type="text" placeholder='Enter Email' name="email"  className='form-control rounded-0' autoComplete='off' onChange={(e)=>setEmail(e.target.value)} />
          </div>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Password :</strong>
            </label>
            <input type="password" placeholder='Enter Password' name="password"  className='form-control rounded-0' autoComplete='off' onChange={(e)=>setPassword(e.target.value)} />
          </div>
          <button type="submit" className='btn btn-success w-100 rounded-0'>
            Login
          </button>
        </form>
        <p>Don't have acccount?</p>
        <button className='btn btn-default border w-100 bg-light rounded-0 text-decoration-none' type="button">
          Register
        </button>
        </div> 

    </div>
  )
}

export default Login