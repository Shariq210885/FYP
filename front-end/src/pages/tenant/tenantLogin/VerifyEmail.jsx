import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyEmail } from "../../../api/auth/auth";
import { toast } from "react-toastify";
import { UseUser } from "../../../context/UserContext";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const navigate = useNavigate();
  const { setUser } = UseUser();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      toast.error("Invalid verification link");
      navigate("/login");
      return;
    }

    const verifyUserEmail = async () => {
      try {
        const response = await verifyEmail(token);
        console.log(response);
        if (response.status === 200) {
          const userData = JSON.stringify(response.data.data.user);
          setUser(JSON.parse(userData));
          localStorage.setItem("userData", userData);
          localStorage.setItem("token", response.data.token);
          toast.success("Email verified successfully!");
          navigate("/addProfileInfo");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Verification failed");
        navigate("/login");
      } finally {
        setVerifying(false);
      }
    };

    verifyUserEmail();
  }, [searchParams, navigate, setUser]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      {verifying ? (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Verifying your email...
          </h2>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryColor mx-auto"></div>
        </div>
      ) : null}
    </div>
  );
}

export default VerifyEmail;