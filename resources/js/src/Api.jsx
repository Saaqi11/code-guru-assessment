import axios from 'axios';
import {Navigate} from "react-router-dom";

const Api = axios.create({
   baseURL: '/api',
   params: {}
});

Api.interceptors.request.use(config => {
    const token = localStorage.getItem('token'); // Retrieve token from storage
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

Api.interceptors.response.use(
    response => {
       if (response.status === 200 || response.status === 201) {
          return Promise.resolve(response);
       }
    },
    error => {
        if (error.status === 419) {
            return <Navigate to="/otp-verify" replace={true} />;
        }
        if (error.message.indexOf("401") !== -1) {
           localStorage.clear();
           window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default Api;