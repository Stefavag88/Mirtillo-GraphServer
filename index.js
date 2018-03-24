const express = require('express');
const {graphqlExpress, graphiqlExpress } = require('graphql-server-express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { makeExecutableSchema } = require('graphql-tools');
const resolvers = require('./Schemas/resolvers');
const schema = require('./Schemas/schema');
const app = express();
require('dotenv').load();

app.use(cors());

const executableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers: resolvers
})

app.use('/graphql', bodyParser.json(), graphqlExpress({
  schema: executableSchema,
  context: {},
}));

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql'
}));

app.listen(8080, () => console.log(
  `GraphQL Server running on http://localhost:8080/graphql`
));