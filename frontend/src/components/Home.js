import React from "react";
import { useSelector } from "react-redux";
import authToken from "../utils/authToken";
import { Alert } from "react-bootstrap";
import jwt from 'jwt-decode';
import { Link } from "react-router-dom";

const Home = () => {
  let user = {};
  if (localStorage.jwtToken) {
    authToken(localStorage.jwtToken);
    user = jwt(localStorage.jwtToken); // decode your token here
  }
  const auth = useSelector((state) => state.auth);
  let result;
  if (user.sub) {
    result = <Alert style = {
        {
          backgroundColor: "#343A40",
          color: "#ffffff80"
        }
      } >
      Welcome back, {user.username}!
      </Alert>
  } else {
    result = <Alert style = {
        {
          backgroundColor: "#343A40",
          color: "#ffffff80"
        }
      } >
        <Link to={"/login"} style={{color: '#ffffff80'}} >
          Welcome. Please Login.
        </Link>
      </Alert>
  }

  return (
    result
  );
};

export default Home;
