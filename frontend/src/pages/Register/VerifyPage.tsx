import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import InputComponent from "../../components/ui/InputComponent";
import ButtonComponent from "../../components/ui/ButtonComponent";

const VerifyPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const [code, setCode] = useState("");

  const handleVerify = async () => {
    try {
      await axios.post("http://localhost:8080/api/auth/verify", {
        email,
        code,
      });
      alert("Xác thực thành công!");
      navigate("/login");
    } catch (error) {
      alert("Mã xác thực không đúng hoặc đã hết hạn.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold text-center mb-6">Xác minh email</h2>
      <p className="text-sm text-gray-600 mb-4">
        Nhập mã xác thực đã được gửi đến: <b>{email}</b>
      </p>
      <InputComponent
        name="code"
        type="text"
        placeholder="Nhập mã xác thực"
        value={code}
        handleChange={(e) => setCode(e.target.value)}
      />

      <ButtonComponent
        onClick={handleVerify}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
      >
        Xác minh
      </ButtonComponent>
    </div>
  );
};

export default VerifyPage;
