import React, {useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faAngleLeft, faAngleRight, faPause,faVolumeDown } from "@fortawesome/free-solid-svg-icons";
import { playAudio } from '../util';


const Player = ({ currentSong, setCurrentSong, isPlaying, setIsPlaying, audioRef, songInfo, setSongInfo, songs, setSongs }) => {
  const [activeVolume, setActiveVolume] = useState(false);

// UseEffect
  useEffect(()=>{
    const newSongs = songs.map((song)=>{
      if(song.id===currentSong.id){
        return{
          ...song,
          active:true,
        }
        } else {
        return{
          ...song,
          active:false,
        }
      }
    })
    setSongs(newSongs);
  },[currentSong])
  
  // Event Handlers
  const playSongHandler = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(!isPlaying)
    } else {
      audioRef.current.play()
      setIsPlaying(!isPlaying)
    }
  }

  function timeFormat(time) {
    return (
      Math.floor(time / 60) + ":" + ("0" + Math.floor(time % 60)).slice(-2)
    );
  }

  const dragHandler = (e) => {
    audioRef.current.currentTime = e.target.value;
    setSongInfo(
      { ...songInfo, currentTime: e.target.value }
    )
  }

// manage forward and backward
  const skipHandler = async (direction) => {
  const currentIndex = songs.findIndex(song => song.id === currentSong.id);
  if (direction === "skip-forward") {
    await setCurrentSong(songs[(currentIndex + 1) % songs.length]);
    console.log(`Current Index ${currentIndex}`);
    console.log(`Songs Length: ${songs.length}`);
  }
  if(direction==='skip-backward'){
    if((currentIndex -1)%songs.length === -1){
      await setCurrentSong(songs[songs.length-1])
      playAudio(isPlaying, audioRef)
      return
    }
    await setCurrentSong(songs[(currentIndex - 1) % songs.length]);
  }
    playAudio(isPlaying, audioRef)    
};

// add the styles
  const trackAnim = {
    transform : `translateX(${songInfo.animationPercentage}%)`
  }

  // volume handler
  const changeVolume = (e) => {
    const value = e.target.value
    audioRef.current.volume=value
    setSongInfo({ ...songInfo, volume: value })
    
  }
  
  return (
    <div className="player">
      <div className="time-control">
        <p>{timeFormat(songInfo.currentTime)}</p>
        <div style={{
            background: `linear-gradient(to right, ${currentSong.color[0]},${currentSong.color[1]})`,
          }} className="track">
          <input
            min={0}
            max={songInfo.duration || 0} 
            value={songInfo.currentTime}
            type="range"
            onChange={dragHandler}
          />
          <div style={trackAnim} className="animate-track"></div>
        </div>
        <p>{songInfo.duration?timeFormat(songInfo.duration):"00:00"}</p>
      </div>
      <div className="play-control">
        <FontAwesomeIcon onClick={()=>skipHandler("skip-backward")} className="skip-back" size="2x" icon={faAngleLeft} />
        <FontAwesomeIcon className="play" size="2x" icon={isPlaying ? faPause : faPlay} onClick={playSongHandler} />
        <FontAwesomeIcon onClick={()=>skipHandler("skip-forward")} className="skip-forward" size="2x" icon={faAngleRight} />
        <FontAwesomeIcon onClick={()=>setActiveVolume(!activeVolume)} icon={faVolumeDown}/> 
          {activeVolume && (
            <input
              onChange={changeVolume}
              value={songInfo.volume}
              max="1"
              min="0"
              step="0.091"
              type="range"
            />
          )}
      </div>
    </div>
  )
}

export default Player;