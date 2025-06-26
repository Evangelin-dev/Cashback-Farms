import apiClient from "@/src/utils/api/apiClient"; // <-- Add this import
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const initialForm = {
  first_name: "",
  company_name: "",
  phone_number: "",
  company_number: "",
  email: "",
};

const RegurestionPage: React.FC = () => {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    try {
      await apiClient.post("agents/register/", form);
      // Or, if you don't have apiClient, use:
      // await fetch("/agents/register", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(form),
      // });

      setTimeout(() => {
        navigate("/");
      }, 800);
    } catch (error) {
      setSubmitted(false);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 py-12 px-4">
      <div className="w-full max-w-xl rounded-3xl shadow-2xl bg-white/70 backdrop-blur-lg border border-green-200 p-10 relative overflow-hidden">
        {/* Glassy gradient background effect */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute -top-16 -left-16 w-72 h-72 bg-gradient-to-br from-green-200 via-green-100 to-white opacity-40 rounded-full blur-2xl" />
          <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-gradient-to-tr from-green-300 via-green-100 to-white opacity-30 rounded-full blur-2xl" />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-green-700 text-center mb-2 drop-shadow-lg">
            Registration
          </h1>
          <p className="text-green-900 text-center mb-8 font-medium">
            Welcome to <span className="font-bold">{form.company_name}</span>
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-green-700 font-semibold mb-1">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-green-200 bg-white/70 focus:ring-2 focus:ring-green-300 focus:outline-none shadow"
                  required
                />
              </div>
              <div>
                <label className="block text-green-700 font-semibold mb-1">Company Name</label>
                <input
                  type="text"
                  name="company_name"
                  value={form.company_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-green-200 bg-white/70 focus:ring-2 focus:ring-green-300 focus:outline-none shadow"
                  required
                />
              </div>
              <div>
                <label className="block text-green-700 font-semibold mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone_number"
                  value={form.phone_number}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-green-200 bg-white/70 focus:ring-2 focus:ring-green-300 focus:outline-none shadow"
                  required
                />
              </div>
              <div>
                <label className="block text-green-700 font-semibold mb-1">Company Number</label>
                <input
                  type="text"
                  name="company_number"
                  value={form.company_number}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-green-200 bg-white/70 focus:ring-2 focus:ring-green-300 focus:outline-none shadow"
                  required
                />
              </div>
              {/* User Type Dropdown */}
              <div className="md:col-span-2">
                <label className="block text-green-700 font-semibold mb-1">
                  User Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="user_type"
                  value={(form as any).user_type || ""}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-xl border border-green-200 bg-white/70 focus:ring-2 focus:ring-green-300 focus:outline-none shadow"
                >
                  <option value="" disabled>Select User Type</option>
                  <option value="realestate">Real Estate Agent</option>
                  <option value="b2b">B2B Vendor</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-green-700 font-semibold mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-green-200 bg-white/70 focus:ring-2 focus:ring-green-300 focus:outline-none shadow"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 mt-2 rounded-2xl bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white font-bold text-lg shadow-lg hover:from-green-500 hover:to-green-700 transition"
            >
              Register
            </button>
            {submitted && (
              <div className="mt-4 text-center text-green-700 font-semibold animate-fade-in">
                Registration successful! Thank you, {form.first_name}.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegurestionPage;
