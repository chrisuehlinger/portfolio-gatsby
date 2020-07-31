const path = require('path')

module.exports = {
  siteMetadata: {
    title: 'Chris Uehlinger\'s Portfolio',
    description: `I'm a developer, 3D artist, projection designer, stage/voice actor and teacher based in Baltimore, MD`,
    author: 'Chris Uehlinger',
  },
  plugins: [
    `gatsby-plugin-sass`,
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/src/pages`
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `posts`,
        path: `${__dirname}/src/posts`
      }
    },
    {
      resolve: 'gatsby-transformer-yaml-full',
      options: {
        plugins: [
          {
            resolve: 'gatsby-yaml-full-markdown',
            options: {
              unwrapSingleLine: true
            }
          }
        ],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/src/data`,
      },
    },
    'gatsby-transformer-sharp',
    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        defaultQuality: 75,
      },
    },
    `gatsby-remark-images`,
    `gatsby-remark-external-links`,
    `gatsby-remark-embed-video`,
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        defaultLayouts: {
          default: path.resolve('./src/components/layout.js'),
          posts: path.resolve('./src/components/post.js')
        },
        rehypePlugins: [
          require('rehype-slug'),
          require('rehype-autolink-headings')
        ],
        remarkPlugins: [
          require('remark-unwrap-images')
        ],
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 700,
              showCaptions: true,
              // markdownCaptions: true
            },
          },
          {
            resolve: `gatsby-remark-external-links`,
            options: {
              // target: `_self`,
              rel: `nofollow`
            }
          },
          {
            resolve: `gatsby-remark-embed-video`,
            options: {
              width: 700,
              ratio: 1.77, // Optional: Defaults to 16/9 = 1.77
              height: 400, // Optional: Overrides optional.ratio
              related: false, //Optional: Will remove related videos from the end of an embedded YouTube video.
              noIframeBorder: true, //Optional: Disable insertion of <style> border: 0
              urlOverrides: [
                // {
                //   id: 'youtube',
                //   embedURL: (videoId) => `https://www.youtube-nocookie.com/embed/${videoId}`,
                // }
              ], //Optional: Override URL of a service provider, e.g to enable youtube-nocookie support
              containerClass: 'embedVideo-container', //Optional: Custom CSS class for iframe container, for multiple classes separate them by space
            }
          }
        ],
      },
    },
    {
       resolve: "gatsby-plugin-transition-link",
       options: {
           layout: require.resolve(`./src/components/SuperWrapper.js`)
         }
    },
    {
      resolve: `@uehreka/gatsby-plugin-anchor-links`,
      options: {
        offset: 0
      }
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        // The property ID; the tracking code won't be generated without it
        trackingId: "UA-47996879-1",
        // Defines where to place the tracking script - `true` in the head and `false` in the body
        head: false,
        // Setting this parameter is optional
        anonymize: false,
        // Setting this parameter is also optional
        respectDNT: false,
        // Avoids sending pageview hits from custom paths
        // exclude: ["/preview/**", "/do-not-track/me/too/"],
        // Delays sending pageview hits on route update (in milliseconds)
        pageTransitionDelay: 0,
        // Enables Google Optimize using your container Id
        // optimizeId: "YOUR_GOOGLE_OPTIMIZE_TRACKING_ID",
        // Enables Google Optimize Experiment ID
        // experimentId: "YOUR_GOOGLE_EXPERIMENT_ID",
        // Set Variation ID. 0 for original 1,2,3....
        // variationId: "YOUR_GOOGLE_OPTIMIZE_VARIATION_ID",
        // Defers execution of google analytics script after page load
        // defer: true,
        // Any additional optional fields
        // sampleRate: 5,
        // siteSpeedSampleRate: 10,
        // cookieDomain: "chrisuehlinger.com",
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Chris Uehlinger's Website`,
        short_name: 'Chris Uehlinger',
        start_url: '/',
        background_color: '#663399',
        theme_color: '#663399',
        display: 'standalone',
        icon: 'src/pages/images/icon.png', // This path is relative to the root of the site.
      },
    },
    // 'gatsby-plugin-ngrok-tunneling',
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.app/offline
    // 'gatsby-plugin-offline',
  ],
}
