import NavBar from "./NavBar";
import SideBar from "./SideBar";

function DashboardHeader({
  isSidebarOpen,
  toggleSidebar,
  closeSidebar,
  links,
  sideBarName
}) {
  
  const navbarLinks =[];
  const isTenant = false;
  return (
    <>
      <NavBar navbarLinks={navbarLinks} isTenant={isTenant}/>
      <SideBar
        links={links}
        isOpen={isSidebarOpen}
        closeSidebar={closeSidebar}
        toggleSidebar={toggleSidebar}
        sideBarName={sideBarName}
      />
    </>
  );
}

export default DashboardHeader;
