import React from 'react'
import axios from 'axios';

const DownloadReportButton = ({ results, url }) => {

    const handleDownload= async ()=>{
        try{
            const response = await axios.post('http://localhost:3000/report', { results, url }, { responseType: 'blob' });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(response.data);
            link.download = "accessibility-report.pdf";
            link.click();
        }
        catch(err){
            alert("Failed to download Report. Please try again");
        }
    }
  return (
    <div>
      <button onClick={handleDownload}>
        Download PDF Report
      </button>
    </div>
  )
}

export default DownloadReportButton
