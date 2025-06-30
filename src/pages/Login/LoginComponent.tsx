import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import ButtonComponent from "../../components/ui/ButtonComponent";
import InputComponent from "../../components/ui/InputComponent";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../api/auth";
import { useEffect } from "react";

const LoginComponent = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      navigate("/", { replace: true });
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Email không hợp lệ")
        .required("Email không được để trống"),
      password: Yup.string()
        .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
        .required("Mật khẩu không được để trống"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await login(values.email, values.password);

        // Lưu accessToken và refreshToken
        if (response.accessToken) {
          localStorage.setItem("accessToken", response.accessToken);
        }
        if (response.refreshToken) {
          localStorage.setItem("refreshToken", response.refreshToken);
        }

        // Lưu thông tin user nếu có
        if (response.user) {
          localStorage.setItem("user", JSON.stringify(response.user));
          console.log(response.user);
        }

        // Chuyển hướng và reload để cập nhật Header
        navigate("/");
        window.location.reload();

      } catch (err) {
        console.error("Lỗi đăng nhập:", err);
        alert("Đăng nhập thất bại. Vui lòng kiểm tra email hoặc mật khẩu.");
      }
    }
  });

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      {/* Welcome Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Đăng nhập
        </h2>
        <p className="text-gray-600">
          Chào mừng bạn quay trở lại
        </p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            Địa chỉ email
          </label>
          <InputComponent
            name="email"
            type="email"
            placeholder="Nhập email của bạn"
            value={formik.values.email}
            handleChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#507faf] focus:border-transparent transition-all duration-200"
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {formik.errors.email}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
            Mật khẩu
          </label>
          <InputComponent
            name="password"
            type="password"
            placeholder="Nhập mật khẩu"
            value={formik.values.password}
            handleChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#507faf] focus:border-transparent transition-all duration-200"
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {formik.errors.password}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <ButtonComponent
          type="submit"
          className="w-full py-3 px-6 bg-gradient-to-r from-[#507faf] to-[#6b9bd8] hover:from-[#406194] hover:to-[#5a8bc4] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#507faf] focus:ring-offset-2"
        >
          <span className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Đăng nhập
          </span>
        </ButtonComponent>
      </form>

      {/* Divider */}
      <div className="flex items-center my-8">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="px-4 text-sm text-gray-500 uppercase tracking-wide">hoặc</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      {/* Register Link */}
      <div className="text-center">
        <p className="text-gray-600">
          Bạn chưa có tài khoản?{" "}
          <Link
            to="/register"
            className="text-[#507faf] font-semibold hover:text-[#406194] hover:underline transition-colors duration-200"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginComponent;