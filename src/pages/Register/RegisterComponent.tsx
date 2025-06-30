import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import ButtonComponent from "../../components/ui/ButtonComponent";
import InputComponent from "../../components/ui/InputComponent";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { register } from "../../api/auth";
import { AxiosError } from "axios";
import { useNotification } from "../Detail/NotificationProvider";

const RegisterComponent = () => {
  const navigate = useNavigate();
  const fields = ["name", "email", "phone", "password"] as const;
  const { showMessage } = useNotification();

  const mutation = useMutation({
    mutationFn: (values: {
      name: string;
      email: string;
      password: string;
      phone: string;
    }) => register(values.name, values.email, values.password, values.phone),
    onSuccess: (_, variables) => {
      navigate("/verify", { state: { email: variables.email } });
    },
    onError: (error) => {
      const axiosError = error as AxiosError;
      const errorData = axiosError.response?.data as { message?: string };
      showMessage("Lỗi đăng ký: Không thể kết nối đến máy chủ");
    },
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, "Tên phải có ít nhất 3 ký tự")
        .required("Tên không được để trống"),
      email: Yup.string()
        .email("Email không hợp lệ")
        .required("Email không được để trống"),
      phone: Yup.string()
        .matches(/^\d+$/, "Số điện thoại chỉ được chứa số")
        .min(10, "Số điện thoại phải có 10 chữ số")
        .max(10, "Số điện thoại phải có 10 chữ số")
        .required("Số điện thoại không được để trống"),
      password: Yup.string()
        .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
        .required("Mật khẩu không được để trống"),
    }),
    onSubmit: (values) => {
      mutation.mutate(values);
    },
  });

  const getFieldLabel = (field: string) => {
    const labels = {
      name: "Họ và tên",
      email: "Địa chỉ email",
      phone: "Số điện thoại",
      password: "Mật khẩu",
    };
    return labels[field as keyof typeof labels];
  };

  const getFieldPlaceholder = (field: string) => {
    const placeholders = {
      name: "Nhập họ và tên",
      email: "Nhập địa chỉ email",
      phone: "Nhập số điện thoại",
      password: "Nhập mật khẩu",
    };
    return placeholders[field as keyof typeof placeholders];
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      {/* Welcome Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Đăng ký
        </h2>
        <p className="text-gray-600">
          Tạo tài khoản mới để bắt đầu
        </p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {fields.map((field) => (
          <div key={field}>
            <label 
              htmlFor={field} 
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              {getFieldLabel(field)}
            </label>
            <InputComponent
              name={field}
              type={
                field === "password"
                  ? "password"
                  : field === "email"
                  ? "email"
                  : "text"
              }
              placeholder={getFieldPlaceholder(field)}
              value={formik.values[field]}
              handleChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#507faf] focus:border-transparent transition-all duration-200"
            />
            {formik.touched[field] && formik.errors[field] && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {formik.errors[field]}
              </p>
            )}
          </div>
        ))}

        {/* Submit Button */}
        <ButtonComponent
          type="submit"
          disabled={mutation.isPending}
          className={`w-full py-3 px-6 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#507faf] focus:ring-offset-2 ${
            mutation.isPending
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-[#507faf] to-[#6b9bd8] hover:from-[#406194] hover:to-[#5a8bc4]"
          }`}
        >
          <span className="flex items-center justify-center">
            {mutation.isPending ? (
              <>
                <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang đăng ký...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Đăng ký
              </>
            )}
          </span>
        </ButtonComponent>
      </form>

      {/* Divider */}
      <div className="flex items-center my-8">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="px-4 text-sm text-gray-500 uppercase tracking-wide">hoặc</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      {/* Login Link */}
      <div className="text-center">
        <p className="text-gray-600">
          Bạn đã có tài khoản?{" "}
          <Link
            to="/login"
            className="text-[#507faf] font-semibold hover:text-[#406194] hover:underline transition-colors duration-200"
          >
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterComponent;