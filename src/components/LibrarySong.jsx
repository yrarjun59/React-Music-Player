import { playAudio } from "../util";
const LibrarySong  = ({song, setCurrentSong, songs, id, audioRef, isPlaying,setSongs}) => {
 
  const onSelectHandler = async () =>{
    const selectSong = songs.filter(song=>song.id===id)
    await setCurrentSong(selectSong[0])
    // Add active State
    const newSongs = songs.map((song)=>{
      if(song.id===id){
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
    // check if playing
    playAudio(isPlaying, audioRef)
    // if(isPlaying) audioRef.current.play()
    
  }
  return(
    <div onClick = {onSelectHandler} className={`library-song ${song.active?"selected":""}`}>
      <img alt="{song.name}" src={song.cover}></img>
      <div className="song-description">
        <h3>{song.name}</h3>
        <h4>{song.artist}</h4>
      </div>
    </div> 
  )
}

export default LibrarySong;