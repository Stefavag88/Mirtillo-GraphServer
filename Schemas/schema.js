// Simple Product schema
const typeDefs = `
type Product {
  id: String
  name: String!
  category: String!
  description: String
  available: Boolean
}

type Query {
  products(limit: Int!): [Product]
  product(id: String!): Product
}

type Mutation{
    createProduct(name: String!, category: String!, description: String!, available: Boolean) : Product
}

schema{
    query: Query
    mutation: Mutation
}`
;


module.exports = typeDefs;
