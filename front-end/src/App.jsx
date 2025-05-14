import { createHashRouter, RouterProvider } from "react-router-dom";
import TenantLayout from "./layouts/TenantLayout";
import Login from "./pages/tenant/tenantLogin/Login";
import Register from "./pages/tenant/tenantLogin/Register";
import ForgotPassword from "./pages/tenant/tenantLogin/ForgotPassword";
import ResetPassword from "./pages/tenant/tenantLogin/ResetPassword";
import VerifyEmail from "./pages/tenant/tenantLogin/VerifyEmail";

// Admin pages
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/dashboard/AdminDashboard";
import PayingGuests from "./pages/admin/payingGuests/PayingGuests";
import Services from "./pages/admin/services/Services";
import Users from "./pages/admin/users/Users";

// land owners
import LandOwnerLayout from "./layouts/LandOwnerLayout";
import LandOwnerDashboard from "./pages/landowner/dashboard/LandOwnerDashboard";
import MyAgreements from "./pages/landowner/PropertyRequest/PropertyRequest";
import MyPayingGuests from "./pages/landowner/myPayingGuests/MyPayingGuests";
// service man
import ServiceManLayout from "./layouts/ServiceManLayout";
import ServiceManDashboard from "./pages/serviceMan/dashboard/ServiceManDashboard";
// import MyServices from "./pages/serviceMan/myServices/MyServices";
import Home from "./pages/tenant/home/Home";
import PropertyDetail from "./pages/tenant/PropertyDetail/PropertyDetail";
import Profile from "./pages/tenant/Profile/Profile";
import AddProfileInfo from "./pages/tenant/tenantLogin/AddProfileInfo";
import PropertyListing from "./pages/landowner/PropertyListing/PropertyListing";
import PGListing from "./pages/landowner/PGListng/PGListing";
import AllProperties from "./pages/tenant/AllProperties/AllProperties";
import AllPayingGuest from "./pages/tenant/AllPayingGuest/AllPayingGuest";
import AllServices from "./pages/tenant/AllServices/AllServices";
import ServiceListing from "./pages/admin/ServiceListing/ServiceListing";
import ContactUs from "./pages/tenant/ContactUs/ContactUs";
import ServiceDetail from "./pages/tenant/ServiceDetail/ServiceDetail";
import UpdateProperty from "./pages/landowner/updateProperty/updateProperty";
import UpdatePropertyByAdmin from "./pages/admin/updateProperty/updatePropertyByAdmin";
import UpdatePayingGuests from "./pages/landowner/updatePayingGuest/updatePayingGuest";
import UpdatePayingGuestsByAdmin from "./pages/admin/updatePayingGuest/updatePayingGuestByAdmin";
import ProtectedRoute from "./layouts/ProtectedRoute";
import PublicRoute from "./layouts/PublicRoute";
// import UpdateService from "./pages/serviceMan/UpdateService/UpdateService";
import UpdateServiceByAdmin from "./pages/admin/UpdateService/UpdateServiceByAdmin";
import ServicePaymentSuccess from "./pages/SuccessfullPayment/ServicePayment";
import PayGuestDetail from "./pages/tenant/PayingGuestDetail/PayingGuestDetail";
import PropertyPaymentSuccess from "./pages/SuccessfullPayment/PropertyPayment";
import PayingGuestPaymentSuccess from "./pages/SuccessfullPayment/PayingGuestPayment";
import ServiceRequest from "./pages/admin/ServiceRequest/ServiceRequest";
import UpdatePassword from "./pages/tenant/UpdatePassword/UpdatePassword";
import ServicesCompleted from "./pages/serviceMan/ServicesCompleted/ServicesCompleted";
import PropertyRequest from "./pages/landowner/PropertyRequest/PropertyRequest";
import PayingGuestRequest from "./pages/landowner/PayingGuestRequest/PayingGuestRequest";
import Chat from "./pages/Chats/Chat";
import MyBookings from "./pages/tenant/mybooking/mybooking";

