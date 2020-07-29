import React, { useEffect, useMemo, useState, useRef } from 'react'
import { useDispatch } from 'react-redux';
import {
  enterZone,
  exitZone
} from '../../../state/actions';
import {
  useIntersect,
  useWindowSize
} from '../../../hooks';

const HomepageWaypoint = ({ zone, children }) => {
  const dispatch = useDispatch();
  const windowSize = useWindowSize();
  const ref = useRef(null);
  const [threshold, setThreshold] = useState(0.5);
  const thresholdArray = useMemo(() => [threshold], [threshold]);
  const [setNode, entry] = useIntersect({
    threshold: thresholdArray
  });
  useEffect(() => {
    if(ref.current){
      setNode(ref.current);
      let elHeight = ref.current.offsetHeight;
      let viewHeight = windowSize.height;
      if(elHeight > viewHeight){
        let newThreshold = viewHeight / (2*elHeight);
        setThreshold(newThreshold);
      } else {
        setThreshold(0.5);
      }
    }
  }, [windowSize, ref]);
  
  const [hasEntered, setHasEntered] = useState(false);
  useEffect(() => {
    if(!!entry.target){
      console.log(`ENTRY ${zone}`, entry);
      if(entry.isIntersecting && !hasEntered){
        setHasEntered(true);
        dispatch(enterZone(zone));
      } else if(!entry.isIntersecting && hasEntered) {
        setHasEntered(false);
        dispatch(exitZone(zone));
      }
    }
  }, [zone, dispatch, entry, hasEntered]);

  useEffect( () => {
    return () => {
      if(hasEntered) {
        console.log('UNMOUNT', zone);
        setHasEntered(false);
        dispatch(exitZone(zone))
      }
    };
  }, []);

  return (
    <div ref={ref}>
      { children }
    </div>
  )
}

export default HomepageWaypoint
