import React from "react";
import {Route} from "react-router-dom";

import DuelDetail from "./containers/DuelDetailView"
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import DuelList from "./containers/DuelListView";

const BaseRouter = () => (
    <div>
        <Route exact path="/" component={DuelList}/>{" "}
        <Route exact path="/login/" component={Login}/>{" "}
        <Route exact path="/signup/" component={Signup}/>{" "}
        <Route exact path="/duel/" component={DuelList}/>{" "}
        <Route exact path="/duel/:duelID/" component={DuelDetail}/>{" "}
    </div>
);

export default BaseRouter;
