import React from 'react'
import { TransitionState } from "gatsby-plugin-transition-link";
import {useTransition, animated, config} from 'react-spring'

const Fade = ({ mount, children }) => {
  const transitions = useTransition(mount, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: config.gentle
  });
  return transitions.map(({ item, key, props }) =>( item && <animated.div key={key} style={props}>{children}</animated.div>))
}

const Wrapper = props => {
  // console.log('INNER PROPS', props);
  const { children, transitionComponent } = props;
  const TransitionComponent = transitionComponent || Fade;
  return (
    <TransitionState>
      {function({mount, transitionStatus, current}) {
        console.log('STATUS', arguments[0], mount, transitionStatus)
        return <TransitionComponent mount={mount} transitionStatus={transitionStatus} current={current.state}>{children}</TransitionComponent>}
      }
    </TransitionState>
  );
}

export default Wrapper
