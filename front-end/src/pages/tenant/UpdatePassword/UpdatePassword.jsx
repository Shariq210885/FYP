import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { updatePasswordUser } from "../../../api/auth/auth";
import {toast} from "react-toastify"
const UpdatePassword = () => {

  // Yup schema for validation
  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string().required("Current password is required"),
    password: Yup.string()
      .required("New password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords do not match")
      .required("Please confirm your password"),
  });

  const {
    register,
      handleSubmit,
      reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange", // Validate on field change
  });

  const onSubmit = async (data) => {
    try {
      const sumbitData = {
        currentPassword: data.currentPassword,
        newpassword: data.password,
        passwordConfirm: data.confirmPassword,
      };
      const response = await updatePasswordUser(sumbitData);
      if (response.status === 201) {
          toast.success("Password updated successfully!");
          reset();
      } else {
        toast.error("Failed to update password. Try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update password. Try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded-md shadow-md w-96">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
          Update Password
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Current Password */}
          <div>
            <label
              className="block mb-2 text-gray-600"
              htmlFor="currentPassword"
            >
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              {...register("currentPassword")}
              className={`w-full p-2 border rounded-md ${
                errors.currentPassword ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-indigo-500`}
            />
            {errors.currentPassword && (
              <p className="text-sm text-red-500">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="block mb-2 text-gray-600" htmlFor="password">
              New Password
            </label>
            <input
              type="password"
              id="password"
              {...register("password")}
              className={`w-full p-2 border rounded-md ${
                errors.password ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-indigo-500`}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              className="block mb-2 text-gray-600"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              {...register("confirmPassword")}
              className={`w-full p-2 border rounded-md ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-indigo-500`}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full p-2 text-white transition duration-300 bg-primaryColor rounded-md hover:bg-primaryColor/80 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Updating..." : "Update Password"}
          </button>
        </form>

        
      </div>
    </div>
  );
};

export default UpdatePassword;
