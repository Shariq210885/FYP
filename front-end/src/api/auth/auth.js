import instance from "./../instance";

const login = async (data) => {
  try {
    return await instance.post("user/login", JSON.stringify(data));
  } catch (error) {
    return error;
  }
};
const loginWithGoogle = async (data) => {
  try {
    return await instance.post("user/loginwithgoogle", JSON.stringify(data));
  } catch (error) {
    return error;
  }
};

const signup = async (data) => {
  try {
    return await instance.post("user/signup", JSON.stringify(data));
  } catch (error) {
    return error;
  }
};
const getAllUsers = async () => {
  try {
    return await instance.get("user/all/users");
  } catch (error) {
    return error;
  }
};

const getAllFiltersUsers = async (value) => {
  try {
    return await instance.get(`user/all/users?role=${value}`);
  } catch (error) {
    return error;
  }
};
const updateProfile = async (data) => {
  try {
    const headers = {};
    const token = localStorage.getItem("token");

    if (token !== null) {
      headers["authorization"] = `Bearer ${token}`;
    }
    return await instance.patch("user/updateprofile", data, { headers });
  } catch (error) {
    return error;
  }
};
const forgotPassword = async (data) => {
  try {
     
      const response = await instance.post('user/forgotpassword', data);
      return response;
  } catch (error) {
      return error;
  }
};
const resetPassword = async (token,data) => {
  try {
    
    const response = await instance.post(
      `user/reset/password?token=${token}`,
      data
    );
    return response;
  } catch (error) {
    return error;
  }
};
const VerifiedAccount = async (data) => {
  try {
    const headers = {};
    const token = localStorage.getItem("token");

    if (token !== null) {
      headers["authorization"] = `Bearer ${token}`;
    }
    return await instance.patch(`user/verifyaccount/${data.id}`,{}, { headers });
  } catch (error) {
    return error;
  }
};
const updatePasswordUser = async (data) => {
  try {
    const headers = {};
    const token = localStorage.getItem("token");

    if (token !== null) {
      headers["authorization"] = `Bearer ${token}`;
    }
    return await instance.patch(`user/updatepassword`,data, { headers });
  } catch (error) {
    return error;
  }
};
const getUserProfile = async () => {
  try {
    const headers = {};
    const token = localStorage.getItem("token");

    if (token !== null) {
      headers["authorization"] = `Bearer ${token}`;
    }
    return await instance.get(`user/userprofile`, { headers });
  } catch (error) {
    return error;
  }
};

const verifyEmail = async (token) => {
  try {
    return await instance.patch(`user/verifyaccount?token=${token}`);
  } catch (error) {
    return error;
  }
};

export { login,loginWithGoogle,getUserProfile, signup, updateProfile,forgotPassword,resetPassword,getAllUsers,VerifiedAccount,updatePasswordUser,getAllFiltersUsers, verifyEmail };