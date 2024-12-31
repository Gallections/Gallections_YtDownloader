import React, {useState} from 'react'
import './SPPlaylist.css'

function SPPlaylist({color}) {




    return (
        <div className = "SpContainer"
            style = {{"--mainContainerColor": color}}>
        <h1 className = "header">Spotify Playlist Downloader</h1>
        <div className = "info_playlist">
            <p> Spotify music cannot be legally downloaded without Spotify's authorization. Use alternatives from other video platforms.</p>
        </div>
        </div>
    );
}

export default SPPlaylist;
