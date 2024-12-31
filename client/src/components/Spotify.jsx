import React, {useState} from 'react'
import './Spotify.css'

function Spotify({color}) {




    return (
        <div className = "SpContainer"
            style = {{"--mainContainerColor": color}}>
        <h1 className = "header">Spotify Music Downloader</h1>
        <div className = "info">
            <p> Spotify music cannot be legally downloaded without Spotify's authorization. Use alternatives from other video platforms.</p>
        </div>

        </div>
    );
}

export default Spotify;
