import React, { useState, useRef } from 'react';

interface ProfileFormData {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: File | null;
}

const ProfileForm = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState<ProfileFormData>({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    profilePicture: null,
  });

  const defaultImage =
    'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

  const imagePreview = formData.profilePicture
    ? URL.createObjectURL(formData.profilePicture)
    : defaultImage;

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'profilePicture') {
      setFormData(prev => ({ ...prev, profilePicture: files?.[0] || null }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold text-slate-800 mb-6 text-center">Profile</h2>

      {/* Profile Picture - centered */}
      <div className="flex justify-center mb-8">
        <div
          onClick={handleImageClick}
          className="w-32 h-32 rounded-full overflow-hidden cursor-pointer border-4 border-blue-500 hover:opacity-90 transition"
          title="Click to change profile picture"
        >
          <img
            src={imagePreview}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <input
          ref={fileInputRef}
          type="file"
          name="profilePicture"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-6">
        {/* Username */}
        <div className="col-span-12 md:col-span-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Enter username"
          />
        </div>

        {/* First Name */}
        <div className="col-span-12 md:col-span-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Enter first name"
          />
        </div>

        {/* Last Name */}
        <div className="col-span-12 md:col-span-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Enter last name"
          />
        </div>

        {/* Email */}
        <div className="col-span-12 md:col-span-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Enter email"
          />
        </div>

        {/* Submit Button full width */}
        <div className="col-span-12">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
