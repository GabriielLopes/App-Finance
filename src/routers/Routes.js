import React from 'react';
import { Route, Switch } from 'react-router-dom/';
import Login from '../Pages/Login/Index';
import Page404 from '../Pages/404/Index';

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/" component={Login} />
      <Route path="*" component={Page404} />
    </Switch>
  );
}
