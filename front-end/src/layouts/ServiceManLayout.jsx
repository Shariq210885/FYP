import { Outlet } from "react-router-dom";
import DashboardHeader from "../components/dashboardHeader/DashboardHeader";
import { useState } from "react";
function ServiceManLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {

    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const links = [
    {
      name: "Assigned Service",
      path: "/serviceman/",
    },
    // {
    //   name: "My Services",
    //   path: "my_services",
    // },
    {
      name: "Completed Service",
      path: "completed_service",
    },
    // {
    //   name: "Service Listing",
    //   path: "serviceListing",
      
    // }
  ];
  return (
    <div>
      <DashboardHeader
      links={links}
        isSidebarOpen={isSidebarOpen}
        closeSidebar={closeSidebar}
        toggleSidebar={toggleSidebar}
        sideBarName="Serviceman portal"

      />
      <Outlet />
    </div>
  );
}

export default ServiceManLayout;
