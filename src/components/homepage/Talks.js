import React from 'react'
import { StaticQuery, graphql } from "gatsby"
import HomepageWaypoint from './parts/HomepageWaypoint';
import ShowCard from './parts/ShowCard';
import './talks.scss'

const Talks = () => (
  <HomepageWaypoint zone="TALKS">
    <div className="talks-page" id="talks">
      <h2>Talks</h2>
      <StaticQuery
        query={graphql`
          query TalkQuery {
            allTalksYaml {
              nodes {
                company
                description
                id
                title
                clips {
                  height
                  id
                  src
                  type
                  width
                  image {
                    childImageSharp {
                      fluid(maxWidth: 300) {
                        ...GatsbyImageSharpFluid
                      }
                    }
                  }
                }
              }
            }
          }
        `}
        render={data => data.allTalksYaml.nodes.map(talk => <ShowCard key={talk.id} {...talk}/>) }/>
    </div>
  </HomepageWaypoint>
);

export default Talks
