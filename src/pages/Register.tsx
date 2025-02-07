import React from "react";
import RegisterForm from "../components/RegisterForm";

const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
