import instance from "../instance";

const postQuery = async (data) => {
  try {
    return await instance.post("contact/", data);
  } catch (error) {
    return error;
  }
};

const getAllQueries = async () => {
  try {
    const headers = {};
    const token = localStorage.getItem("token");

    if (token !== null) {
      headers["authorization"] = `Bearer ${token}`;
    }
    return instance.get("contact/");
  } catch (error) {
    return error;
  }
};

const getSingleQuery = async (id) => {
  try {
    const headers = {};
    const token = localStorage.getItem("token");

    if (token !== null) {
      headers["authorization"] = `Bearer ${token}`;
    }
    return instance.get(`contact/${id}`);
  } catch (error) {
    return error;
  }
};

const deleteQuery = async (id) => {
  try {
    const headers = {};
    const token = localStorage.getItem("token");

    if (token !== null) {
      headers["authorization"] = `Bearer ${token}`;
    }
    return instance.delete(`contact/${id}`, { headers });
  } catch (error) {
    return error;
  }
};

export { postQuery, getSingleQuery, getAllQueries, deleteQuery };
