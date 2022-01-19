exports.onCreateNode = async ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === `Mdx`) {
    const fileNode = getNode(node.parent)
    if(fileNode.sourceInstanceName === 'posts'){
      // console.log('HMM?', node.frontmatter);
      const date = node.frontmatter.date.toISOString ? node.frontmatter.date.toISOString() : node.frontmatter.date;
      const dateString = date.split('T')[0].replace(/-/g, '/');
      const slug = `/blog/${dateString}/${fileNode.name}`
      // console.log('SLUG', slug);
      node.slug = slug;
      createNodeField({
        node,
        name: `slug`,
        value: slug,
      })
    }
  } 
}
exports.createSchemaCustomization = ({ actions, schema }) => {
  const { createTypes } = actions
  const typeDefs = [
    `type TalksYaml implements Node {
      id: String
      title: String
      company: String
      description: [String]
      clips: [Clip]
    }`,
    `type ShowsYaml implements Node {
      id: String
      title: String
      company: String
      description: [String]
      clips: [Clip]
    }`,
    `type DemosYaml implements Node {
      id: String
      title: String
      company: String
      description: [String]
      clips: [Clip]
    }`,
    schema.buildObjectType({
      name: "Clip",
      fields: {
        image: {
          type: "File",
          resolve: (source, args, context, info) => {
            return context.nodeModel
              .getAllNodes({ type: "File" })
              .find(file => file.relativePath === source.path)
          },
        },
      },
    }),
  ]
  createTypes(typeDefs)
}

const path = require("path")

exports.createPages = async ({ graphql, actions, reporter }) => {
  // Destructure the createPage function from the actions object
  const { createPage } = actions

  const result = await graphql(`
    query {
      allMdx {
        edges {
          node {
            id
            fields {
              slug
            }
          }
        }
      }
    }
  `)

  if (result.errors) {
    reporter.panicOnBuild('🚨  ERROR: Loading "createPages" query')
  }

  // Create blog post pages.
  const posts = result.data.allMdx.edges.filter(post => !!post.node.fields)

  // you'll call `createPage` for each result
  posts.forEach(({ node }, index) => {
    createPage({
      // This is the slug you created before
      // (or `node.frontmatter.slug`)
      path: node.fields.slug,
      // This component will wrap our MDX content
      component: path.resolve(`./src/components/post.js`),
      // You can use the values in this context in
      // our page layout component
      context: { id: node.id },
    })
  });


}