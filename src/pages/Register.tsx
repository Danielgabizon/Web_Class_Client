import React from "react";
import RegisterForm from "../components/RegisterForm";
const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 space-x-64">
      <RegisterForm />
      <img
        src="/assets/team.png"
        alt="team"
        className="h-70 w-70 opacity-40 "
      />
    </div>
  );
};

export default RegisterPage;
