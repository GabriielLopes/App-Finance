import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import MyRoute from './MyRoute';
import Login from '../Pages/Login/Index';
import Page404 from '../Pages/404/Index';

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <MyRoute exact path="/" component={Login} />
        <MyRoute path="*" component={Page404} />
      </Switch>
    </BrowserRouter>
  );
}
