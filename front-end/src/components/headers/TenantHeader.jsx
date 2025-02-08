// import React from 'react'

import NavBar from "../dashboardHeader/NavBar";

function TenantHeader() {
  const navbarLinks = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Properties",
      path: "/properties",
    },
    {
      name: "Paying Guests",
      path: "/paying_guests",
    },
    {
      name: "Services",
      path: "/services",
    },
    {
      name: "Contact Us",
      path: "/contact_us",
    },
  ];
  const isTenant = true;
  return (
    <>
      <NavBar navbarLinks={navbarLinks} isTenant={isTenant} />
    </>
  );
}

export default TenantHeader;
