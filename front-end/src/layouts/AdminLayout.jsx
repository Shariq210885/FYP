import { Outlet } from "react-router-dom";
import DashboardHeader from "../components/dashboardHeader/DashboardHeader";
import { useState } from "react";
function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const links = [
    {
      name: "Dashboard",
      path: "/admin/",
    },
    // {
    //   name: "Properties",
    //   path: "/admin/properties",
    // },
    {
      name: "Services",
      path: "/admin/services",
    },
    {
      name: "Services Requests",
      path: "/admin/services-request",
    },
  
    {
      name: "Paying guests",
      path: "/admin/paying_guests",
    },
   
    {
      name: "Users",
      path: "/admin/users",
    },
    {
      name: "Service Listing",
      path: "serviceListing",
      
    }
  ];



  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div>
      <DashboardHeader links={links}
        isSidebarOpen={isSidebarOpen}
        closeSidebar={closeSidebar}
        toggleSidebar={toggleSidebar}
        sideBarName="Admin portal"
      />
      <Outlet />
    </div>
  );
}

export default AdminLayout;
