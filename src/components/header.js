import FadeLink from '../components/FadeLink'
import FadeAnchorLink from '../components/FadeAnchorLink'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
// import { AnchorLink } from "@uehreka/gatsby-plugin-anchor-links";
import {
  toggleBoringMode
} from '../state/actions';

import './header.scss';

const Header = ({ path, zone, isBoring }) => {
  const dispatch = useDispatch();
  const [navOpen, setNavOpen] = useState(false);
  return (
    <header className="site-header">
      <h1 className="site-title" style={{opacity: (path === '/' && zone === 'INTRO') ? 0 : 1}}>
        <FadeAnchorLink to="/#intro">Chris Uehlinger</FadeAnchorLink>
      </h1>
      <div className="nav-wrapper">
        <button className="nav-toggle" onClick={() => setNavOpen(!navOpen)}>
          <i className="material-icons">menu</i>
        </button>
        <nav className={ navOpen ? 'nav-open' : 'nav-closed'}>
          <ul>
            <li>
              <FadeAnchorLink to="/#about" className={ (zone === 'ABOUT') ? 'current-location' : '' }>About</FadeAnchorLink>
            </li>
            <li>
              <FadeAnchorLink to="/#shows" className={ (zone === 'SHOWS') ? 'current-location' : '' }>Shows</FadeAnchorLink>
            </li>
            <li>
              <FadeAnchorLink to="/#demos" className={ (zone === 'DEMOS') ? 'current-location' : '' }>Demos</FadeAnchorLink>
            </li>
            <li>
              <FadeAnchorLink to="/#talks" className={ (zone === 'TALKS') ? 'current-location' : '' }>Talks</FadeAnchorLink>
            </li>
            <li>
              <FadeLink to="/blog" className={ (zone === 'BLOG') ? 'current-location' : '' }>Blog</FadeLink>
            </li>
            <li>
              <button onClick={ e => dispatch(toggleBoringMode(!isBoring))}>
                <i className="material-icons">flash_on</i>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: '',
}

export default Header
