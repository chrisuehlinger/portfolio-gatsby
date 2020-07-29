import React from 'react'
import { StaticQuery, graphql } from "gatsby"
import HomepageWaypoint from './parts/HomepageWaypoint';
import ShowCard from './parts/ShowCard';
import './shows.scss'

const Shows = () => (
  <HomepageWaypoint zone="SHOWS">
    <div className="shows-page" id="shows">
      <h2>Shows</h2>
      <StaticQuery
        query={graphql`
          query ShowQuery {
            allShowsYaml {
              nodes {
                company
                description
                id
                title
                url
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
        render={data => data.allShowsYaml.nodes.map(show => <ShowCard key={show.id} {...show}/>) }/>
    </div>
  </HomepageWaypoint>
);

export default Shows
