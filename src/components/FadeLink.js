import React from 'react'
import TransitionLink from 'gatsby-plugin-transition-link'

const FadeLink = ({ to, children, style, className }) => (
  <TransitionLink to={to} exit={{ length: 1.5 }} style={style} className={className}>
    {children}
  </TransitionLink>
)


export default FadeLink