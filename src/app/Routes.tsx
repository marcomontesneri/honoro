import React, { Component } from "react";
// import { Router, Scene, Stack } from "react-native-router-flux";
import {BrowserRouter as Router,Switch,Route,Redirect} from "react-router-dom";
import Login from "./components/Login";
import Pay from "./components/Pay";
import Check from "./components/Check";
import TransactionDetails from "./components/transactionDetails";

const Routes = () => {
    return (
      <Router>
          <Switch>
              <Route path={"/"} exact component={Login}/>
              <Route path={"/pay"} exact component={Pay}/>
              <Route path={"/check"} exact component={Check}/>
              <Route path={"/transaction/detail"} exact component={TransactionDetails}/>
              <Redirect to={"/"}/>
          </Switch>
  </Router>
    );
}

export default Routes;