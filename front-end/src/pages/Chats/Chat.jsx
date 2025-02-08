import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllFiltersUsers } from "../../api/auth/auth";
import { UseUser } from "../../context/UserContext";
import { CreateChat, getAllChatWith } from "../../api/chat/chat";

function Chat() {
  

  const [showMenu, setShowmenu] = useState(false);
  const navigate = useNavigate();
  const [selectedOption, setSeletedOption] = useState("admin");
  const [data, setData] = useState([]);
  const [selectedUser, setselectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
    const { user } = UseUser();
    const chatContainerRef = useRef(null); // Step 1: Create a ref for the chat container

  useEffect(() => {
    // Step 2: Scroll to the bottom when chats update
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chats]);
  useEffect(() => {
    async function getAllUser() {
      const response = await getAllFiltersUsers(selectedOption);
      if (response.status === 200) {
        setData(response.data.data.users);
      } else {
        setData([]);
      }
    }
    getAllUser();
  }, [selectedOption]);

  useEffect(()=>{
    if(!user){
      navigate('/')}
    },[user])
    
  useEffect(() => {
    let pollingInterval;

    async function fetchNewChats() {
      if (!selectedUser) return;

      const response = await getAllChatWith(selectedUser.id);
      if (response.status === 200) {
        const newChats = response.data.data;

        if (newChats.length > 0) {
            setChats(response.data.data);
        } else {
          setChats([])
        }
      }
    }
    pollingInterval = setInterval(fetchNewChats, 2000);
    return () => clearInterval(pollingInterval); // Cleanup on unmount
  }, [selectedUser]);  
    
    console.log(selectedUser);
    
    
  function handleDropDown(value) {
    setSeletedOption(value);
    setShowmenu(false);
  }
  async function handleChatWithOther(user) {
    setselectedUser({
      id: user._id,
      name: user.name,
      image: user.image,
      role: user.role,
    });

    const response = await getAllChatWith(user._id);

    if (response.status === 200) {
      setChats(response.data.data);
    }
      else {
        setChats([])
      }
    
  }
  async function handlePostMessage() {
    if (!message) {
      return;
    }
    const messageObj = {
      senderId: user._id,
      receiverId: selectedUser.id,
      message: message,
    };
    const JsonData = JSON.stringify(messageObj);
    const response = await CreateChat(JsonData);

    if (response.status === 200) {
      const testData = {
        message: response.data.data.message,
        receiverId: response.data.data.receiverId,
        senderId: response.data.data.senderId,
      };
      setChats([...chats, testData]);
      setMessage("");
    }
  }
  return (
    <>
      { user && <div className="flex h-screen overflow-hidden">
        {/* <!-- Sidebar --> */}
        <div className="w-1/4 bg-white border-r border-gray-300">
          {/* <!-- Sidebar Header --> */}
          <header className="flex items-center justify-between px-4 py-5 bg-white border-b border-gray-300 text-primaryColor">
            <h1 className="text-xl font-semibold" onClick={() => navigate("/")}>
              <img src="/static-images/logo.png" className="size-10" />
            </h1>
            <h1 className="text-2xl font-semibold">Chat Web</h1>
            <div className="relative">
              <button
                onClick={() => setShowmenu(!showMenu)}
                className="focus:outline-none"
              >
                chat with
              </button>
              {/* <!-- Menu Dropdown --> */}
              {showMenu ? (
                <div
                  id="menuDropdown"
                  className="absolute right-0 w-48 mt-2 bg-white border border-gray-300 rounded-md shadow-lg "
                >
                  <ul className="px-2 py-2">
                    <li>
                      <button
                        onClick={() => handleDropDown("landowner")}
                        className="w-full py-2 text-gray-800 text-start hover:text-gray-400"
                      >
                        LandOwner
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleDropDown("serviceman")}
                        className="w-full py-2 text-gray-800 text-start hover:text-gray-400"
                      >
                        Service man
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleDropDown("tenant")}
                        className="w-full py-2 text-gray-800 text-start hover:text-gray-400"
                      >
                        Tenant
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleDropDown("admin")}
                        className="w-full py-2 text-gray-800 text-start hover:text-gray-400"
                      >
                        Admin
                      </button>
                    </li>
                    {/* <!-- Add more menu options here --> */}
                  </ul>
                </div>
              ) : (
                ""
              )}
            </div>
          </header>

          {/* <!-- Contact List --> */}
          <div className="h-screen p-3 pb-16 overflow-y-auto mb-9">
            {data.map((user, index) => (
              <div
                onClick={() => handleChatWithOther(user)}
                key={index}
                className="flex items-center p-2 mb-4 transition-all duration-200 rounded-md shadow-sm cursor-pointer hover:scale-105 hover:bg-gray-100"
              >
                <div className="w-12 h-12 mr-3 bg-gray-300 rounded-full">
                  <img
                    src={user.image}
                    alt="User Avatar"
                    className="w-12 h-12 rounded-full"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">{user.name}</h2>
                  <p className="text-gray-600">{user.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* <!-- Main Chat Area --> */}
        {selectedUser ? (
          <div className="flex-1">
            {/* <!-- Chat Header --> */}
            <header className="p-3 text-white bg-red-800">
              <h1 className="text-2xl font-semibold">{selectedUser.name}</h1>
              <p className="text-white">{selectedUser.role}</p>
            </header>

            {/* <!-- Chat Messages --> */}
            <div className="h-screen p-4 overflow-y-auto pb-36" ref={chatContainerRef}>
              {/* <!-- Incoming Message --> */}
              {chats.map((message, index) =>
                user._id === message.senderId._id ? (
                  <div
                    key={index}
                    className="flex justify-end mb-4 cursor-pointer"
                  >
                    {/* <!-- Outgoing Message --> */}
                    <div className="flex gap-3 p-3 text-white bg-red-600 rounded-lg max-w-96">
                      <p>{message.message}</p>
                    </div>
                    <div className="flex items-center justify-center ml-2 rounded-full w-9 h-9">
                      <img
                        src={user.image}
                        alt="My Avatar"
                        className="w-8 h-8 rounded-full"
                      />
                    </div>
                  </div>
                ) : (
                  <div key={index} className="flex mb-4 cursor-pointer">
                    {/* <!-- Incoming Message --> */}
                    <div className="flex items-center justify-center mr-2 rounded-full w-9 h-9">
                      <img
                        src={message.senderId.image}
                        alt="User Avatar"
                        className="w-8 h-8 rounded-full"
                      />
                    </div>
                    <div className="flex gap-3 p-3 bg-white rounded-lg max-w-96">
                      <p className="flex gap-3 p-3 text-white bg-red-600 rounded-lg max-w-96 bg-opacity-40">
                        {message.message}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* <!-- Chat Input --> */}
            <footer className="absolute bottom-0 w-3/4 p-4 bg-white border-t border-gray-300">
              <div className="flex items-center">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  type="text"
                  placeholder="Type a message..."
                  className="w-full p-2 border border-gray-400 rounded-md focus:outline-none focus:border-red-600"
                />
                <button
                  className="px-4 py-2 ml-2 text-white bg-red-600 rounded-md"
                  onClick={handlePostMessage}
                >
                  Send
                </button>
              </div>
            </footer>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-full ">
            <h1 className="text-xl font-semibold" onClick={() => navigate("/")}>
              <img src="/static-images/logo.png" className="size-24" />
              <h1 className="text-lg font-medium text-center text-primaryColor">
                E-Makaan
              </h1>
            </h1>
          </div>
        )}
      </div>}
    </>
  );
}

export default Chat;
