const neo4j = require('neo4j-driver').v1;
const slugify = require('slugify');
const Product = require('../Models/Product');
require('dotenv').load();
// create Neo4j driver instance, here we use a Neo4j Sandbox instance. See neo4j.com/sandbox-v2, Recommendations example dataset
let driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD));

const resolveFunctions = {
  Query: {
    // here we define the resolver for the movies query, which searches for movies by title
    // params object contains the values for the substring and limit parameters 
    products(_, params) {
      // query Neo4j for matching products
      let session = driver.session();
      let query = "MATCH (product:Product) RETURN product LIMIT $limit;"
      return session.run(query, params)
        .then(result => { return result.records.map(record => { return record.get("product").properties }) })
    },
    product(_, params) {
      //query Neo4j for finding product by ID
      let session = driver.session();
      let id = params.id;
      let query = `MATCH (p:Product{id:"${id}"}) return p;`;
      return session.run(query, params)
        .then(result => {
          session.close();
          const properties = result.records[0].get("p").properties; 
          const {id, name, category, description, available} = properties;

          return new Product(id, name, category, description, available);
         })
         .catch(err => {
           session.close();
           throw(err);
         })
    }
  },
  Product: {
    // the matching field in the Product type is an array of matching products
  },
  Mutation: {
    createProduct(_, args) {
      let { name, category, description, available } = args;
      if (available === undefined) available = false;
      let productId = slugify(name, { lower: true });

      const session = driver.session();
      const createPromise = session.writeTransaction(tx => {
        const result = tx.run(`CREATE (p: Product {id: {id}, 
                                                              name: {name}, 
                                                              category: {category}, 
                                                              description: {description}, 
                                                              available: {available}}) 
                                RETURN p`,
                                {id:productId,name,category, description, available}
        );
        return result;
      }
      );

      createPromise
        .then(res => {
          const [result] = res.records.map(record => {
            return record.get('p').properties;
          });
          session.close();
          const product = new Product(result.id, result.name, result.description, result.category, result.available);
          return product;
        })
        .catch(err => {
          session.close();
          throw(err);
        });
    }
  }
};

module.exports = resolveFunctions;
