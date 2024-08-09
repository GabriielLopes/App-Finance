import axios from 'axios';
// https://api-finance-zeta.vercel.app/
export default axios.create({
  baseURL: 'http://localhost:9001',
});
