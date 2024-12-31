import React, {useState } from 'react';
import './Downloader.css'

function Downloader ({color}) {
  const [url, setUrl] = useState('')
  const [format, setFormat] = useState('video')
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('')

  const handleDownload = async(e) => {
    e.preventDefault();

    if (!url) {
      alert("Please enter a YouTube URL!")
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch("http://localhost:8000/yt_downloader", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',

        },
        body: JSON.stringify({url, format})
      });

      if (!response.ok) {
        throw new Error('Download Failed');
      }

      // Get the file name from Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'download';
      console.log("The content disposition is ", contentDisposition)
      console.log("The content type is ", response.headers.get('Content-Type'));
      if (contentDisposition) {
        let filenameIndex = contentDisposition.indexOf('=');
        console.log(filenameIndex);
        let tempFileName = contentDisposition.substring(filenameIndex + 1, (contentDisposition.length))
        console.log(tempFileName);
        // const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
        if (tempFileName != null) {
          filename = tempFileName.replace(/['"]/g, '');
        }
      }

      // newly add part ==================================
      const reader = response.body.getReader();
      const chunks = [];

      while(true) {
        const {done, value} = await reader.read();

        if (done) {
          break;
        }

        chunks.push(value);
      }

      const blob = new Blob(chunks, {
        type: format === "video" ? "video/mp4" : "audio/mp3"
      })
      // =================
      // const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;

      // const fileExtension = format === 'video' ? 'mp4' : 'mp3';
      // a.download = `youtube-download.${fileExtension}`;
      a.download = filename;

      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);

    } catch(err) {
      setError('Failed to download. Please try again.');
      console.error('Download error:', err);
    } finally {
      setIsLoading(false);
    }

    };   
    return (
        <div className = "container"
            style = {{"--mainContainerColor" : color}}>
        <h1>YouTube Downloader</h1>
        <div className = "downloader">
        <label>
        <input
          className = "text-input"
          type = "url"
          placeholder = "Enter your YouTube URL"
          value = {url}
          onChange = {(e) => setUrl(e.target.value)}
          required 
        />
        </label>

        <div>
          <label>
            <input
              className = "radio-input"
              type = "radio"
              value = "radio"
              checked = {format === 'video'}
              onChange = {() => setFormat('video')}
            />
            Video
          </label>

          <label>
            <input
              className = "radio-input"
              type="radio"
              value="audio"
              checked={format === 'audio'}
              onChange={() => setFormat('audio')} // Set format to audio
            />
            Audio
          </label>
          
        </div>
        <button 
          onClick = {handleDownload}
          disabled = {isLoading}
          className = "submit-button"
          cursor = {isLoading ? "wait" : "pointer"}
          style={{ cursor: isLoading ? "wait" : "pointer",
                  backgroundColor : isLoading? "#0056b3" : "#007bff" }}
        >
          {!isLoading? (<i className="fas fa-download"></i>) : (<></>)}
          {isLoading? 'Downloading' : 'Download'} 
          {isLoading? (<div className="loader"></div>) : (<></>)}
        </button>
        </div>
        </div>
    );
  };
export default Downloader;
