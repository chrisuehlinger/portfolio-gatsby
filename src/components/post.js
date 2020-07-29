import React, { useEffect } from 'react'
import { graphql } from "gatsby"
import { MDXProvider } from "@mdx-js/react"
import { MDXRenderer } from "gatsby-plugin-mdx"
import Link from 'gatsby-plugin-transition-link'
import { AnchorLink } from "@uehreka/gatsby-plugin-anchor-links";
import { useDispatch } from 'react-redux';
import {
  enterZone,
  exitZone
} from '../state/actions';
import CodeBlock from './CodeBlock'
import ShatteredCards from './ShatteredCards'
import Swoop from './Swoop'
import Layout from './layout'
import './post.scss'

const shortcodes = {
  Link,
  AnchorLink,
  pre: CodeBlock,
  ShatteredCards
} // Provide common components here


const Post = ({ data: { mdx } }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(enterZone('BLOG'));
    return () => dispatch(exitZone('BLOG'));
  }, []);
  return (
    <Layout transitionComponent={Swoop}>
      <div className="blog-post">
        <h1>{mdx.frontmatter.title}</h1>
        <p className="post-date">{mdx.frontmatter.date.split('T')[0]}</p>
        <MDXProvider components={shortcodes}>
          <MDXRenderer>{mdx.body}</MDXRenderer>
        </MDXProvider>
      </div>
    </Layout>
  );
}

export const pageQuery = graphql`
  query BlogPostQuery($id: String) {
    mdx(id: { eq: $id }) {
      id
      body
      frontmatter {
        title,
        date
      }
    }
  }
`

export default Post
