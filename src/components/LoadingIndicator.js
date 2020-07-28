import React from 'react'
import './loading-indicator.scss';

const LoadingIndicator = ({ progress }) => (
  <div className="loading-indicator">
    <p>{ `Loading ${progress}%` }</p>
  </div>
)
export default LoadingIndicator
