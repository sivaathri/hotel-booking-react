import React, { useState } from 'react';

const UserForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Staff',
    status: 'Active',
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log('User Submitted:', formData);
    alert('User submitted (console log)');
    // Later send to backend via API
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Add New User</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            className="w-full border px-4 py-2 rounded"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            className="w-full border px-4 py-2 rounded"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Password</label>
          <input
            type="password"
            name="password"
            className="w-full border px-4 py-2 rounded"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Role</label>
          <select
            name="role"
            className="w-full border px-4 py-2 rounded"
            onChange={handleChange}
          >
            <option value="Admin">Admin</option>
            <option value="Staff">Staff</option>
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">Status</label>
          <select
            name="status"
            className="w-full border px-4 py-2 rounded"
            onChange={handleChange}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
        >
          Save User
        </button>
      </form>
    </div>
  );
};

export default UserForm;
