import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const AddUsers = () => {

    const [userName ,setUserName] =useState();
    const [description ,setDescription] =useState();
    const [image ,setImage] =useState();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    axios.defaults.withCredentials = true
    const handleSubmit = async(e) =>{
      e.preventDefault();
      setLoading(true);

      try {
        const res = await axios.post('http://localhost:3002/imagewithadd', {userName,description,image}, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        console.log(res.data);
        navigate('/'); // Redirect to Products page
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
    //   await axios.post('http://localhost:3002/imagewithadd',{userName,description,image},
    //     {headers:{"Content-Type":"multipart/form-data"}}
    // )
    // //   .then(res=>console.log(res.data))
    //   .then(res =>{
    //     console.log(res.data)
    //   })
    //   .catch(err =>console.log(err))
    //   .finally{
    //       setLoading(false);

    //   }
    //   )
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
                    <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Loading...' : 'Submit'}</button>
                </form>
            </div>
        </div>
    )
}

export default AddUsers