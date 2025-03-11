import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Spinner from "./Spinner";
import uploadImage from "../utilities/uploadImage";

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    fname: "",
    lname: "",
    photo: null as File | null,
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const profileUrl = formData.photo
        ? await uploadImage(formData.photo)
        : "";
      // Exclude photo (which is of type file) and include profileUrl (string) instead
      const { photo, ...formDatawithoutPhoto } = formData;

      await register({ ...formDatawithoutPhoto, profileUrl });

      navigate("/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, photo: file }));
  };

  // Generate preview URL when photo is selected
  useEffect(() => {
    if (formData.photo) {
      const objectUrl = URL.createObjectURL(formData.photo);
      setPreview(objectUrl);
    }
  }, [formData.photo]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md max-w-2xl w-full ml-8">
      <h2 className="text-xl font-semibold text-center mb-4">Sign up</h2>

      {error && (
        <p className="text-red-500 text-center text-sm mb-4">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          className="w-full p-3 bg-[#F5F6F7] border border-gray-300 rounded-lg focus:ring-[#4267B2]"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-3 bg-[#F5F6F7] border border-gray-300 rounded-lg focus:ring-[#4267B2]"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-3 bg-[#F5F6F7] border border-gray-300 rounded-lg focus:ring-[#4267B2]"
        />
        <input
          type="text"
          name="fname"
          placeholder="First Name"
          value={formData.fname}
          onChange={handleChange}
          required
          className="w-full p-3 bg-[#F5F6F7] border border-gray-300 rounded-lg focus:ring-[#4267B2]"
        />
        <input
          type="text"
          name="lname"
          placeholder="Last Name"
          value={formData.lname}
          onChange={handleChange}
          required
          className="w-full p-3 bg-[#F5F6F7] border border-gray-300 rounded-lg focus:ring-[#4267B2]"
        />

        <div className="flex items-center justify-between space-x-4">
          <label className="text-gray-600 w-1/4">Profile Photo</label>

          <div className="flex items-center space-x-4">
            {/* hidden Input */}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="fileInput"
            />

            <label
              htmlFor="fileInput"
              className=" px-4 py-2 bg-[#F5F6F7] border border-gray-300 rounded-lg cursor-pointer w-full  text-center "
            >
              Choose File
            </label>

            <span className="text-gray-600">
              {formData.photo ? formData.photo.name : "No file chosen"}
            </span>
          </div>
        </div>

        {preview && (
          <div className="flex justify-center mb-4">
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-full border border-gray-300 shadow-md"
            />
          </div>
        )}

        {/* Submit Button */}
        {loading ? (
          <div className="flex justify-center">
            <Spinner />
          </div>
        ) : (
          <button
            type="submit"
            className="w-full bg-[#1877F2] text-white py-2 rounded-lg font-bold hover:bg-[#165DB6] transition"
          >
            Submit
          </button>
        )}
      </form>

      <hr className="border-gray-300 mt-8" />
      <p className="text-center mt-4 text-gray-600">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-[#1877F2] font-semibold hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;
