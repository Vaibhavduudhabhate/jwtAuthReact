import React, { useState } from 'react'
import axios from 'axios';

const Registration = () => {
  const [name ,setName] =useState();
  const [email ,setEmail] =useState()
  const [password ,setPassword] =useState()
  const handleSubmit = (e) =>{
    e.preventDefault();
    axios.post('http://localhost:3001/register',{name,email,password})
    .then(res=>console.log(res.data))
    .catch(err =>console.log(err))
  }

  return (
    <div className='d-flex justify-content-center align-items-center bg-secondary registerCont'>
      <div className='bg-white p-3 rounded w-25'>
        <h2>  Register</h2>
        <form action="" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Name</strong>
            </label>
            <input type="text" placeholder='Enter Name' name="email" id="" className='form-control rounded-0' autoComplete='off' onChange={(e)=>setName(e.target.value)} />
          </div>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>email</strong>
            </label>
            <input type="text" placeholder='Enter Name' name="email" id="" className='form-control rounded-0' autoComplete='off' onChange={(e)=>setEmail(e.target.value)} />
          </div>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>password</strong>
            </label>
            <input type="password" placeholder='Enter Password' name="password" id="" className='form-control rounded-0' autoComplete='off' onChange={(e)=>setPassword(e.target.value)} />
          </div>
          <button type="submit" className='btn btn-success w-100 rounded-0'>
            Register
          </button>
        </form>
        <p>Already have an acccount</p>
        <button className='btn btn-default border w-100 bg-light rounded-0 text-decoration-none' type="button">
          Login
        </button>
        </div> 

    </div>
  )
}

export default Registration