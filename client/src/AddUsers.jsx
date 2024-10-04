import axios from 'axios';
import React, { useState } from 'react'

const AddUsers = () => {

    const [userName ,setUserName] =useState();
    const [description ,setDescription] =useState();
    const [image ,setImage] =useState();
    
    axios.defaults.withCredentials = true
    const handleSubmit = async(e) =>{
      e.preventDefault();
      await axios.post('http://localhost:3002/imagewithadd',{userName,description,image},
        {headers:{"Content-Type":"multipart/form-data"}}
    )
    //   .then(res=>console.log(res.data))
      .then(res =>{
        console.log(res.data)
      })
      .catch(err =>console.log(err))
    }

    const onInputChange =(e) =>{
        console.log(e.target.files[0]);
        setImage(e.target.files[0])
    }

    return (
        <div>
            <div className="container mt-4">
                <form action="" onSubmit={handleSubmit}>
                    <div className="mb-3 ">
                        <label htmlFor="userName" className="form-label">User name</label>
                        <input type="text" className="form-control" id="userName" name="userName" aria-describedby="userName" onChange={(e)=>setUserName(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description">Description</label>
                        <textarea className="form-control" placeholder="" name="description" id="description" onChange={(e)=>setDescription(e.target.value)} ></textarea>
                    </div>
                    <div className=" mb-3">
                        <label htmlFor="image" className="form-label image">Image</label>
                        <input type="file" className="form-control image" id="image" name="image" onChange={
                            onInputChange
                            // (e)=>setimage(e.target.value)
                            } />
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
    )
}

export default AddUsers