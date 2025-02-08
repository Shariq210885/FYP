import { useState } from "react";
import { resetPassword } from "../../../api/auth/auth";
import * as Yup from "yup"; // Import Yup
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState(""); // Error for new password
  const [confirmPasswordError, setConfirmPasswordError] = useState(""); // Error for confirm password
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const token = searchParams.get("token");
  const navigate=useNavigate()
  // Define Yup validation schema
  const passwordSchema = Yup.object().shape({
    newPassword: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/\d/, "Password must contain at least one number")
      .matches(
        /[@$!%*?&]/,
        "Strong Password e.g (Me123$ni@)"
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  async function handleSubmit() {
    try {
      // Validate input using Yup
      await passwordSchema.validate({ newPassword, confirmPassword });

      // If validation passes, make the API call
      const response = await resetPassword(token,{ password: newPassword });
      if (response.status===200) {
        toast.success("Successfully Password Updated");
        navigate("/login")
      }
    } catch (validationError) {
      // Catch validation errors
      if (validationError.path === "newPassword") {
        setNewPasswordError(validationError.message);
      } else if (validationError.path === "confirmPassword") {
        setConfirmPasswordError(validationError.message);
      }
    }
  }

  async function handleNewPasswordChange(e) {
    const value = e.target.value;
    setNewPassword(value);
  
    try {
      // Create a temporary schema for `newPassword` only
      
      // Validate the new password
      await passwordSchema.validateAt("newPassword",{newPassword:value,confirmPassword});
      setNewPasswordError(""); // Clear the error if validation passes
    } catch (validationError) {
      setNewPasswordError(validationError.message); // Set error message
    }
  }
  

  async function handleConfirmPasswordChange(e) {
    const value = e.target.value;
    setConfirmPassword(value);

    try {
      await passwordSchema.validateAt("confirmPassword", {
        newPassword,
        confirmPassword: value,
      });
      setConfirmPasswordError(""); // Clear error if validation passes
    } catch (validationError) {
      setConfirmPasswordError(validationError.message); // Set error message
    }
  }

  return (
    <>
      <div className="flex justify-center min-h-screen text-gray-900 pt-28">
        <div className="flex justify-center flex-1 max-w-screen-xl m-0 sm:m-10">
          <div className="p-6 lg:w-1/2 xl:w-6/12 sm:p-12">
            <div className="flex flex-col mt-6">
              <h2 className="text-4xl font-bold">Set new password</h2>
              <p className="mt-4 text-2xl font-semibold text-gray-400">
                Create a strong and secured new password
              </p>
              <div className="flex-1 w-full mt-4">
                <div>
                  {/* New Password Input */}
                  <input
                    className="w-full px-8 py-4 mt-5 text-sm font-medium placeholder-gray-500 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:bg-white"
                    type="password"
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                    placeholder="New password"
                  />
                  {newPasswordError && (
                    <p className="mt-1 text-red-500">{newPasswordError}</p>
                  )}

                  {/* Confirm Password Input */}
                  <input
                    className="w-full px-8 py-4 mt-5 text-sm font-medium placeholder-gray-500 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:bg-white"
                    type="password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    placeholder="Confirm password"
                  />
                  {confirmPasswordError && (
                    <p className="mt-1 text-red-500">{confirmPasswordError}</p>
                  )}

                  <button
                    onClick={handleSubmit}
                    className="flex items-center justify-center w-full py-4 mt-5 font-semibold tracking-wide text-white transition-all duration-300 ease-in-out rounded-lg bg-primaryColor text-white-500 hover:bg-primaryColor/90 focus:shadow-outline focus:outline-none"
                  >
                    <span>Save password</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ResetPassword;
