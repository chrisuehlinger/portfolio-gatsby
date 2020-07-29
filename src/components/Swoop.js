import React, { useEffect } from 'react'
import {useTransition, animated, config} from 'react-spring'

const Swoop = ({ mount, transitionStatus, current, children }) => {
  const transitions = useTransition(mount, null, {
    from: () => ( 
      current.direction
        ? (
          current.direction === 'left'
          ? { transform: 'translateX(-100vw)' }
          : { transform: 'translateX(100vw)' }
        ) : { opacity: 0 }
      ),
    enter: () => ( 
      current.direction
        ? (
          current.direction === 'left'
          ? { transform: 'translateX(0vw)' }
          : { transform: 'translateX(0vw)' }
        ) : { opacity: 1 }
      ),
    leave: () => ( 
      current.direction
        ? (
          current.direction === 'left'
          ? { transform: 'translateX(100vw)' }
          : { transform: 'translateX(-100vw)' }
        ) : { opacity: 0 }
      ),
    config: config.gentle
  });
  return transitions.map(({ item, key, props }) =>( item && <animated.div key={key} style={props}>{children}</animated.div>))
}

export default Swoop;