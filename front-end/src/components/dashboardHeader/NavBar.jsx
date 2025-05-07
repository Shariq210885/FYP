import { useEffect, useRef, useState } from "react";
import {
  FaCartShopping,
  FaHouseChimneyUser,
  FaRocketchat,
  FaSnapchat,
  FaSquareSnapchat,
  FaUserTie,
} from "react-icons/fa6";
import { NavLink, useNavigate } from "react-router-dom";
import { UseUser } from "../../context/UserContext";
import { createServiceBooking } from "../../api/serviceBooking/serviceBooking";
import { getUnreadMessageCount } from "../../api/chat/chat";

function NavBar({ navbarLinks, isTenant }) {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user, setUser, cartService } = UseUser();

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev); // Toggle the dropdown visibility
  };
  const toggleModal = () => {
    setModalVisible((prev) => !prev); // Toggle the modal visibility
  };

  const fetchUnreadCount = async () => {
    if (user) {
      const response = await getUnreadMessageCount();
      if (response.status === 200) {
        setUnreadCount(response.data.data.unreadCount);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false); // Close dropdown if clicked outside
      }
    };

    // Add event listener on mount
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 10000); // Check every 10 seconds
      return () => clearInterval(interval);
    }
  }, [user]);

  async function CheckOut() {
    const response = await createServiceBooking(cartService);
    if (response.status === 200) {
      window.location.href = response.data.url;
    }
  }

  return (
    <div className="fixed z-50 w-full h-20 bg-white border-b shadow insect-0">
      <div>
        <div className="flex items-center justify-between px-10 py-4">
          <div>
            <h1 className="text-xl font-semibold" onClick={() => navigate("/")}>
              <img src="/static-images/logo.png" className="size-12" />
            </h1>
          </div>
          <ul className="flex items-center space-x-6">
            {navbarLinks.map((link, index) => (
              <li key={index}>
                <NavLink
                  to={link.path}
                  className={
                    ({ isActive }) =>
                      isActive
                        ? "text-red-500" // Red color when the link is active
                        : "text-gray-500" // Gray color when the link is not active
                  }
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2 ">
            {user && (
              <div className="relative">
                <button
                  className="flex items-center gap-2 px-2 py-2 text-white rounded-lg bg-primaryColor hover:bg-primaryColor/90"
                  onClick={() => navigate("/chat/")}
                >
                  <span className="flex items-center gap-1">
                    <FaRocketchat size={20} />
                  </span>
                </button>
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
            )}
            {user && user?.role === "admin" && (
              <button
                className="flex items-center gap-2 px-2 py-2 text-white rounded-lg bg-primaryColor hover:bg-primaryColor/90"
                onClick={() => navigate("/admin/")}
              >
                <span className="flex items-center gap-1">Admin Panel</span>
              </button>
            )}
            {isTenant && user?.role !== "admin" && (
              <button
                className="flex items-center gap-2 px-2 py-2 text-white rounded-lg bg-primaryColor hover:bg-primaryColor/90"
                onClick={() => {
                  if (user) {
                    if (user.role === "landowner") {
                      navigate("/landowner/");
                    } else if (user.role === "serviceman") {
                      navigate("/serviceman/");
                    } else {
                      navigate("/switch-account");
                    }
                  } else {
                    navigate("/login");
                  }
                }}
              >
                {user?.role === "landowner" ? (
                  <span className="flex items-center gap-1">
                    List Your Property <FaHouseChimneyUser size={20} />
                  </span>
                ) : user?.role === "serviceman" ? (
                  <span className="flex items-center gap-1">
                    List Your Service <FaUserTie size={20} />
                  </span>
                ) : user?.role === "admin" ? null : (
                  <span className="flex items-center gap-1">
                    List Your Property <FaHouseChimneyUser size={20} />
                  </span>
                )}
              </button>
            )}
            <div className="flex items-center gap-2">
              <div className="relative flex">
                <button
                  onClick={() => (user ? toggleDropdown() : navigate("/login"))}
                  className="focus:outline-none"
                >
                  {user ? (
                    <img
                      src={user?.image}
                      alt="Profile"
                      className="object-cover w-10 h-10 rounded-full cursor-pointer"
                    />
                  ) : (
                    <img
                      src="https://hwchamber.co.uk/wp-content/uploads/2022/04/avatar-placeholder.gif"
                      alt="Profile"
                      className="object-cover w-10 h-10 rounded-full cursor-pointer"
                    />
                  )}
                </button>

                {/* Dropdown Menu */}
                {user && dropdownVisible && (
                  <div
                    ref={dropdownRef}
                    className="absolute -right-[30px] w-max mt-12 bg-white border border-gray-300 rounded-md shadow-lg "
                    onClick={() => setDropdownVisible(false)} // Close the dropdown when clicking outside
                  >
                    <ul className="text-sm text-gray-700 w-max">
                      <li>
                        <NavLink
                          to="/profile"
                          className="block px-6 py-2 hover:bg-gray-200"
                        >
                          Profile
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/update-password"
                          className="block px-6 py-2 hover:bg-gray-200"
                        >
                          Update Password
                        </NavLink>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            localStorage.clear();
                            setUser(null);
                            navigate("/login");
                          }}
                          className="block w-full px-6 py-2 text-left hover:bg-gray-200"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              {user && (
                <button
                  onClick={toggleModal}
                  className="text-xl text-primaryColor"
                >
                  <FaCartShopping />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cart Modal */}
      {modalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-[400px]">
            <h2 className="mb-4 text-xl font-semibold">Cart Details</h2>
            {cartService ? (
              <>
                <ul className="mb-4">
                  {cartService.services.map((service, index) =>
                    service.subServices.map((item) => (
                      <li key={index} className="pb-2 mb-2 border-b">
                        <p>
                          <strong>Service name:</strong> {item.title}
                        </p>
                      </li>
                    ))
                  )}
                </ul>
                <p className="mb-4">
                  <strong>Total Amount:</strong> Rs.{cartService.totalAmount}
                </p>
                <button
                  onClick={CheckOut}
                  className="px-4 py-2 text-white rounded-md bg-primaryColor hover:bg-primaryColor/80"
                >
                  Checkout
                </button>
              </>
            ) : (
              <p>Your cart is empty.</p>
            )}
            <button
              onClick={toggleModal}
              className="px-4 py-2 mt-4 ml-3 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NavBar;
