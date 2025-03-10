import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import useAuth from "./hooks/useAuth";
import Navbar from "./components/Navbar";
import Feed from "./pages/Feed";
import LoginPage from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import PostDetails from "./pages/PostDetails";
import { useEffect } from "react";
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  console.log("PrivateRoute rendered");
  useEffect(() => {
    console.log("PrivateRoute mounted");
  }, []);
  return user ? children : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  console.log("App rendered");
  useEffect(() => {
    console.log("App mounted");
  }, []);
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />

        {/* Private Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Feed />
            </PrivateRoute>
          }
        />
        <Route
          path="/feed"
          element={
            <PrivateRoute>
              <Feed />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route
          path="/post/:postId"
          element={
            <PrivateRoute>
              <PostDetails />
            </PrivateRoute>
          }
        />

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
