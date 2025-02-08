import instance from "../instance";

const createPayingGuestBooking = async (data) => {
    try {
        const headers = {};
        const token = localStorage.getItem("token");
    
        if (token !== null) {
          headers["authorization"] = `Bearer ${token}`;
        }
      return await instance.post("payingguestbooking", data,{headers});
    } catch (error) {
      return error;
    }
};
const UpdatePayingGuestBooking = async (session_id) => {
    try {
  
      return await instance.get(`payingguestbooking/success?session_id=${session_id}`);
    } catch (error) {
      return error;
    }
};
  
const myPayguestBookings = async () => {
  try {
    const headers = {};
    const token = localStorage.getItem("token");

    if (token !== null) {
      headers["authorization"] = `Bearer ${token}`;
    }
    return instance.get(`payingguestbooking/my/payguestbookings`, { headers });
  } catch (error) {
    return error;
  }
};
const UpdateOnePayingGuestBooking = async (PropertId,data) => {
  try {
    const headers = {};
    const token = localStorage.getItem("token");

    if (token !== null) {
      headers["authorization"] = `Bearer ${token}`;
    }
    return await instance.patch(`payingguestbooking/${PropertId}`,data,{headers});
  } catch (error) {
    return error;
  }
}; 
export {createPayingGuestBooking,UpdatePayingGuestBooking,myPayguestBookings,UpdateOnePayingGuestBooking}