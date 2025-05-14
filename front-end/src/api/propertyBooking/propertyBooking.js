import instance from "../instance";

const createPropertyBooking = async (data) => {
  try {
    const headers = {};
    const token = localStorage.getItem("token");

    if (token !== null) {
      headers["authorization"] = `Bearer ${token}`;
    }
    return await instance.post("propertybooking", data, { headers });
  } catch (error) {
    return error;
  }
};
const UpdatePropertyBooking = async (session_id) => {
  try {
    return await instance.get(
      `propertybooking/success?session_id=${session_id}`
    );
  } catch (error) {
    return error;
  }
};
const myPropertyBookings = async () => {
  try {
    const headers = {};
    const token = localStorage.getItem("token");

    if (token !== null) {
      headers["authorization"] = `Bearer ${token}`;
    }
    return instance.get(`propertybooking/my/propertybookings`, { headers });
  } catch (error) {
    return error;
  }
};
const UpdateOnePropertyBooking = async (PropertId, data) => {
  try {
    const headers = {};
    const token = localStorage.getItem("token");

    if (token !== null) {
      headers["authorization"] = `Bearer ${token}`;
    }
    return await instance.patch(`propertybooking/${PropertId}`, data, {
      headers,
    });
  } catch (error) {
    return error;
  }
};

const getMyBookings = async () => {
  try {
    const headers = {};
    const token = localStorage.getItem("token");

    if (token !== null) {
      headers["authorization"] = `Bearer ${token}`;
    }
    return await instance.get(`propertybooking/my/getmybooking`, {
      headers,
    });
  } catch (error) {
    return error;
  }
};

export {
  createPropertyBooking,
  UpdatePropertyBooking,
  myPropertyBookings,
  UpdateOnePropertyBooking,
  getMyBookings,
};
