import React, { Component } from "react";
import {BrowserRouter as Router,Switch,Route,Redirect} from "react-router-dom";
import Login from "./components/Login";
import Pay from "./components/Pay";
import Check from "./components/Check";
import TransactionDetails from "./components/transactionDetails";
import Transaction from "./components/Transaction";
import OfferList from "./components/OfferList";
import Offer from "./components/Offer";
import NewOffer from "./components/NewOffer";

const Routes = () => {
    return (
      <Router>
          <Switch>
              <Route path={"/"} exact component={Login}/>
              <Route path={"/pay"} exact component={Pay}/>
              <Route path={"/check"} exact component={Check}/>
              <Route path={"/transaction/detail"} exact component={TransactionDetails}/>
              <Route path={"/transaction"} exact component={Transaction}/>
              <Route path={"/offers"} exact component={OfferList}/>
              <Route path={"/offer/take"} exact component={Offer}/>
              <Route path={"/offer/create"} exact component={NewOffer}/>
              <Redirect to={"/"}/>
          </Switch>
  </Router>
    );
}

export default Routes;