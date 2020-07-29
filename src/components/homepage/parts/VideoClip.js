import React, { useEffect, useRef } from 'react'
import './video-clip.scss';

const VideoClip = ({ clip, muted, isPlaying, onEnded }) => {
  const { id, src } = clip;
  const videoEl = useRef(null);
  useEffect(() => {
    if(videoEl.current){
      if(isPlaying) {
        videoEl.current.play();
      } else {
        videoEl.current.pause();
        videoEl.current.currentTime = 0;
      }
    }
  }, [videoEl, isPlaying]);
  return (
    <div className="video-clip">
      <video
        className={isPlaying ? 'playing' : 'hidden'}
        id={id}
        src={src}
        ref={videoEl}
        crossOrigin="anonymous"
        preload="auto"
        playsInline
        onEnded={ onEnded }
        muted={muted}
      ></video>
    </div>
  );
}


export default VideoClip