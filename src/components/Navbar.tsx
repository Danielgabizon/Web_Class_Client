import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";

const Navbar = () => {
  useEffect(() => {
    console.log("Navbar mounted");
  });

  const { user, logout } = useAuth();
  console.log("Navbar rendered");
  return (
    <nav className="p-4 bg-[#4267B2] text-white flex justify-between">
      <div>
        <Link to="/" className="text-xl font-bold">
          MyApp
        </Link>
      </div>
      <div className="flex space-x-4 items-center">
        {user ? (
          <>
            <Link to="/home">Feed</Link>
            <Link to="/add-post">New Post</Link>
            <Link to="/profile">Profile</Link>
            <button onClick={logout} className="mx-4 font-bold">
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
