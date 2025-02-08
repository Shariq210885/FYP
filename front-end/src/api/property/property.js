import instance from "../instance";

const listProperty = async (data) => {
  try {
    const headers = {};
    const token = localStorage.getItem("token");

    if (token !== null) {
      headers["authorization"] = `Bearer ${token}`;
    }
    return await instance.post("property/", data, { headers });
  } catch (error) {
    return error;
  }
};
const PropertyReview = async (id,data) => {
  try {
    const headers = {};
    const token = localStorage.getItem("token");

    if (token !== null) {
      headers["authorization"] = `Bearer ${token}`;
    }
    return await instance.post(`property/post/${id}`, data, { headers });
  } catch (error) {
    return error;
  }
};
const getAllProperty = async () => {
  try {
    return instance.get("property/");
  } catch (error) {
    return error;
  }
};

const getSingleProperty = async (id) => {
  try {
    return instance.get(`property/${id}`);
  } catch (error) {
    return error;
  }
};

const updateProperty = async (id,data) => {
  try {
    const headers = {};
    const token = localStorage.getItem("token");

    if (token !== null) {
      headers["authorization"] = `Bearer ${token}`;
    }
    
    return instance.patch(`property/${id}`,data, {headers} );
  } catch (error) {
    return error;
  }
};

const deleteProperty = async (id) => {
  try {
    const headers = {};
    const token = localStorage.getItem("token");

    if (token !== null) {
      headers["authorization"] = `Bearer ${token}`;
    }
    return instance.delete(`property/${id}`,{headers});
  } catch (error) {
    return error;
  }
};

const SearchProperty = async (data) => {
  
  try {
    const response = await instance.get(
      `property/search?priceMin=${data.priceMin}&priceMax=${data.priceMax}&bedRooms=${data.bedRooms}&city=${data.city}&sector=${data.sector}&propertyType=${data.propertyType}&areaMin=${data.areaMin}&areaMax=${data.areaMax}`
    );
    return response; // Return the response data for the caller to use
  } catch (error) {
    console.error("Error in SearchProperty:", error);
    return { error: true, message: error.message }; // Return a meaningful error response
  }
};


const getAllMyProperty = async () => {
  try {
    const headers = {};
    const token = localStorage.getItem("token");
    if (token !== null) {
      headers["authorization"] = `Bearer ${token}`;
    }
    return instance.get("property/my/properties",{headers});
  } catch (error) {
    return error;
  }
};


export {
  listProperty,
  getAllProperty,
  getSingleProperty,
  updateProperty,
  deleteProperty,
  getAllMyProperty,
  SearchProperty,
  PropertyReview
};
