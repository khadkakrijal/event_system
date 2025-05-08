import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { ProgressSpinner } from "primereact/progressspinner";
import SubmitButton from "./submitButton";

interface IUserMetadata {
  role: string;
  contact: string;
}

export type TUser = {
  user_id: string;
  name: string;
  email: string;
  password?: string;
  role: string;
  contact: string;
  user_metadata?: IUserMetadata;
};

type CreateUserPayload = {
  email: string;
  name: string;
  password: string;
  user_metadata: IUserMetadata;
};

interface UserFormProps {
  onUserCreated: (userData: TUser) => Promise<void>;
  onUserUpdated: (userId: string, userData: Partial<TUser>) => Promise<void>;
  selectedUser: TUser | null;
  editMode: boolean;
  toggleModal: () => void;
}

const UserForm: React.FC<UserFormProps> = ({
  onUserCreated,
  onUserUpdated,
  selectedUser,
  editMode,
  toggleModal,
}) => {
  const FormRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState<TUser>({
    user_id: "",
    name: "",
    email: "",
    password: "",
    role: "",
    contact: "",
  });
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, setValue, handleSubmit } = useForm();

  useEffect(() => {
    if (editMode && selectedUser) {
      setFormData({
        user_id: selectedUser.user_id,
        name: selectedUser.name,
        email: selectedUser.email,
        password: "",
        role: selectedUser.user_metadata?.role || "",
        contact: selectedUser.user_metadata?.contact || "",
      });
    } else {
      setFormData({
        user_id: "",
        name: "",
        email: "",
        password: "",
        role: "",
        contact: "",
      });
    }
  }, [editMode, selectedUser]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "contact" && !/^\d*$/.test(value)) {
      return;
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    setValue(name, value);
  };

  const onSubmit = async () => {
    if (!/^\d{10}$/.test(formData.contact)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Contact",
        text: "Contact must be a 10-digit number.",
        confirmButtonColor: "rgba(0, 130, 182, 0.85)",
      });
      return;
    }

    const updatePayload: Partial<TUser> = {
      email: formData.email,
      name: formData.name,
      user_metadata: {
        role: formData.role,
        contact: formData.contact,
      },
    };

    const createPayload: CreateUserPayload = {
      email: formData.email,
      name: formData.name,
      password: formData.password || "",
      user_metadata: {
        role: formData.role,
        contact: formData.contact,
      },
    };

    try {
      setLoading(true);
      if (editMode) {
        await onUserUpdated(formData.user_id, updatePayload);
      } else {
        await onUserCreated(createPayload as TUser);
      }
    } catch (error: unknown) {
      const err = error as Error;
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Error in Auth0 handler: ${err.message}`,
        confirmButtonColor: "rgba(0, 130, 182, 0.85)",
      });
    } finally {
      setLoading(false);
    }
  };

  const changeUserPassword = async (userId: string, newPassword: string) => {
    try {
      const response = await fetch("/api/auth0", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "changeUserPassword",
          userId,
          newPassword,
        }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Failed to change password");
      }

      const result = await response.json();
      console.log("Password changed successfully:", result);
      Swal.fire({
        icon: "success",
        title: "Password Changed",
        text: "Password has been changed successfully!",
        confirmButtonColor: "rgba(0, 130, 182, 0.85)",
      });
      setShowChangePasswordModal(false);
      setPasswordChanged(true);
    } catch (error: unknown) {
      const err = error as Error;
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Error in Auth0 handler: ${err.message}`,
        confirmButtonColor: "rgba(0, 130, 182, 0.85)",
      });
    }
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Password Mismatch",
        text: "New Password and Confirm Password do not match!",
        confirmButtonColor: "rgba(0, 130, 182, 0.85)",
      });
      return;
    }

    changeUserPassword(formData.user_id, newPassword);
  };

  return (
    <>
      <form
        ref={FormRef}
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-full pt-4 space-y-4"
      >
        <input type="hidden" name="user_id" value={formData.user_id} />

        <FormField label="Name">
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            id="name"
            value={formData.name}
            className="border p-2 text-sm dark:bg-white text-black"
            placeholder="Enter your name"
            onChange={handleChange}
            required
          />
        </FormField>

        <FormField label="Email">
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            id="email"
            value={formData.email}
            className="border p-2 text-sm dark:bg-white text-black"
            placeholder="Enter your email"
            onChange={handleChange}
            required
          />
        </FormField>

        {!editMode && (
          <FormField label="Password">
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              id="password"
              value={formData.password}
              className="border p-2 text-sm dark:bg-white text-black"
              placeholder="Enter your password"
              onChange={handleChange}
              required
            />
          </FormField>
        )}

        <FormField label="Role">
          <select
            {...register("role", { required: "Role is required" })}
            id="role"
            value={formData.role}
            className="border p-2 text-sm dark:bg-white text-black"
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select role</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Admin">Admin</option>
          </select>
        </FormField>

        <FormField label="Contact">
          <input
            type="text"
            {...register("contact", { required: "Contact is required" })}
            id="contact"
            value={formData.contact}
            className="border p-2 text-sm dark:bg-white text-black"
            placeholder="Enter your contact"
            onChange={handleChange}
            required
          />
        </FormField>

        {editMode && (
          <>
            <div className="mt-4">
              {!passwordChanged && (
                <div
                  className="bg-green-500 text-white p-2 px-4 rounded text-center cursor-pointer"
                  onClick={() => setShowChangePasswordModal(true)}
                >
                  Change Password
                </div>
              )}
              {showChangePasswordModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-4 relative w-[500px]">
                    <button
                      className="absolute top-2 right-2 text-gray-500 text-3xl cursor-pointer"
                      onClick={() => setShowChangePasswordModal(false)}
                    >
                      &times;
                    </button>
                    <h2 className="text-xl font-bold mb-4">Change Password</h2>
                    <div className="mb-4">
                      <label htmlFor="newPassword" className="block text-gray-700">New Password</label>
                      <input
                        type="password"
                        id="newPassword"
                        className="border p-2 w-full text-black"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="confirmPassword" className="block text-gray-700">Confirm Password</label>
                      <input
                        type="password"
                        id="confirmPassword"
                        className="border p-2 w-full"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button className="bg-gray-500 text-white p-2 px-4 rounded" onClick={() => setShowChangePasswordModal(false)}>Cancel</button>
                      <button className="bg-blue-500 text-white p-2 px-4 rounded" onClick={handleChangePassword}>Change</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {passwordChanged && (
              <div className="bg-green-500 text-white p-2 px-4 rounded text-center">Password Changed</div>
            )}
          </>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-[70px]">
            <ProgressSpinner />
          </div>
        ) : (
          <div className="flex gap-2">
            <SubmitButton editMode={editMode} />
            <button
              type="button"
              onClick={toggleModal}
              className="cancel-button rounded py-3 flex-1"
            >
              Cancel
            </button>
          </div>
        )}
      </form>
    </>
  );
};

export default UserForm;

const FormField = ({
  label,
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
}) => (
  <div className="flex flex-col bg-white w-full">
    <label className="text-gray-700 text-sm font-bold mb-2">{label}</label>
    {children}
    {error && <p className="text-red-500 text-xs italic">{error}</p>}
  </div>
);
