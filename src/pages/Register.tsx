import React from "react";
import RegisterForm from "../components/RegisterForm";
const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 space-x-2">
      <RegisterForm />
      <img
        src="/registerIcon.png"
        alt="team"
        className="h-120 w-150 opacity-40 "
      />
    </div>
  );
};

export default RegisterPage;
