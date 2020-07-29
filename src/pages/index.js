import React from "react"
import { graphql } from 'gatsby';
import SEO from '../components/seo'
import IntroPage from '../components/homepage/Intro'
import AboutPage from '../components/homepage/About'
import ShowsPage from '../components/homepage/Shows'
import DemosPage from '../components/homepage/Demos'
import TalksPage from '../components/homepage/Talks'

import Wrapper from '../components/wrapper'

const Index = (props) => {
  console.log('INDEX PROPS', props);
  return (
    <Wrapper>
      <main className="homepage-body">
        <SEO title="Home" />
        <IntroPage />

        <AboutPage />

        <ShowsPage />

        <DemosPage />

        <TalksPage />
      </main>
    </Wrapper>
  );
}

export default Index;
