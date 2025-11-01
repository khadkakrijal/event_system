"use client";

import React, { useState } from "react";
import { ConnectAPI } from "@/app/api/apiService";

const Connect: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contact: "",
    country: "",
    city: "",
    comment: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      await ConnectAPI.create({
        fullName: formData.fullName,
        email: formData.email,
        contact: formData.contact,
        country: formData.country || undefined,
        city: formData.city || undefined,
        comment: formData.comment || undefined,
      });
      setSuccess("Thank you! Your message has been submitted.");
      setFormData({
        fullName: "",
        email: "",
        contact: "",
        country: "",
        city: "",
        comment: "",
      });
    } catch (err: any) {
      setError(err?.message || "Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderLabel = (text: string, required = true) => (
    <label className="text-sm text-white flex justify-between pr-2">
      {text}
      {required && <span className="text-red-500">*</span>}
    </label>
  );

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-black text-white md:pt-[150px] md:pb-10">
      <form
        onSubmit={handleSubmit}
        className="md:grid md:grid-cols-2 flex flex-col gap-y-5 gap-x-8 justify-center items-start"
      >
        {success && (
          <div className="md:col-span-2 bg-green-600/90 px-4 py-2 rounded">
            {success}
          </div>
        )}
        {error && (
          <div className="md:col-span-2 bg-red-600/90 px-4 py-2 rounded">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-2">
          {renderLabel("Full Name")}
          <input
            required
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="h-[48px] w-[300px] text-black text-[16px] pl-[12px] rounded bg-white outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          {renderLabel("Email")}
          <input
            required
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="h-[48px] w-[300px] text-black text-[16px] pl-[12px] rounded bg-white outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          {renderLabel("Contact")}
          <input
            required
            type="text"
            name="contact"
            placeholder="Contact"
            value={formData.contact}
            onChange={handleChange}
            className="h-[48px] w-[300px] text-black text-[16px] pl-[12px] rounded bg-white outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          {renderLabel("Country")}
          <input
            required
            type="text"
            name="country"
            placeholder="Country"
            value={formData.country}
            onChange={handleChange}
            className="h-[48px] w-[300px] text-black text-[16px] pl-[12px] rounded bg-white outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          {renderLabel("City")}
          <input
            required
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            className="h-[48px] w-[300px] text-black text-[16px] pl-[12px] rounded bg-white outline-none"
          />
        </div>

        <div className="md:col-span-2 flex flex-col gap-y-2 w-full">
          {renderLabel("Comment", false)}
          <textarea
            name="comment"
            placeholder="Your Comment"
            value={formData.comment}
            onChange={handleChange}
            className="h-[96px] md:w-full text-black text-[16px] pl-[12px] pt-[12px] rounded bg-white outline-none"
          />
        </div>

        <div className="col-span-2 flex justify-center mt-4">
          <button
            type="submit"
            disabled={submitting}
            className="h-[48px] w-[300px] bg-red-600 text-white font-bold rounded hover:cursor-pointer disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Connect;
