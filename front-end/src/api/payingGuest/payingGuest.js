import instance from "../instance";

const listPayingGuest = async (data) => {
  try {
    const headers = {};
    const token = localStorage.getItem("token");

    if (token !== null) {
      headers["authorization"] = `Bearer ${token}`;
    }
    return await instance.post("payingguest/", data, { headers });
  } catch (error) {
    return error;
  }
};

const getAllPayingGuest = async () => {
  try {
    return instance.get("payingguest/");
  } catch (error) {
    return error;
  }
};

const getSinglePayingGuest = async (id) => {
  try {
    return instance.get(`payingguest/${id}`);
  } catch (error) {
    return error;
  }
};

const updatePayingGuest = async (id,data) => {
  try {
    const headers = {};
    const token = localStorage.getItem("token");

    if (token !== null) {
      headers["authorization"] = `Bearer ${token}`;
    }
    return instance.patch(`payingguest/${id}`, data,{ headers });
  } catch (error) {
    return error;
  }
};

const deletePayingGuest = async (id) => {
  try {
    const headers = {};
    const token = localStorage.getItem("token");

    if (token !== null) {
      headers["authorization"] = `Bearer ${token}`;
    }
    return instance.delete(`payingguest/${id}`,{headers});
  } catch (error) {
    return error;
  }
};

const searchPayingGuest = async () => {
  try {
    return instance.get(`property?`);
  } catch (error) {
    return error;
  }
};


const getAllMyPayingGuest = async () => {
  const headers = {};
  const token = localStorage.getItem("token");

  if (token !== null) {
    headers["authorization"] = `Bearer ${token}`;
  }
  try {
    return instance.get("payingguest/my/payingguests",{headers});
  } catch (error) {
    return error;
  }
};
const SearchPayinGuest = async (data) => {
  try {
    const response = await instance.get(
      `payingguest/search?priceMin=${data.priceMin}&priceMax=${data.priceMax}&bedRooms=${data.bedRooms}&city=${data.city}&sector=${data.sector}&propertyType=${data.propertyType}&areaMin=${data.areaMin}&areaMax=${data.areaMax}`
    );
    return response; // Return the response data for the caller to use
  } catch (error) {
    console.error("Error in SearchProperty:", error);
    return { error: true, message: error.message }; // Return a meaningful error response
  }
};

const PayingGuestReview = async (id,data) => {
  try {
    const headers = {};
    const token = localStorage.getItem("token");

    if (token !== null) {
      headers["authorization"] = `Bearer ${token}`;
    }
    return await instance.post(`payingguest/post/${id}`, data, { headers });
  } catch (error) {
    return error;
  }
};
export {
  listPayingGuest,
  getAllPayingGuest,
  getSinglePayingGuest,
  updatePayingGuest,
  deletePayingGuest,
  searchPayingGuest,
  getAllMyPayingGuest,
  SearchPayinGuest,
  PayingGuestReview
};
