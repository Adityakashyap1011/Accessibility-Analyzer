import React from 'react'
import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import '../Home.css'

const Home = () => {
    const [url,SetUrl]=useState("");
    const [loading,SetLoading]=useState(false);
    const [error,SetError]=useState(null);
    const navigate=useNavigate();

    const handleClick= async()=>{
      SetLoading(true);
      SetError(null);
      
      try{
        const response= await axios.post("http://localhost:3000/analyze",{url});
        navigate("/results", { state: { results: response.data ,url :url} });
      }
      catch(error){
        console.log(error);
        SetError("Something went wrong");
      }
      SetLoading(false);
    }


  return (
    <div  className="home">
      <h1 className="shiny-heading">Accessibility Analyzer</h1>
      <input 
        type='url'
        placeholder='Enter Website URL...'
        value={url}
        onChange={(e)=> SetUrl(e.target.value)}
      />
      <button onClick={handleClick}>{loading ?"Analyzing...": "Analyze"}</button>
      {error && <div className='error'>{error}</div>}
    </div>
  )
}

export default Home
