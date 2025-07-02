import React from "react";
import FooterComponent from "../../components/commom/FooterComponent";
import RegisterComponent from "./RegisterComponent";

const Register = () => {
  return (
    <>
      <section className="min-h-screen flex flex-col">
        {/* Header */}
        {/* <nav className="py-4 px-6 lg:px-40 sm:px-20 bg-white shadow-sm">
          <h3 className="text-2xl font-semibold text-[#222]">Đăng ký tài khoản</h3>
        </nav> */}

        {/* Main Content - Two Column Layout */}
        <section className="flex-grow flex">
          {/* Left Side - Image */}
         <div className="hidden lg:flex lg:w-1/2 h-screen relative">
            <img
              src="/images/register-image.jpg"
              alt="Login background"
              className="absolute inset-0 w-full h-full object-cover object-[center_60%] z-0"
            />
            <div className="absolute inset-0 bg-black bg-opacity-10 z-10"></div>
            
          </div>

          {/* Right Side - Register Form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-gray-50">
            <div className="w-full max-w-md">
              <RegisterComponent />
            </div>
          </div>
        </section>
      </section>

      {/* <footer className="bg-gray-50">
        <FooterComponent />
      </footer> */}
    </>
  );
};

export default Register;