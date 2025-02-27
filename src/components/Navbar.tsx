import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";

const Navbar: React.FC = () => {
  console.log("Navbar rendered");

  useEffect(() => {
    console.log("Navbar mounted");
  });

  const { user, logout } = useAuth();
  return (
    <nav className="p-4 bg-[#4267B2] text-white flex justify-between sticky top-0 w-full shadow-md z-50">
      <div>
        <Link to="/" className="text-xl font-bold">
          BzzNet
        </Link>
      </div>
      <div className="flex space-x-4 items-center">
        {user ? (
          <>
            <Link to="/feed">Feed</Link>
            <Link to="/profile">Profile</Link>
            <button onClick={logout} className="mx-4 font-bold  cursor-pointer">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
