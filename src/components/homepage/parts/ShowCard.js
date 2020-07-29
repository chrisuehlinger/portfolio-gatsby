import React, { useEffect, useState, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { MDXRenderer } from "gatsby-plugin-mdx"
import {
  playVideo,
  stopVideo,
  setMute
} from '../../../state/actions';
import { useIntersect } from '../../../hooks';
import VideoClip from './VideoClip';
import ImageClip from './ImageClip';
import './show-card.scss';

const CLIP_TYPES = {
  image: ImageClip,
  video: VideoClip
}

const ShowCard = (show) => {
  const {id, clips, title, company, description, url } = show;
  const dispatch = useDispatch();
  const { isMuted } = useSelector(state => state);
  const [threshold, setThreshold] = useState(0.5);
  const thresholdArray = useMemo(() => [threshold], [threshold]);
  const [ref, entry] = useIntersect({
    threshold: thresholdArray
  });
  const [currentClipIndex, setCurrentClipIndex] = useState(0);
  
  const [hasEntered, setHasEntered] = useState(false);
  useEffect(() => {
    if(!!entry.target){
      // console.log(`ENTRY ${id}`, entry);
      if(entry.isIntersecting && !hasEntered){
        setHasEntered(true);
        if(clips[currentClipIndex]) {
          dispatch(playVideo(clips[currentClipIndex]));
        }
      } else if(!entry.isIntersecting && hasEntered) {
        setHasEntered(false);
        if(clips[currentClipIndex]) {
          dispatch(stopVideo(clips[currentClipIndex]));
        }
      }
    }
  }, [show, dispatch, entry, hasEntered]);
  
  useEffect(() => {
    return () => {
      if(hasEntered) {
        console.log(`UNMOUNT ${id}`);
        setHasEntered(false);
        if(clips[currentClipIndex]) {
          dispatch(stopVideo(clips[currentClipIndex]));
        }
      }
    }
  }, []);

  function changeCurrentClipIndex(newClipIndex) {
    if(entry.isIntersecting){
      dispatch(stopVideo(clips[currentClipIndex]));
      dispatch(playVideo(clips[newClipIndex]));
      setCurrentClipIndex(newClipIndex);
    }
  }

  const hasVideos = clips.reduce((acc, clip) => acc || clip.type === 'video', false);

  const ClipComponents = clips.map((clip, i) => {
    const ClipComponent = CLIP_TYPES[clip.type];
    return <ClipComponent key={clip.id} clip={clip} muted={isMuted} isPlaying={ currentClipIndex === i && entry.isIntersecting} onEnded={() => changeCurrentClipIndex((currentClipIndex+1) % clips.length) }/>
  });

  return (
    <div className="show-card" ref={ref}>
      {
        !!url
        ? <a href={url} target="_blank" className="clips-wrapper">{ ClipComponents }</a>
        : <div className="clips-wrapper">{ ClipComponents }</div>
      }
      <div className="show-blurb">
        <h3>
          { 
            !!url
            ? <a href={url} target="_blank">{title}</a>
            : title
          }
        </h3>
        <h4>{company}</h4>
        { !!clips.length &&
          <div className="clip-controls">
            { hasVideos &&
              <button onClick={() => dispatch(setMute(!isMuted)) }>
                <i className="material-icons">
                  {isMuted ? 'volume_off' : 'volume_up'}
                </i>
              </button>
            }
            {
              clips.length > 1 && (
                <>
                  <button onClick={() => changeCurrentClipIndex((currentClipIndex - 1 + clips.length) % clips.length) }>
                    <i className="material-icons">
                      fast_rewind
                    </i>
                  </button>
                  <button onClick={() => changeCurrentClipIndex((currentClipIndex + 1) % clips.length) }>
                    <i className="material-icons">
                      fast_forward
                    </i>
                  </button>
                  <div>
                    { `Playing ${currentClipIndex+1} of ${clips.length}`}
                  </div>
                </>
              )
            }
          </div>
        }
        {
          description.map((paragraph, i) => <div key={i} dangerouslySetInnerHTML={{ __html: `<p>${paragraph}</p>` }} />)
        }
      </div>
    </div>
  );
}


export default ShowCard