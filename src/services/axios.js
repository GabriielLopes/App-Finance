import axios from 'axios';

export default axios.create({
  baseURL: 'https://api-app-finance.vercel.app/',
});
