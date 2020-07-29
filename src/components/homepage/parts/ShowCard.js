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
  const {id, clips, title, company, description} = show;
  const dispatch = useDispatch();
  const { isMuted } = useSelector(state => state);
  const [threshold, setThreshold] = useState(0.5);
  const thresholdArray = useMemo(() => [threshold], [threshold]);
  const [ref, entry] = useIntersect({
    threshold: thresholdArray
  });
  const [currentClipIndex, setCurrentClipIndex] = useState(0);
  useEffect(() => {
    console.log(`ENTRY ${id}`, entry);
    if(entry.isIntersecting){
      if(clips[currentClipIndex]) {
        dispatch(playVideo(clips[currentClipIndex]));
      }
    } else {
      if(clips[currentClipIndex]) {
        dispatch(stopVideo(clips[currentClipIndex]));
      }
    }
    return () => {
      if(clips[currentClipIndex]) {
        dispatch(stopVideo(clips[currentClipIndex]));
      }
    }
  }, [show, dispatch, entry]);

  function changeCurrentClipIndex(newClipIndex) {
    if(entry.isIntersecting){
      dispatch(stopVideo(clips[currentClipIndex]));
      dispatch(playVideo(clips[newClipIndex]));
      setCurrentClipIndex(newClipIndex);
    }
  }

  return (
    <div className="show-card" ref={ref}>
      <div className="clips-wrapper">
        {
          clips.map((clip, i) => {
            const ClipComponent = CLIP_TYPES[clip.type];
            return <ClipComponent key={clip.id} clip={clip} muted={isMuted} isPlaying={ currentClipIndex === i && entry.isIntersecting} onEnded={() => changeCurrentClipIndex((currentClipIndex+1) % clips.length) }/>
          })
        }
      </div>
      <div className="show-blurb">
        <h3>{ title }</h3>
        <h4>{company}</h4>
        { !!clips.length &&
          <div className="clip-controls">
            <button onClick={() => dispatch(setMute(!isMuted)) }>
              <i className="material-icons">
                {isMuted ? 'volume_off' : 'volume_up'}
              </i>
            </button>
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
          description.map((paragraph, i) => <p key={i} dangerouslySetInnerHTML={{ __html: paragraph}} />)
        }
      </div>
    </div>
  );
}


export default ShowCard