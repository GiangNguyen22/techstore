import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import ButtonComponent from "../../components/ui/ButtonComponent";
import InputComponent from "../../components/ui/InputComponent";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../api/auth"; // Thêm dòng này

const LoginComponent = () => {
  const navigate = useNavigate();

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
    <div className="max-w-md mx-auto my-16 p-8 bg-gradient-to-t from-[#507faf] to-[#d1afaf] rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-semibold text-center text-gray-900 mb-8">
        Đăng nhập
      </h2>

      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
        <div>
          <label htmlFor="email" className="block mb-1 text-gray-700 font-medium">
            Email
          </label>
          <InputComponent
            name="email"
            type="email"
            placeholder="Nhập email của bạn"
            value={formik.values.email}
            handleChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full"
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-600 text-sm mt-1">{formik.errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block mb-1 text-gray-700 font-medium">
            Mật khẩu
          </label>
          <InputComponent
            name="password"
            type="password"
            placeholder="Nhập mật khẩu"
            value={formik.values.password}
            handleChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full"
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-600 text-sm mt-1">{formik.errors.password}</p>
          )}
        </div>

        <ButtonComponent
          type="submit"
          style={{ backgroundColor: "#ee4d2d" }}
          className="py-3 rounded-lg text-white font-semibold hover:bg-red-600 transition duration-300"
        >
          Đăng nhập
        </ButtonComponent>
      </form>

      <div className="flex items-center gap-4 py-6">
        <div className="border-t border-gray-300 flex-grow"></div>
        <span className="text-gray-400 uppercase text-sm">hoặc</span>
        <div className="border-t border-gray-300 flex-grow"></div>
      </div>

      <div className="text-center text-sm text-gray-600">
        Bạn chưa có tài khoản?{" "}
        <Link
          to="/register"
          className="text-[#ee4d2d] font-semibold hover:underline"
        >
          Đăng ký
        </Link>
      </div>
    </div>
  );
};

export default LoginComponent;
