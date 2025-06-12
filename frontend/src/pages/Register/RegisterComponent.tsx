import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import ButtonComponent from "../../components/ui/ButtonComponent";
import InputComponent from "../../components/ui/InputComponent";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { register } from "../../api/auth";
import { AxiosError } from "axios";

const RegisterComponent = () => {
  const navigate = useNavigate();
  const fields = ["name", "email", "phone", "password"] as const;

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
      alert(errorData?.message || "Lỗi đăng ký: Không thể kết nối đến máy chủ");
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
        .min(9, "Số điện thoại phải có ít nhất 9 chữ số")
        .required("Số điện thoại không được để trống"),
      password: Yup.string()
        .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
        .required("Mật khẩu không được để trống"),
    }),
    onSubmit: (values) => {
      mutation.mutate(values);
    },
  });

  return (
    <div className="max-w-md mx-auto my-16 p-8 bg-gradient-to-t from-[#507faf] to-[#d1afaf] rounded-xl shadow-lg border border-gray-200">
      <h3 className="text-3xl font-semibold text-center text-gray-900 mb-8">
        Đăng ký
      </h3>

      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
        {fields.map((field) => (
          <div key={field}>
            <label className="block mb-1 text-gray-700 font-medium">
              {field === "name"
                ? "Tên"
                : field === "email"
                ? "Email"
                : field === "phone"
                ? "Số điện thoại"
                : "Mật khẩu"}
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
              placeholder={`Nhập ${
                field === "name"
                  ? "tên"
                  : field === "email"
                  ? "email"
                  : field === "phone"
                  ? "số điện thoại"
                  : "mật khẩu"
              } của bạn`}
              value={formik.values[field]}
              handleChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full"
            />
            {formik.touched[field] && formik.errors[field] && (
              <p className="text-red-600 text-sm mt-1">
                {formik.errors[field]}
              </p>
            )}
          </div>
        ))}

        <ButtonComponent
          type="submit"
          style={{ backgroundColor: "#ee4d2d" }}
          disabled={mutation.isPending}
          className="py-3 rounded-lg text-white font-semibold hover:bg-red-600 transition duration-300"
        >
          {mutation.isPending ? "Đang đăng ký..." : "Đăng ký"}
        </ButtonComponent>
      </form>

      <div className="flex items-center gap-4 py-6">
        <div className="border-t border-gray-300 flex-grow"></div>
        <span className="text-gray-400 uppercase text-sm">hoặc</span>
        <div className="border-t border-gray-300 flex-grow"></div>
      </div>

      <div className="text-center text-sm text-gray-600">
        Bạn đã có tài khoản?{" "}
        <Link
          to="/login"
          className="text-[#ee4d2d] font-semibold hover:underline"
        >
          Đăng nhập
        </Link>
      </div>
    </div>
  );
};

export default RegisterComponent;
