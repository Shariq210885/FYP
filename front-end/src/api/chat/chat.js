import instance from "../instance";

const getAllChatWith = async (id) => {
    try {
      const headers = {};
      const token = localStorage.getItem("token");
  
      if (token !== null) {
        headers["authorization"] = `Bearer ${token}`;
      }
      return instance.get(`chat/my/chats/${id}`,{headers});
    } catch (error) {
      return error;
    }
};

const CreateChat = async (data) => {
    try {
      const headers = {};
      const token = localStorage.getItem("token");
  
      if (token !== null) {
        headers["authorization"] = `Bearer ${token}`;
      }
      return instance.post(`chat`,data,{headers});
    } catch (error) {
      return error;
    }
};

const markMessagesAsRead = async (senderId) => {
    try {
      const headers = {};
      const token = localStorage.getItem("token");
  
      if (token !== null) {
        headers["authorization"] = `Bearer ${token}`;
      }
      return instance.put(`chat/read/${senderId}`, {}, {headers});
    } catch (error) {
      return error;
    }
};

const getUnreadMessageCount = async () => {
    try {
      const headers = {};
      const token = localStorage.getItem("token");
  
      if (token !== null) {
        headers["authorization"] = `Bearer ${token}`;
      }
      return instance.get(`chat/unread/count`, {headers});
    } catch (error) {
      return error;
    }
};

export { getAllChatWith, CreateChat, markMessagesAsRead, getUnreadMessageCount }