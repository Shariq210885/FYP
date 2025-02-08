import { Outlet } from "react-router-dom";
import TenantHeader from "../components/headers/TenantHeader";
import TenantFooter from "../components/footers/TenantFooter";
function TenantLayout() {
  return (
    <div>
      <TenantHeader />
      <Outlet />
      <TenantFooter />
    </div>
  );
}

export default TenantLayout;
