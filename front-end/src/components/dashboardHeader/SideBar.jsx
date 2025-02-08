import { NavLink } from "react-router-dom";

function SideBar({ isOpen, closeSidebar, toggleSidebar, links,sideBarName }) {
  return (
    <div
      className={`fixed top-20 bg-gray-800 text-white w-56 min-h-screen overflow-y-auto transition-transform transform ease-in-out duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-[72%] lg:translate-x-0"
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-center text-primaryColor">{sideBarName}</h1>
          <button
            className="flex text-gray-500 hover:text-gray-600 lg:hidden"
            onClick={toggleSidebar}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>
        <ul className="mt-4">
          {links.map((link, index) => (
            <li className="mb-2" key={index}>
              <NavLink
                to={link.path}
                onClick={closeSidebar}
                className="block hover:text-primaryColor"
              >
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SideBar;
