import React from "react";
import FooterComponent from "../../components/commom/FooterComponent";
import RegisterComponent from "./RegisterComponent";

const Register = () => {
  return (
    <>
      <section className="py-2 px-6 lg:px-40 sm:px-20 bg-gradient-to-r from-[#507faf] to-[#ffffff] min-h-screen flex flex-col">
        {/* header */}
        <nav className="flex justify-between items-center mb-8">
          <h3 className="text-3xl font-semibold text-[#222]">Đăng ký tài khoản</h3>
        </nav>

        {/* phần form */}
        <section className="flex justify-center items-center flex-grow">
          <div className=" shadow-lg rounded-lg p-6 w-full max-w-md">
            <RegisterComponent />
          </div>
        </section>
      </section>

      <footer className="bg-gray-50">
        <FooterComponent />
      </footer>
    </>
  );
};

export default Register;
