const {ApolloServer} = require("apollo-server")
const { typeDefs } = require("./schema/typeDefs")
const { resolvers } = require("./schema/resolvers")

/*
typeDefs: is a function which defines the different types of API call OR Queries in GQL
resolvers: is also a function which takes the call and resolve the API Call for GQL query

Both of these are defined inside "schema" folder.
 */
const server = new ApolloServer({typeDefs, resolvers});

/*
Using Context for authentication => const server = new ApolloServer({typeDefs, resolvers, context:()=>{
                                                return {name:"Anyone"}
                                                }});
    we can now access this "name" parameter using context inside resolver functions.
 */

server.listen().then(({url})=>{
    console.log(`YOUR API IS RUNNING AT: ${url} :)`);
})