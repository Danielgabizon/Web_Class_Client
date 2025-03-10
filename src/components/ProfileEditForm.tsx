import { useState, useEffect } from "react";
import { User } from "../types/userTypes";
import userService from "../services/userService";
import Spinner from "./Spinner";
import uploadImage from "../utilities/uploadImage";
type ProfileEditFormProps = {
  userDetails: User;
  onClose: () => void;
  onProfileEdit: (updatedUser: User) => void;
};
const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  userDetails,
  onClose,
  onProfileEdit,
}) => {
  const [formData, setFormData] = useState({
    username: userDetails.username,
    email: userDetails.email,
    fname: userDetails.fname,
    lname: userDetails.lname,
    profilePic: null as null | File,
  });
  const [preview, setPreview] = useState<string | null>(
    userDetails.profileUrl || null
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      let profileUrl = userDetails.profileUrl; // Keep the old image if no new one is uploaded
      if (formData.profilePic) {
        profileUrl = await uploadImage(formData.profilePic);
      }

      const { profilePic, ...formDatawithoutPhoto } = formData;
      const { request } = userService.updateUser(userDetails._id!, {
        ...formDatawithoutPhoto,
        profileUrl: profileUrl,
      });
      const response = await request;
      onProfileEdit(response.data.data!);
      onClose();
    } catch (error: any) {
      console.error("Error editing profile:", error);
      if (error.response) {
        // server responded with a status code that falls out of the range of 2xx
        setError(error.response.data.message);
      } else if (error.request) {
        // request was made but no response received
        setError("No response from the server. Please try again later.");
      } else {
        // something else happened
        setError("Something went wrong. Please try again later.");
      }
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
    setFormData((prev) => ({ ...prev, profilePic: file }));
  };

  // Generate preview URL when photo is selected
  useEffect(() => {
    if (formData.profilePic) {
      const objectUrl = URL.createObjectURL(formData.profilePic);
      setPreview(objectUrl);
    }
  }, [formData.profilePic]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-2xl">
      <h2 className="text-xl font-semibold text-center mb-4">Edit Profile</h2>
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
          <label className="text-gray-600 w-1/4">Photo</label>

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
              {formData.profilePic
                ? formData.profilePic.name
                : "No file chosen"}
            </span>
          </div>
        </div>

        {preview && (
          <div className="flex justify-center mb-4">
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 object-cover border border-gray-300 shadow-md"
            />
          </div>
        )}
        {/* Submit Button */}
        {loading ? (
          <div className="flex justify-center">
            <Spinner />
          </div>
        ) : (
          <div className="flex justify-center space-x-4">
            <button
              type="button"
              onClick={onClose}
              className=" w-40 bg-gray-300 text-gray-800 py-2 rounded-lg font-bold hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-40 bg-[#1877F2] text-white py-2 rounded-lg font-bold hover:bg-[#165DB6] transition"
            >
              Edit
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
export default ProfileEditForm;
