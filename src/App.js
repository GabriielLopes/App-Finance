/* eslint-disable import/no-extraneous-dependencies */
import { Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Header from './components/Header/index';
import { EstilosGlobal } from './styles/EstilosGlobal';
import Routes from './routers/index';
import history from './services/history';

export default function App() {
  // eslint-disable-next-line jsx-a11y/anchor-is-valid
  return (
    <Router history={history}>
      <Header />
      <Routes />
      <EstilosGlobal />
      <ToastContainer autoClose={4000} className="toast-container" />
    </Router>
  );
}
