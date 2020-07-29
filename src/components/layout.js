import React from 'react'

import Swoop from './Swoop';
import Wrapper from './wrapper'
import './layout.scss'

const Layout = ({ transitionComponent, children }) => {
  return (
    <Wrapper transitionComponent={Swoop}>
      <main className="page-body">
        {children}
      </main>
    </Wrapper>
  );
}

export default Layout
