import React from 'react'

import Wrapper from './wrapper'
import './layout.scss'

const Layout = ({ children }) => (
  <Wrapper>
    <main className="page-body">
      {children}
    </main>
  </Wrapper>
)

export default Layout
