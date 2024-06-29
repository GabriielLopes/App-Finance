import React from 'react';
import { Router } from 'react-router-dom'; // Use Router consistently
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import store, { persistor } from './store/index';
import Header from './components/Header/index';
import { EstilosGlobal } from './styles/EstilosGlobal';
import Routes from './routers/Routes'; // Import Routes component
import history from './services/history';

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Router history={history}>
          <Header />
          <Routes />
          <EstilosGlobal />
        </Router>
      </PersistGate>
    </Provider>
  );
}
