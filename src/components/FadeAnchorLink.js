import React from 'react'
import { AnchorLink } from "@uehreka/gatsby-plugin-anchor-links";
import { useLocation } from "@reach/router"

const FadeAnchorLink = ({ to, children, style, className }) => {
  const location = useLocation();
  console.log('LOCATION', location);
  const from = location.pathname;
  const direction = (from.length > to.split('#')[0].length) ? 'left' : 'right';
  console.log('DIRECTION', direction, from, to);
  return (
    <AnchorLink to={to} exit={{ length: 1.5, state: {direction} }} entry={ { state: {direction}}} style={style} className={className}>
      {children}
    </AnchorLink>
  )
}


export default FadeAnchorLink