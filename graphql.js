//const { ApolloServer, gql } = require('apollo-server');
const { ApolloServer, gql } = require('apollo-server-lambda');
const axios = require('axios');

const typeDefs = gql`

  type Quote {
    id: String,
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

/*
const quotes = [
  {
    id: "1",
    description: 'Best price, awesome service. They go the extra mile.',
    author: 'Alexis',
  },
  {
    id: "2",
    description: 'I have never in my life received such great customer service.',
    author: 'Carli',
  },
  {
    id: "3",
    description: 'Great place to work/visit!',
    author: 'Terry',
  },
  {
    id: "4",
    description: 'Everyone I met was very friendly, the office was hip and fun, and it has great views',
    author: 'Michael'
  },
  {
    id: "5",
    description: 'I rented a book for one of my classes on the website and when I found out I didn\'t need it anymore I reached out and let them know that I needed a refund and they were very helpful and quick to respond. I will definitely be doing business with them again.',
    author: 'K M'
  },
  {
    id: "6",
    description: 'I would definitely recommend this company! I bought an e-book that I didn\'t end up needing. I figured I would be unable to return it since it was an e-book. RedShelf allowed me to return the e-book and refunded me in full, with exceptionally fast and friendly service. I will most definitely shop here in the future!',
    author: 'Cassee'
  },
  {
    id: "7",
    description: 'I was looking into buying a text book for law school and got the wrong one. I looked at the refund policy and reached out. Within MINUTES, they refunded the full amount without any problem. Great company overall',
    author: 'Dallas'
  },
  {
    id: "8",
    description: 'I absolutely love redshelf! I frequently rent college textbooks from this site. The online annotation features are very useful and I use the flashcard option to study for almost all of my exams. When I had an issue and reached out to the company, they responded very quickly and solved my problem!',
    author: 'Alecia'
  }
];
*/

async function getQuotes() {
    console.log('getQuotes');
    let response = await axios.get(
      'https://search-rs-deploy-codereviews-dev-j46fwg2qqze2sdvzwsxtsfiubq.us-east-1.es.amazonaws.com/quotes/_search', 
      {
        auth: {
          username: 'redglasses',
          password: 'RedGlasses1234!'
        }
      }
    );
    /*
    let response = await esClient.search({
      index: "quotes"
    });*/
    console.log('response:' + response);
    let out = [];
    for (let hit of response.data.hits?.hits) {
      console.log('response.data:' + JSON.stringify(hit));
      out.push({id: hit._id, description: hit._source.description, author: hit._source.author});
    }
    return out;  
}


// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    quotes: async () => getQuotes()
  },
};


// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

exports.graphqlHandler = server.createHandler();

//server.listen().then(({ url }) => {
//  console.log(`🚀  Server ready at ${url}`);
//});
