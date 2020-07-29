import React from "react"
import { useSelector, useDispatch } from 'react-redux'
import {useTransition, animated, config} from 'react-spring'
import SEO from '../components/seo'
import IntroPage from '../components/homepage/Intro'
import AboutPage from '../components/homepage/About'
import ShowsPage from '../components/homepage/Shows'
import DemosPage from '../components/homepage/Demos'
import TalksPage from '../components/homepage/Talks'

import Swoop from '../components/Swoop';
import Wrapper from '../components/wrapper'

const Index = (props) => {
  console.log('INDEX PROPS', props);
  const { isLoaded, loadingProgress } = useSelector(state => state);
  
  const transitions = useTransition(!isLoaded, null, {
    from: { opacity: 1 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: config.molasses
  });
  return (
    <Wrapper transitionComponent={Swoop}>
      <main className={'homepage-body ' + (isLoaded ? 'has-loaded' : 'is-loading')}>
        { 
          transitions.map(({ item, key, props }) =>
            item && <animated.div key={key} style={props} className="loading-indicator">{ `Loading ${loadingProgress}%` }</animated.div>
          )
        }
        <SEO title="Home" />
        <IntroPage />

        <AboutPage />

        <ShowsPage />

        <DemosPage />

        <TalksPage />
      </main>
    </Wrapper>
  );
}

export default Index;
