import React, { useState } from "react";

const Connect: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contact: "",
    country: "",
    city: "",
    comment: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);

    setFormData({
      fullName: "",
      email: "",
      contact: "",
      country: "",
      city: "",
      comment: "",
    });
  };

  const renderLabel = (text: string, required = true) => (
    <label className="text-sm text-white flex justify-between pr-2">
      {text}
      {required && <span className="text-red-500">*</span>}
    </label>
  );

  return (
    <div className="flex flex-col mgap-10 justify-center items-center min-h-screen bg-black text-white md:pt-[150px] md:pb-10">
      <form
        onSubmit={handleSubmit}
        className="md:grid md:grid-cols-2 flex flex-col gap-y-5 gap-x-8 justify-center items-start"
      >
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
            className="h-[48px] w-[300px] bg-red-600 text-white font-bold rounded hover:cursor-pointer"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Connect;
