import axios from 'axios';
/*
http://localhost:3333 PC e XCode
http://10.0.2.2:3333 Emulador Android
*/

const api = axios.create({
  baseURL: 'https://gobarberapi.develitt.com',
});

export default api;
