import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000/api/",
});
instance.interceptors.request.use(
  (config) => {
    // Set headers dynamically based on data type
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
