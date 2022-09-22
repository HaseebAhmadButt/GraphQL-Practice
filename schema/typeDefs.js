const { gql } = require("apollo-server");

/*
This file contains all the schemas about our API, but to solve this schema, we need a resolver
which is defined in Resolver.js file.
 */

/*
                                    GQL Fragments
    This should be read after whole file is read already. Fragments in GQL is way of representing a request in which
    instead of rewriting the fields again, and again we define a "variable" called as fragment which will hold thos fields
    and whenever we try to want those fields we just need to call that fragment/variable.
    The syntax to declare the variable/fragment is:

    fragment <fragmentName> on <whichType like "User" in our case> {
        name of fields we want to embed, like,

        id
        name
        username
        age
    }

    to run fragment inside Query, the syntax is:

    query <QueryName> {
        users{
            ...fragmentName
        }
    }
 */
const typeDefs = gql`
    
        
    #    Below Lines of Code is just accepting any user which can have any kind of Nationality. We can restrict it
    #    by using enums
    #    type User{
    #        id: ID!
    #        name: String!
    #        username:String!
    #        age:Int!
    #        nationality: String!
    #    }
    
    
    #So, below we are crating an ENUM, which act as same as in JAVA. Then we are passing these ENUMS as condition
    #in our "user" type, which will only accept those users which have "nationality" same as defined in 
    #ENUM
    
    enum Nationality{
        CANADA
        BRAZIL
        CHILE
        INDIA
    }
    
    #
    type User{
        id: ID!
        name: String!
        username:String!
        age:Int!
        nationality: Nationality!
        
    #    If any of the user don't have any friends then below value will be null, otherwise we will get 
    #    friends of type User.
        
        friends:[User!]
    
    #   The new field we are adding now, is not defined in "FakeData.js", but we can fetch it based on
    #   resolvers. So, we can also define resolvers for any field inside any "Type", using that specific 
    #   type name.
    #   Go, to "resolver.js" file and define a resolver for this specific field.
        favouriteMovies: [Movie]
    }
    type Movie{
        id:ID!
        name:String!
        yearOfPublication:Int!
        isInTheaters:Boolean!
    }
    
#    "input" type describes which fields will be taken for mutation, as described in portion of mutation. 
    input CreateUserInput{
#        We can define a default value as:  "age:Int = 18" => This says, if age is available, then take it
#        otherwise its value will be "18". We can define it, when we were defining the type, but that
#        describes the complete structure of "User". So we don it when we are mutating the data.
        name: String!
        username:String!
        age:Int!
#       If no nationality is passed, then BRAZIL will be selected.
        nationality: Nationality = BRAZIL
    }
    
    input UpdateUserName{
        id: ID!
        newUsername:String!
    }
    input DeleteUser{
        id: ID!
    }
    
#    Now, we want to update the users or we want to create OR delete a user. So, for that purposes 
#    we use mutations. The syntax is pretty easy, we just need to define a type named as "Mutation".
#    Then we need to define function which will do the work of creating a specific user, like "creating user"
    type Mutation{
#        There are different ways to pass the fields of "User" as arguments, which are:
#         1: passing the fields of type as arguments directly. 
#          creatUser(
#              name: String
#              username:String
#              age:Int
#              nationality: Nationality
#          ): User!
        
#        2: Declaring an input type, it defines/describes the fields which we will get to 
#        create, update, delete the a specific user, as defined above named as "CreateUserInput"
        creatUser(input: CreateUserInput!): User!
        
        updateUsername(input: UpdateUserName!): User
        
        deleteUser(id: ID!): User
    }
        type Query{
#            Below line of code can't handle the error, so adding error handling capabilities.
#            users: [User!]!
            
            users: UserResult
    #      Defining another Query For User
    #      We are receiving a request for user of specific ID, and returning it. Now, resolving it. 
            user(id: ID!): User
            
    #-----------------------------------------------------------------------------------------------------
    #        Doing the same thing for Movie type, as we did for "User" type
            movies:[Movie!]!
            movie(name: String):Movie!
        }
    
    
    #-------------------------------------------------------------------------------------------------------
#    Handling Errors in GQL using "unions"
#    One type is the required data and the second type is error. We creating a union of these two if any error
#    occurs that will be passed instead of original requested data.
    
#    To use this go to resolvers file and create resolver of union.
    
    type UserSuccessFulResult{
        users: [User!]!
    }
    type UserErrorResult{
        message:String!
    }
    union UserResult = UserSuccessFulResult | UserErrorResult
    
#    The query Syntax for calling the union is:

    #    query ExampleQuery{
#        users{
#           ...on UserSuccessFulResult{
#                   users{
#                       id
#                       name
#                       age}}
#           ...on UserErrorResult{
#               message
#               }   
    #    }}
    
    
    
    `;

module.exports = { typeDefs }