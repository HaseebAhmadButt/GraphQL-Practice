const {UserList, MovieList} = require("../FakeData"), _ = require("lodash");

// "resolvers" is the array which contains all the functions to solve the query.

//any resolver function has 4 parameters all are optional. We have used functions with two parameters. Those 4 parameters are
//user: (parent, arg, context, info)
/*
    parent => This provides the parent of calling function. Example, in "users" we have field called as "friends"
    if we access that field inside the "user" query then "parent" will give us "user" back.

    args => It is used to access arguments passed to fetch data

    context => It is used to pass data that is global to all resolver functions. It also provides a lot of information
    regarding the request, engine, server, client, etc. It is used for authentication. Its example is at index.js file.

    info => It provides information regarding the GQL request, like in context but not anything else.
 */
const resolvers = {

    //First line for resolving the query is always starts with "Query". So,
    Query: {
        //Below line defines the function which will resolve the query for "users"

        // users(){
        // Another way to declare function is, using arrow functions:
        users: () => {
            //In this function we are actually implementing the procedure of processing the data for request
            // return UserList;
            //    Now start the server using "npm start" this should run Apollo Server
            //    Once the server start we can actually run our GQL queries in it, and it will return the data
            //    according to the specified fields in the request.

        //    Above works fine for situation when there is no error, now to handle errors

            if(UserList) return {users: UserList};

            return {message: "There was some sort of error"}




        },

        //when we are resolving a query based on parameter, the first argument is always "parent"
        //which is not understood yet. The "second argument" is the data based on which
        //we are going to search.

        user: (parent, arg) => {

            // "arg" variable is containing the "id" variable, so first extracting it, then
            // using "lodash" library, which takes in the objects out which we want to find a
            // specific object and then a second argument, which tells which field of object should
            //  match to say it is the result.
            const id = arg.id
            //We are actually passing "id" as number, but request parameters are returning it as
            //"String", wo we need to convert it to number before solving it. Because
            //Required parameter in "typeDefs" if of type "ID"
            const user = _.find(UserList, {id: Number(id)})
            return user
        },


        //    Movie Resolvers
        movies: () => {
            return MovieList
        },

        movie: (parent, args) => {
            const name = args.name
            //We are actually passing "id" as number, but request parameters are returning it as
            //"String", wo we need to convert it to number before solving it. Because
            //Required parameter in "typeDefs" if of type "ID"
            const movie = _.find(MovieList, {name})
            return movie
        },
    },

    //-----------------------------------------------------------------------------------------------
    /*
            Below is the code for how to define a resolver for any specific field of any specific
            type. This says that "inside User Type", execute this feature of user.
     */
    User: {
        favouriteMovies: () => {
            return _.filter(MovieList, (movie) =>
                movie.yearOfPublication >= 2000 && movie.yearOfPublication <= 2010
            );
        }
    },

    /*
            Below is the code for how to define a resolver for CRUD operation of Data.
             This says that Create, Update, Delete, the data, using mutations
     */
    Mutation: {
        creatUser: (parent, args) => {
            const user = args.input;
            const lastId = UserList[UserList.length-1].id;
            user.id = lastId+1;
            UserList.push(user);
            return user;
        },
    //    Creating Mutation for updating the user, it will be a just runtime change and will be lost after restarting the server
        updateUsername: (parent, args) =>{
          const {id, newUsername} = args.input;
          let userUpdated;
          UserList.forEach((user)=>{
              if(user.id === Number(id)){
                  user.username = newUsername;
                  userUpdated = user;
              }
          });
          return userUpdated;
        },

        deleteUser: (parent, args) => {
            let id = args.id;
            _.remove(UserList, (user) => user.id === Number(id));
            return null
        }
    },

    UserResult:{
        __resolveType(obj){
        //    Now, go and change the resolver which is returning, "UserList", now change add code to this function to check for errors
            if(obj.users){
                return "UserSuccessFulResult";
            }
            if(obj.message){
                return "UserErrorResult";
            }

            return null;
        }
    }
    };
/*
This is responsible for resolving the query meaning. On "typeDefs", we are defining the API and in this
file we are writing the meaning of that query. For Example: if a request says "users", then "typeDefs"
will define the returning property OR the way this "users" can be requested. But on the other
hand "resolvers" will resolve this query meaning they will actually provide the required data to
the request.
 */

/*
The syntax is to create "resolvers" is explained below.
 */

module.exports = {resolvers}