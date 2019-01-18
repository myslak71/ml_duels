import React from "react";
import {Route} from "react-router-dom";

import DuelDetail from "./containers/DuelDetailView"
import ArticleList from "./containers/ArticleListView";
import ArticleDetail from "./containers/ArticleDetailView";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import DuelList from "./containers/DuelListView";

const BaseRouter = () => (
    <div>
        <Route exact path="/" component={ArticleList}/>{" "}
        <Route exact path="/articles/:articleID/" component={ArticleDetail}/>{" "}
        <Route exact path="/login/" component={Login}/>{" "}
        <Route exact path="/signup/" component={Signup}/>{" "}
        <Route exact path="/duel/" component={DuelList}/>{" "}
        <Route exact path="/duel/:duelID/" component={DuelDetail}/>{" "}
    </div>
);

export default BaseRouter;
