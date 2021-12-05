'use strict';
// const { ApolloServer, gql } = require('apollo-server');
const { ApolloServer, gql } = require('apollo-server-lambda');
const axios = require('axios');

const typeDefs = gql`
  type Quote {
    id: String
    description: String
    author: String
  }

  type Author {
    name: String
    quote: Quote
  }

  type Query {
    quotes: [Quote]
  }
`;

async function getQuotes() {
  const response = await axios.get(
    'https://search-rs-deploy-codereviews-dev-j46fwg2qqze2sdvzwsxtsfiubq.us-east-1.es.amazonaws.com/quotes/_search',
    {
      auth: {
        username: 'redglasses',
        password: 'RedGlasses1234!',
      },
    },
  );
  const data = response.data;
  const hits = data.hits;
  if (hits !== undefined) {
    const out = [];
    for (const hit of hits.hits) {
      out.push({
        id: hit._id,
        description: hit._source.description,
        author: hit._source.author,
      });
    }
    return out;
  }
  return [];
}

const resolvers = {
  Query: {
    quotes: async () => getQuotes(),
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

exports.graphqlHandler = server.createHandler();
