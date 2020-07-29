import React, { useEffect } from "react"
import { graphql } from "gatsby"
import { useDispatch } from 'react-redux';
import {
  enterZone,
  exitZone
} from '../state/actions'
import Swoop from '../components/Swoop'
import FadeLink from '../components/FadeLink'
import Layout from '../components/layout'

const BlogIndex = ({ data }) => {
  const posts = data.allMdx.edges.filter(post => !!post.node.fields)

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(enterZone('BLOG'));
    return () => dispatch(exitZone('BLOG'));
  }, [dispatch]);

  return (
    <Layout transitionComponent={Swoop}>
      <h1>Blog</h1>
      <ul>
        {posts.map(({ node: post }) => (
          <li key={post.id}>
            <FadeLink to={post.fields.slug}>
              <h2>{post.frontmatter.title}</h2>
            </FadeLink>
            <div className="post-date">{post.frontmatter.date.split('T')[0]}</div>
            <p>{post.excerpt}</p>
          </li>
        ))}
      </ul>
    </Layout>
  )
}

export const pageQuery = graphql`
  query blogIndex {
    allMdx(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          id
          excerpt
          frontmatter {
            title,
            date
          }
          fields {
            slug
          }
        }
      }
    }
  }
`

export default BlogIndex