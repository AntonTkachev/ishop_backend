import React from "react";
import "./App.css";

import { Container, Row, Col } from "react-bootstrap";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import NavigationBar from "./components/NavigationBar";
import Product from "./components/Product/Product";
import ProductList from "./components/Product/ProductList";
import UserList from "./components/User/UserList";
import Register from "./components/User/Register";
import UpdateUser from "./components/User/UpdateUser";
import ChangePassword from "./components/User/ChangePassword";
import Login from "./components/User/Login";
import Cart from "./components/Cart/Cart";
import Footer from "./components/Footer";
import Home from "./components/Home";

const App = () => {
  window.onbeforeunload = (event) => {
    const e = event || window.event;
    e.preventDefault();
    if (e) {
      e.returnValue = "";
    }
    return "";
  };

  return (
    <Router>
      <NavigationBar />
      <Container>
        <Row>
          <Col lg={12} className={"margin-top"}>
            <Switch>
              <Route path="/" exact component={Login} />
              <Route path="/home" exact component={Home} />
              <Route path="/add" exact component={Product} />
              <Route path="/edit/:id" exact component={Product} />
              <Route path="/customer/:id" exact component={UpdateUser} />
              <Route path="/changePassword" exact component={ChangePassword} />
              <Route path="/list" exact component={ProductList} />
              <Route path="/users" exact component={UserList} />
              <Route path="/register" exact component={Register} />
              <Route path="/login" exact component={Login} />
              <Route path="/cart" exact component={Cart} />
              <Route
                path="/logout"
                exact
                component={() => (
                  <Home message="User Logged Out Successfully." />
                )}
              />
            </Switch>
          </Col>
        </Row>
      </Container>
      <Footer />
    </Router>
  );
};

export default App;
