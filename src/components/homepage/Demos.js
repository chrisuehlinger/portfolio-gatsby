import React from 'react'
import { StaticQuery, graphql } from "gatsby"
import HomepageWaypoint from './parts/HomepageWaypoint';
import ShowCard from './parts/ShowCard';
import './demos.scss'

const Demos = () => (
  <HomepageWaypoint zone="DEMOS">
    <div className="demos-page" id="demos">
      <h2>Demos</h2>
      <StaticQuery
        query={graphql`
          query DemoQuery {
            allDemosYaml {
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
        render={data => data.allDemosYaml.nodes.map(demo => <ShowCard key={demo.id} {...demo}/>) }/>
    </div>
  </HomepageWaypoint>
);

export default Demos
