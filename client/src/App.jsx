import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Downloader from './components/Downloader'
import ToggleButton from './components/ToggleButton'
import PlaylistDownloader from './components/PlaylistDownloader'
import Spotify from "./components/Spotify"
import SPPlaylist from './components/SPPlaylist'

function App() {

  const [activeButton, setActiveButton] = useState("YouTube");

  const handleToggle = (buttonName) => {
    setActiveButton(buttonName == activeButton? activeButton : buttonName);
  };

  return (
    <>
    <div className = "app">
      <div className = "toggler-container">
        <ToggleButton 
          name= "YouTube"
          isActive = {activeButton == "YouTube"}
          onClick = {() => handleToggle("YouTube")}
          color = "#eb4034"/>
        <ToggleButton 
          name= "Playlist"
          isActive = {activeButton == "Playlist"}
          onClick = {() => handleToggle("Playlist")}
          color = "tomato"/>
        <ToggleButton 
          name= "Spotify"
          isActive = {activeButton == "Spotify"}
          onClick = {() => handleToggle("Spotify")}
          color = "#1ED760" />
        <ToggleButton 
          name= "SPPlaylist"
          isActive = {activeButton == "SPPlaylist"}
          onClick = {() => handleToggle("SPPlaylist")}
          color = "#535353" />
      </div>
      {activeButton == "YouTube" && <Downloader color= "#eb4034"/>}
      {activeButton == "Playlist" && <PlaylistDownloader color = "tomato" />}
      {activeButton == "Spotify" && <Spotify color = "#1ED760"/>}
      {activeButton == "SPPlaylist" && <SPPlaylist color = "#535353"/>}
    </div>
    </>
  )
}

export default App
