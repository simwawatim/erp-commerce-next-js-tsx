import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

interface ProfileFormData {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: File | null;
  profilePictureUrl?: string;
}

const decodeJWT = (token: string) => {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch (e) {
    console.error("Failed to decode JWT", e);
    return null;
  }
};

const ProfileForm = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState<ProfileFormData>({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    profilePicture: null,
    profilePictureUrl: '',
  });

  const [userId, setUserId] = useState<number | null>(null);

  const defaultImage =
    'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

  const imagePreview = formData.profilePicture
    ? URL.createObjectURL(formData.profilePicture)
    : formData.profilePictureUrl || defaultImage;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('access');
      if (accessToken) {
        const decoded = decodeJWT(accessToken);
        setUserId(decoded?.user_id || null);
      }
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    axios
      .get(`http://127.0.0.1:8000/api/profile/${userId}/`)
      .then(res => {
        const data = res.data;
        setFormData(prev => ({
          ...prev,
          username: data.username,
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email,
          profilePictureUrl: data.employee?.profile_picture
            ? `http://127.0.0.1:8000/${data.employee.profile_picture}`
            : '',
        }));
      })
      .catch(err => {
        console.error('Failed to fetch profile:', err);
      });
  }, [userId]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === 'profilePicture' && files && files.length > 0) {
      console.log('Selected image file:', files[0]); // ✅ Log file for debug
      setFormData(prev => ({
        ...prev,
        profilePicture: files[0],
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      alert("User ID not found.");
      return;
    }

    const submission = new FormData();
    submission.append('username', formData.username);
    submission.append('first_name', formData.firstName);
    submission.append('last_name', formData.lastName);
    submission.append('email', formData.email);

    if (formData.profilePicture) {
      console.log('Appending image to submission:', formData.profilePicture); // ✅ Log before sending
      submission.append('profile_picture', formData.profilePicture);
    } else {
      console.warn('No image selected.');
    }

    try {
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/profile/${userId}/`,
        submission,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('access')}`,
          },
        }
      );
      alert('Profile updated!');
      console.log('Server response:', response.data);
    } catch (error) {
      console.error('Profile update failed:', error);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold text-slate-800 mb-6 text-center">Profile</h2>

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
