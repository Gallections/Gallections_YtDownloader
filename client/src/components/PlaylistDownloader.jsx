import React, {useState} from 'react'
import "./PlaylistDownloader.css"

function PlaylistDownloader({color}) {
    const [url, setUrl] = useState('')
    const [format, setFormat] = useState('video')
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')


    // ============== handle a single download ==================
    const handleDownload = (chunks, filename) => {
      if (chunks ==[]) {
        return;
      }

      console.log(`Actually downloading the ${format == "video" ? "video" : "audio"}!`);
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
    }

    // ============== handle a playlist download =================
    const handleDownloadPlaylist = async (e) => {
      console.log("Downloading playlist triggered")

      e.preventDefault();
      if (!url) {
        alert('Please enter a YouTube playlist URL!');
        return;
      }
      console.log("URL valid")

      setIsLoading(true);
      setError('');
      setSuccessMessage('');

       // original url: http://localhost:8000/yt_playlist_downloader
       // rendered url: https://gallectionsytdownloader.onrender.com/yt_playlist_downloader
      try {
        const response = await fetch("http://localhost:8000/yt_playlist_downloader", {
          method : "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({url, format})
        });

        if (!response.ok) {
          throw new Error("Failed to fetch playlist videos");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        const boundary = ((format == "video") ? "--video-boundary\n" : "--audio-boundary\n");

        let buffer = "";
        let chunks = []
        let filename = 'download'
        let filenameExtractionTrigger = false;
        let fileDownloadTrigger = false;
        let end = ((format == "video") ? "--video-boundary--\n" : "--audio-boundary--\n");

        while (true) {
          const {done, value} = await reader.read();
          if (done) break;
          buffer = decoder.decode(value, { stream: true });

          // Process when we encounter a boundary
          if (buffer.includes(boundary)) {
            // If the buffer contains a newline, it indicates the end of a chunk
            console.log("Buffer is equal to boundary");
            console.log("Buffer is \n", buffer);

            fileDownloadTrigger = false;
            filenameExtractionTrigger = true;

            // Filename extraction logic
            // if (filenameExtractionTrigger) {
            //   console.log("Triggered file extraction");
            //   console.log("Buffer is ", buffer);
            //   filenameExtractionTrigger = false;
            //   let filenameStartIndex = buffer.indexOf("=") + 2;
            //   let filenameEndIndex = buffer.indexOf("\n\n") - 1;
            //   filename = buffer.slice(filenameStartIndex, filenameEndIndex).trim();
            //   filename = filename + (format === "video" ? ".mp4" : ".mp3");
            //   console.log("The file name is ", filename);
            //   fileDownloadTrigger = true;
            //   continue;
            // }
            continue;
          }

          if (filenameExtractionTrigger) {
            console.log("Triggered file extraction");
            console.log("Buffer is ", buffer);
            filenameExtractionTrigger = false;
            let filenameStartIndex = buffer.indexOf("=") + 2;
            let filenameEndIndex = buffer.indexOf("\n\n") - 1;
            filename = buffer.slice(filenameStartIndex, filenameEndIndex).trim();
            filename = filename + (format === "video" ? ".mp4" : ".mp3");
            console.log("The file name is ", filename);
            fileDownloadTrigger = true;
            continue;
          }

          // If the buffer contains a newline, it indicates the end of a chunk
          if (buffer.includes("separator") && fileDownloadTrigger) {
            console.log("Finised pushing all the chunks");

            // chunks.push(value);

            console.log(buffer);
            if (fileDownloadTrigger) {
              handleDownload(chunks, filename);
            }
            chunks = [];
            filename = "download";
            fileDownloadTrigger = false;
            continue;
          }

          // Process when we encounter the end boundary
          if (buffer.includes(end)) {
            console.log("Buffer is equal to end");
            console.log("Buffer is \n", buffer);
            continue;
          }

          // if the download trigger is on, we start downloading
          if (fileDownloadTrigger) {
            console.log("Pushing chunks....");
            fileDownloadTrigger = 1;
            chunks.push(value);
            continue;
          }

        }  

        } catch(err) {
          setError('Failed to download playlist audio. Please try again.');
          console.error('Playlist audio download error:', err);
        } finally {
          setIsLoading(false);
        }
      }

    return (
        <>
        <div className = 'ytcontainer'
            style ={{"--mainContainerColor": color}}>
        <h1>YouTube Playlist Downloader</h1>
        <div className = "ytdownloader">
        <label>
        <input className ="text-input"
          type = "url"
          placeholder = "Enter your YouTube Playlist URL"
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
          onClick = {handleDownloadPlaylist}
          disabled = {isLoading}
          className = "submit-button"
          style={{ cursor: isLoading ? "wait" : "pointer" ,
                  backgroundColor : isLoading? "#0056b3" : "#007bff" }}
        >
          {!isLoading? (<i className="fas fa-download"></i>) : (<></>)}
          {isLoading? 'Downloading' : 'Download'} 
          {isLoading? (<div className="loader"></div>) : (<></>)}
        </button>
        </div>
        </div>
        </>
    );
};

export default PlaylistDownloader;