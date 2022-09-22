import React from "react";
import {ApolloClient, InMemoryCache, ApolloProvider} from "@apollo/client";
import Allusers from "./Allusers";

function App() {
  const client = new ApolloClient({
        cache: new InMemoryCache(),
          uri:"http://localhost:4000/graphql"
      });
  return (
      <ApolloProvider client={client}>
            <div className="App">
                {/*<h1>List of Users</h1>*/}
                <Allusers />
            </div>
      </ApolloProvider>
  );
}

export default App;
