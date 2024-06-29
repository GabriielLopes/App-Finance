import React from 'react';
import { Switch } from 'react-router-dom/';
import MyRoute from './MyRoute';
import Login from '../Pages/Login/Index';
import Register from '../Pages/Register/Index';
import Home from '../Pages/Home/Index';
import Page404 from '../Pages/404/Index';
import Configuracoes from '../Pages/Configuracoes/Index';
import PerfilConfig from '../Pages/perfil_config/Index';

export default function Routes() {
  return (
    <Switch>
      <MyRoute exact path="/" component={Home} isClosed />
      <MyRoute exact path="/login" component={Login} isClosed={false} />
      <MyRoute exact path="/register" component={Register} isClosed={false} />
      <MyRoute exact path="/config" component={Configuracoes} isClosed />
      <MyRoute exact path="/editar-perfil/" component={PerfilConfig} isClosed />
      <MyRoute path="*" component={Page404} />
    </Switch>
  );
}
