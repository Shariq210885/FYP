import { useEffect, useRef, useState } from "react";
import {
  FaCartShopping,
  FaHouseChimneyUser,
  FaRocketchat,
  FaBars,
  FaUserTie,
} from "react-icons/fa6";
import { FaTimes } from "react-icons/fa"; // Import FaTimes from fa instead of fa6
import { NavLink, useNavigate } from "react-router-dom";
import { UseUser } from "../../context/UserContext";
import { createServiceBooking } from "../../api/serviceBooking/serviceBooking";

function NavBar({ navbarLinks, isTenant }) {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();
  const { user, setUser, cartService } = UseUser();

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const toggleModal = () => {
    setModalVisible((prev) => !prev);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest(".mobile-menu-button")
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function CheckOut() {
    const response = await createServiceBooking(cartService);
    if (response.status === 200) {
      window.location.href = response.data.url;
    }
  }

  return (
    <div className="fixed z-50 w-full h-auto bg-white border-b shadow insect-0">
      <div className="container mx-auto">
        <div className="flex items-center justify-between px-4 py-4 md:px-10">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-xl font-semibold" onClick={() => navigate("/")}>
              <img src="/static-images/logo.png" className="h-12 w-auto" alt="Logo" />
            </h1>
          </div>

          {/* Mobile Menu Button */}
          <div className="block md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-500 hover:text-primaryColor focus:outline-none mobile-menu-button"
            >
              {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <ul className="flex items-center space-x-6">
              {navbarLinks.map((link, index) => (
                <li key={index}>
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      isActive ? "text-red-500" : "text-gray-500"
                    }
                  >
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Right side buttons - Desktop */}
          <div className="hidden md:flex items-center gap-2">
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
                  <div className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full -top-1 -right-1">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </div>
                )}
              </div>
            )}

            {user && user?.role === "admin" && (
              <button
                className="flex items-center gap-2 px-2 py-2 text-white rounded-lg bg-primaryColor hover:bg-primaryColor/90"
                onClick={() => navigate("/admin/")}
              >
                <span className="flex items-center gap-1 text-sm">Admin Panel</span>
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
                  <span className="flex items-center gap-1 text-sm md:text-base">
                    <span className="hidden sm:inline">List Your Property</span> <FaHouseChimneyUser size={20} />
                  </span>
                ) : user?.role === "serviceman" ? (
                  <span className="flex items-center gap-1 text-sm md:text-base">
                    <span className="hidden sm:inline">List Your Service</span> <FaUserTie size={20} />
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-sm md:text-base">
                    <span className="hidden sm:inline">List Your Property</span> <FaHouseChimneyUser size={20} />
                  </span>
                )}
              </button>
            )}

            {/* User profile and cart */}
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

                {/* Dropdown Menu - Desktop */}
                {user && dropdownVisible && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-12 bg-white border border-gray-300 rounded-md shadow-lg z-50"
                    onClick={() => setDropdownVisible(false)}
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

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="md:hidden bg-white border-t px-4 py-2 shadow-md"
          >
            <ul className="flex flex-col space-y-3 py-3">
              {navbarLinks.map((link, index) => (
                <li key={index}>
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      isActive ? "text-red-500 block py-1" : "text-gray-500 block py-1"
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </NavLink>
                </li>
              ))}

              {/* Mobile menu additional buttons */}
              <div className="pt-2 border-t border-gray-200">
                {user && (
                  <button
                    className="flex items-center gap-2 py-2 text-gray-600 w-full"
                    onClick={() => {
                      navigate("/chat/");
                      setMobileMenuOpen(false);
                    }}
                  >
                    <FaRocketchat size={20} />
                    <span>Chat</span>
                  </button>
                )}

                {user && user?.role === "admin" && (
                  <button
                    className="flex items-center gap-2 py-2 text-gray-600 w-full"
                    onClick={() => {
                      navigate("/admin/");
                      setMobileMenuOpen(false);
                    }}
                  >
                    <span>Admin Panel</span>
                  </button>
                )}

                {isTenant && user?.role !== "admin" && (
                  <button
                    className="flex items-center gap-2 py-2 text-gray-600 w-full"
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
                      setMobileMenuOpen(false);
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
                    ) : (
                      <span className="flex items-center gap-1">
                        List Your Property <FaHouseChimneyUser size={20} />
                      </span>
                    )}
                  </button>
                )}

                {user && (
                  <>
                    <NavLink
                      to="/profile"
                      className="flex items-center gap-2 py-2 text-gray-600 w-full"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Profile
                    </NavLink>
                    <NavLink
                      to="/update-password"
                      className="flex items-center gap-2 py-2 text-gray-600 w-full"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Update Password
                    </NavLink>
                    <button
                      onClick={() => {
                        localStorage.clear();
                        setUser(null);
                        navigate("/login");
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 py-2 text-gray-600 w-full"
                    >
                      Logout
                    </button>
                    <button
                      onClick={() => {
                        toggleModal();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 py-2 text-gray-600 w-full"
                    >
                      <FaCartShopping /> Cart
                    </button>
                  </>
                )}

                {!user && (
                  <button
                    onClick={() => {
                      navigate("/login");
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 py-2 text-gray-600 w-full"
                  >
                    Login
                  </button>
                )}
              </div>
            </ul>
          </div>
        )}
      </div>

      {/* Cart Modal - Made responsive */}
      {modalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md w-full max-w-[400px] max-h-[80vh] overflow-y-auto">
            <h2 className="mb-4 text-lg sm:text-xl font-semibold">Cart Details</h2>
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
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={CheckOut}
                    className="px-4 py-2 text-white rounded-md bg-primaryColor hover:bg-primaryColor/80"
                  >
                    Checkout
                  </button>
                  <button
                    onClick={toggleModal}
                    className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Close
                  </button>
                </div>
              </>
            ) : (
              <>
                <p>Your cart is empty.</p>
                <button
                  onClick={toggleModal}
                  className="px-4 py-2 mt-4 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NavBar;
