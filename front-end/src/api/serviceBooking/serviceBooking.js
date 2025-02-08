import instance from "../instance";


const createServiceBooking = async (data) => {
    try {
    
      return await instance.post("servicebooking", data);
    } catch (error) {
      return error;
    }
};
const getServiceBooking = async (data) => {
  try {
  
    return await instance.get("servicebooking", data);
  } catch (error) {
    return error;
  }
};
const UpdateServiceBooking = async (session_id) => {
  try {

    return await instance.get(`servicebooking/success?session_id=${session_id}`);
  } catch (error) {
    return error;
  }
};
const UpdateOneServiceBooking = async (ServiceId,data) => {
  try {
    const headers = {};
    const token = localStorage.getItem("token");

    if (token !== null) {
      headers["authorization"] = `Bearer ${token}`;
    }
    return await instance.patch(`servicebooking/${ServiceId}`,data,{headers});
  } catch (error) {
    return error;
  }
}; 
const deleteServiceBooking = async (id) => {
  try {
    const headers = {};
    const token = localStorage.getItem("token");

    if (token !== null) {
      headers["authorization"] = `Bearer ${token}`;
    }
    return instance.delete(`servicebooking/${id}`,{headers});
  } catch (error) {
    return error;
  }
};
const myAssignedServiceBookings = async () => {
  try {
    const headers = {};
    const token = localStorage.getItem("token");

    if (token !== null) {
      headers["authorization"] = `Bearer ${token}`;
    }
    return instance.get(`servicebooking/my/services`, { headers });
  } catch (error) {
    return error;
  }
};
export { createServiceBooking, UpdateServiceBooking, getServiceBooking, UpdateOneServiceBooking, deleteServiceBooking, myAssignedServiceBookings }