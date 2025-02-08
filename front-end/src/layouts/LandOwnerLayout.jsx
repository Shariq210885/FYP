import { Outlet } from "react-router-dom";
import DashboardHeader from "../components/dashboardHeader/DashboardHeader";
import { useState } from "react";
function LandOwnerLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const links = [
    {
      name: "Properties",
      path: "/landowner/",
    },
    {
      name: "Paying guests",
      path: "/landowner/my_paying_guests",
    },

    {
      name: "Property Request",
      path: "/landowner/property_request",
    },
    {
      name: "Paying guest Request",
      path: "/landowner/payguest_request",
    },
    
    {
      name: "Property Listing",
      path: "/landowner/propertyListing",
    },
    {
      name: "Paying Guest Listing",
      path: "/landowner/pgListing",
    },
  ];

  const toggleSidebar = () => {

    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div>
      <DashboardHeader
        links={links}
        isSidebarOpen={isSidebarOpen}
        closeSidebar={closeSidebar}
        toggleSidebar={toggleSidebar}
        sideBarName="LandOwner portal"

      />
      <Outlet />
    </div>
  );
}

export default LandOwnerLayout;
