import React from 'react';
import { StaticQuery, graphql } from 'gatsby'
import { useSelector, useDispatch } from 'react-redux'
import SceneWrapper from './SceneWrapper'
import Header from './header';

import './reset.css'
import './super-wrapper.scss'

const SuperWrapper =  (props) => {
  console.log('PROPS', props);
  const { children, path } = props;
  const dispatch = useDispatch();
  const reducerState = useSelector(state => state);
  console.log('STATE', reducerState);
  const {
    zone,
    isLoaded
  } = reducerState;

  return (
    <div className="page-wrapper">
      <SceneWrapper dispatch={dispatch} reducerState={reducerState}/>
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
              <Header siteTitle={data.site.siteMetadata.title} path={path} zone={zone}/>
              {children}
            </>
          )}
        />
      </div>
    </div>
  );
}


export default SuperWrapper