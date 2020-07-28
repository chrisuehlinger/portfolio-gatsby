import React from 'react'
import HomepageWaypoint from './parts/HomepageWaypoint';
import './intro.scss'

const Intro = () => {
  return (
    <HomepageWaypoint zone="INTRO">
      <div className="intro-page" id="intro">
        <h1 className="intro-title">Chris Uehlinger</h1>
      </div>
    </HomepageWaypoint>
  );
}

export default Intro
