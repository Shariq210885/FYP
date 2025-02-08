import instance from "../instance";

const getAllServices = async () => {
    try {
      return instance.get("service/");
    } catch (error) {
      return error;
    }
};
const listService = async (data) => {
    try {
      const headers = {};
      const token = localStorage.getItem("token");
  
      if (token !== null) {
        headers["authorization"] = `Bearer ${token}`;
      }
      return await instance.post("service/", data, { headers });
    } catch (error) {
      return error;
    }
  };
  
const updateService = async (id,data) => {
    try {
      const headers = {};
      const token = localStorage.getItem("token");
  
      if (token !== null) {
        headers["authorization"] = `Bearer ${token}`;
      }
      
      return instance.patch(`service/${id}`,data, {headers} );
    } catch (error) {
      return error;
    }
};
const getSingleService= async (id) => {
  try {
    return instance.get(`service/${id}`);
  } catch (error) {
    return error;
  }
};
const deleteService = async (id) => {
  try {
    const headers = {};
    const token = localStorage.getItem("token");

    if (token !== null) {
      headers["authorization"] = `Bearer ${token}`;
    }
    return instance.delete(`service/${id}`,{headers});
  } catch (error) {
    return error;
  }
};

const getAllMyService = async () => {
  try {
    const headers = {};
    const token = localStorage.getItem("token");
    if (token !== null) {
      headers["authorization"] = `Bearer ${token}`;
    }
    return instance.get("service/myservices",{headers});
  } catch (error) {
    return error;
  }
};


const SearchService = async (data) => {
  
  try {
    const response = await instance.get(
      `service/servicesearch/search?title=${data.title}`
    );
    return response; // Return the response data for the caller to use
  } catch (error) {
    console.error("Error in SearchProperty:", error);
    return { error: true, message: error.message }; // Return a meaningful error response
  }
};
const ServiceReview = async (id,data) => {
  try {
    const headers = {};
    const token = localStorage.getItem("token");

    if (token !== null) {
      headers["authorization"] = `Bearer ${token}`;
    }
    return await instance.post(`service/post/${id}`, data, { headers });
  } catch (error) {
    return error;
  }
};
  export {getAllServices,updateService,listService,getSingleService,getAllMyService,deleteService,SearchService,ServiceReview}