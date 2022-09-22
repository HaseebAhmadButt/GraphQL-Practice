import React, {useState} from "react";
import {useQuery, gql, useLazyQuery, useMutation} from "@apollo/client";


const QUERY_ALL_USERS = gql`
#    Below words are not defined inside client side that is why we are getting errors, but it is running exactly as required.
    query Users {
        users {
            id
            name
            username
#            nationality
            age
#            favouriteMovies {
#                id
#                name
#                yearOfPublication
#            }
        }
    }
`;

const QUERY_ALL_MOVIES = gql`
    query getMovies{
        movies {
            id
            name
            yearOfPublication
        }
    }
`;

const  GET_MOVIE_BY_NAME = gql`
    query Movie($name: String) {
        movie(name:$name){
            id
            name
            yearOfPublication
        }
    }
`;

const CREATE_USER_MUTATION = gql`
    mutation CreateUser($input: CreateUserInput!)
    {
        creatUser(input: $input){
            id
            name
            nationality
        }

    }
`;

const Allusers = () =>{
    const [movieSearched, setMovieSearched] = useState("");

    //Storing the values of Field Entered during the creation of user.
    const [name, setName] = useState("");
    const [username, setUserName] = useState("");
    const [age, setAge] = useState();
    const [nationality, setNationality] = useState("");

    //We can do this with ease by just adding a single object to a state with names of each field as parameters and
    //changing the value of specific field whenever any text field gets changed.
    //------------------------------------------------------------------


    //Along with these, this hook also provides us a function to re-fetch data, which we can use to re-fetch after some operations
    const { data, loading, error, refetch } = useQuery(QUERY_ALL_USERS);

    //We can rename the data, loading, error to different variables as we did in next line.
    const { data: MovieData, loading: Loading, error: Error} = useQuery(QUERY_ALL_MOVIES);

    //To fetch data based on specific name of movie or any other form of data based on requirement, we use
    //useLazyQuery hooks
    const [
        fetchMovie,
        {data: movieSearchedData, error: MovieError},
        ] = useLazyQuery(GET_MOVIE_BY_NAME)

    //For mutation we have a hook, named as useMutation;
    const [createUser] = useMutation(CREATE_USER_MUTATION);

    //if data is available
    if(data){
        console.log(data)
    }
    // //during fetching the data, show this field
    if(loading){
        return (<h1>Loading the Data</h1>)
    }
    // //If any error occurs, then execute this
    if(error){
        console.log("Error Occurred")
        console.log(error)
    }
    // console.log(data.users)
    const Data = data.users.map((user) => {
        return(
            <div>
                <h1>Name: {user.name}</h1>
                <h1>User-Name: {user.username}</h1>
                <h1>Age: {user.age}</h1>
                <h1>Nationality: {user.nationality}</h1>
            </div>
        )
    });
    return (
        <div>
              <div>
                  <input
                      type={'text'}
                      placeholder={'Name'}
                      onChange={
                          (event) =>{ setName(event.target.value)
                          }}
                  />
                  <input
                      type={'text'}
                      placeholder={'UserName'}
                      onChange={
                          (event) =>{ setUserName(event.target.value)
                          }}
                  />
                  <input
                      type={'number'}
                      placeholder={'Age'}
                      onChange={
                          (event) =>{
                              setAge(Number(event.target.value))
                          }}
                  />
                  <input
                      type={'text'}
                      placeholder={'Nationality'}
                      onChange={
                          (event) =>{
                              setNationality(event.target.value)
                          }}
                  />
                  <button
                      onClick={()=>{
                          //createUser is a function, defined as output of useMutation hook.
                          createUser({
                              variables:{
                                  input: {
                                      name,
                                      username,
                                      age,
                                      nationality
                                  }
                              }
                          });

                          refetch();

                      }}
                  >Create User</button>
              </div>
            {data && Data}

            {/*Below we are getting data, when user enters the name of movie in input type and setting it
                to "state".*/}
            <input
                type={"text"}
                placeholder={"Enter Movie Name"}
                onChange={
                    (event) =>{ setMovieSearched(event.target.value)
                    }}
            />
            {/*Then we are reading value of state and passing it to the function defined for "useLazyQuery"
                hook. Below is the syntax to pass value to that function in Apollo Client*/}
            <button onClick={() => {
                fetchMovie({
                    variables:{
                        name:movieSearched
                    }
                })
            }}>Fetch Data</button>
            {/*Then we are showing the data inside below tags*/}
            {/*We can read for errors using "error" field of "useLazyQuery" hook*/}
            <div>{movieSearchedData &&
                    <div>
                        <h1>Movie Name: {movieSearchedData.movie.name}</h1>{" "}
                        <h1>Year Of Publications: {movieSearchedData.movie.yearOfPublication}</h1>{" "}
                    </div>
            }</div>
        </div>
        );
}

export default  Allusers