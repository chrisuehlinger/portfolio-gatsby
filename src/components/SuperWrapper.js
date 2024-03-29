import React from 'react';
import { StaticQuery, graphql } from 'gatsby'
import { useSelector, useDispatch } from 'react-redux'
import {useTransition, animated, config} from 'react-spring'
import SceneWrapper from './SceneWrapper'
import Header from './header';


import './reset.css'
import './super-wrapper.scss'

const SuperWrapper =  (props) => {
  typeof window !== 'undefined' && console.log('PROPS', props);
  const { children, path } = props;
  const dispatch = useDispatch();
  const reducerState = useSelector(state => state);
  console.log('STATE', reducerState);
  const {
    zone,
    isBoring
  } = reducerState;
  const isLoaded = true;

  
  const transitions = useTransition(!isLoaded, null, {
    from: { opacity: 1 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: config.molasses
  });

  return (
    <div className={ "page-wrapper" + (isBoring ? ' is-boring' : ' not-boring') }>
      {!isBoring && <SceneWrapper dispatch={dispatch} reducerState={reducerState}/> }
      <div className={'inner-page-wrapper ' + (isLoaded ? 'has-loaded' : 'is-loading')}> 
        <StaticQuery
          query={graphql`
            query SiteTitleQuery {
              site {
                siteMetadata {
                  title
                }
              }
            }
          `}
          render={data => (
            <>
              <Header siteTitle={data.site.siteMetadata.title} path={path} zone={zone} isBoring={isBoring}/>
              {children}
            </>
          )}
        />
      </div>
    </div>
  );
}


export default SuperWrapper