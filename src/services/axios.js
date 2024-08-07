import axios from 'axios';

export default axios.create({
  baseURL: 'https://api-finance-zeta.vercel.app/',
});
