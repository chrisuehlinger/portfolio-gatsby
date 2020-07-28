import React from 'react'
import HomepageWaypoint from './parts/HomepageWaypoint';
import { StaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"
import './about.scss'

const About = () => {
  return (
    <HomepageWaypoint zone="ABOUT">
      <div className="about-page" id="about">
        <div className="about-card">
          <div className="about-image-wrapper">
            <StaticQuery
              query={graphql`
                query HeadshotQuery {
                  file(relativePath: { eq: "images/ChrisHeadshot1.jpg" }) {
                    childImageSharp {
                      fluid(maxWidth: 300) {
                        ...GatsbyImageSharpFluid
                      }
                    }
                  }
                }
              `}
              render={data => <Img className="about-image" fluid={data.file.childImageSharp.fluid} /> }/>
            <p className="about-image-caption">Credit: <a href="https://www.shealynjaephotography.com/" target="_blank">Shealyn Jae</a></p>
          </div>
          <div className="about-blurb">
            <p>
            Hi there! My name is Chris Uehlinger. I'm a... well I do a lot of stuff, including web development, projection/video design for theatre, VR development, voiceover work, 3D graphics and I've taught programming both abroad (at โรงเรียนเซนต์คาเบรียล in Bangkok) and stateside (through talks at charmCityJS and volunteering for Baltimore NodeSchool).
            </p>
          </div>
        </div>
      </div>
    </HomepageWaypoint>
  );
}

export default About
