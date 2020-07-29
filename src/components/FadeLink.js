import React from 'react'
import TransitionLink from 'gatsby-plugin-transition-link'
import { useLocation } from "@reach/router"

const FadeLink = ({ to, children, style, className }) => {
  const location = useLocation();
  console.log('LOCATION', location);
  const from = location.pathname;
  const direction = (from.length > to.length) ? 'left' : 'right';
  console.log('DIRECTION', direction, from, to);
  return (
    <TransitionLink to={to} exit={{ length: 1.5, state: {direction} }} entry={ { state: {direction}}} style={style} className={className}>
      {children}
    </TransitionLink>
  )
}


export default FadeLink