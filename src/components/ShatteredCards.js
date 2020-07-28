import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import Img from 'gatsby-image'
import { shuffle } from 'lodash';
import './shattered-cards.scss';

/*
 * This component is built using `gatsby-image` to automatically serve optimized
 * images with lazy loading and reduced file sizes. The image is loaded using a
 * `StaticQuery`, which allows us to load the image from directly within this
 * component, rather than having to pass the image data down from pages.
 *
 * For more information, see the docs:
 * - `gatsby-image`: https://gatsby.app/gatsby-image
 * - `StaticQuery`: https://gatsby.app/staticquery
 */

const ShatteredCards = ({ src }) => (
  <StaticQuery
    query={graphql`
      query {
        placeholderImages: allFile(filter: {relativePath: {regex: "/images/shattered/character-cards/.*-small.jpg/"}}) {
          edges {
            node {
              id
              childImageSharp {
                fixed(width: 200) {
                  ...GatsbyImageSharpFixed
                }
              }
            }
          }
        }
      }
    `}
    render={data => {
      console.log('SHATTERED DATA', data);
      const images = shuffle(data.placeholderImages.edges).map(edge => <Img key={edge.node.id} fixed={edge.node.childImageSharp.fixed} />)
      return (<span className="shattered-cards">{images}</span>);
    }}
  />
)
export default ShatteredCards