function App() {
  const routes = createHashRouter([
    {
      path: "/",
      element: <TenantLayout />,
      children: [
        {
          path: "",
          element: <Home />,
        },

        {
          path: "contact_us",
          element: <ContactUs />,
        },
        {
          path: "update-password",
          element: <UpdatePassword />,
        },
        {
          path: "properties",
          element: <AllProperties />,
        },
        {
          path: "paying_guests",
          element: <AllPayingGuest />,
        },
        {
          path: "services",
          element: <AllServices />,
        },
        {
          path: "property-detail/:id",
          element: <PropertyDetail />,
        },
        {
          path: "payingguest-detail/:id",
          element: <PayGuestDetail />,
        },
        {
          path: "service-detail/:id",
          element: <ServiceDetail />,
        },
        {
          path: "my-booking",
          element: <MyBookings />,
        },

        {
          path: "profile",
          element: (
            <ProtectedRoute
              allowedRoles={["tenant", "admin", "landowner", "serviceman"]}
            >
              <Profile />
            </ProtectedRoute>
          ),
        },
        {
          path: "servicebooking/success",
          element: <ServicePaymentSuccess />,
        },

        {
          path: "propertybooking/success",
          element: <PropertyPaymentSuccess />,
        },
        {
          path: "paingguestbooking/success",
          element: <PayingGuestPaymentSuccess />,
        },
        {
          path: "switch-account",
          element: (
            <ProtectedRoute
              allowedRoles={["tenant", "admin", "landowner", "serviceman"]}
            >
              <Profile />
            </ProtectedRoute>
          ),
        },
        {
          path: "addProfileInfo",
          element: <AddProfileInfo />,
        },
        {
          path: "login",
          element: (
            <PublicRoute>
              <Login />
            </PublicRoute>
          ),
        },
        {
          path: "register",
          element: (
            <PublicRoute>
              <Register />
            </PublicRoute>
          ),
        },
        {
          path: "forget-password",
          element: (
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          ),
        },
        {
          path: "reset-password",
          element: (
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          ),
        },
        {
          path: "verify-email",
          element: (
            <PublicRoute>
              <VerifyEmail />
            </PublicRoute>
          ),
        },
      ],
    },
    {
      path: "/chat",
      element: <Chat />,
    },

    // admin routes
    {
      path: "/admin/",
      element: (
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "",
          element: <AdminDashboard />,
        },

        {
          path: "services-request",
          element: <ServiceRequest />,
        },
        {
          path: "UpdateProperty/:id",
          element: <UpdatePropertyByAdmin />,
        },
        {
          path: "UpdatePayingGuest/:id",
          element: <UpdatePayingGuestsByAdmin />,
        },
        {
          path: "services",
          element: <Services />,
        },
        { path: "serviceListing", element: <ServiceListing /> },

        {
          path: "UpdateService/:id",
          element: <UpdateServiceByAdmin />,
        },
        {
          path: "paying_guests",
          element: <PayingGuests />,
        },
        {
          path: "users",
          element: <Users />,
        },
        {
          element: <PropertyRequest />,
          path: "property_request",
        },
      ],
    },
    // land owners routes
    {
      path: "/landowner/",
      element: (
        <ProtectedRoute allowedRoles={["landowner", "admin"]}>
          <LandOwnerLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "",
          element: <LandOwnerDashboard />,
        },

        {
          path: "propertyListing",
          element: <PropertyListing />,
        },
        {
          path: "UpdateProperty/:id",
          element: <UpdateProperty />,
        },
        {
          path: "UpdatePayingGuest/:id",
          element: <UpdatePayingGuests />,
        },
        {
          path: "pgListing",
          element: <PGListing />,
        },
        {
          element: <PropertyRequest />,
          path: "property_request",
        },
        {
          element: <PayingGuestRequest />,
          path: "payguest_request",
        },
        {
          path: "my_paying_guests",
          element: <MyPayingGuests />,
        },
        {
          path: "my_agreements",
          element: <MyAgreements />,
        },
      ],
    },
    // service man routes
    {
      path: "/serviceman/",
      element: (
        <ProtectedRoute allowedRoles={["serviceman"]}>
          <ServiceManLayout />
        </ProtectedRoute>
      ),
      children: [
        { path: "", element: <ServiceManDashboard /> },
        { path: "completed_service", element: <ServicesCompleted /> },
      ],
    },
  ]);

  return <RouterProvider router={routes} />;
}

export default App;
