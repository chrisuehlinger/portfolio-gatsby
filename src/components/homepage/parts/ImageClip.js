import React, { useEffect, useRef } from 'react'
import Img from "gatsby-image"
import './image-clip.scss';

const ImageClip = ({ clip, isPlaying, onEnded }) => {
  const { id, image } = clip;
  // useEffect(() => {
  //   if(isPlaying) {
  //     videoEl.current.play();
  //   } else {
  //     videoEl.current.pause();
  //     videoEl.current.currentTime = 0;
  //   }
  // }, [isPlaying]);
  console.log('IMAGE?', image);
  return (
    <div className="image-clip">
      <Img
        className={isPlaying ? 'playing' : 'hidden'}
        id={id}
        fluid={image.childImageSharp.fluid}
      />
    </div>
  );
}


export default ImageClip