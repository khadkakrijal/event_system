import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSearch } from "react-icons/fa";
import Swal from "sweetalert2";
import UserForm, { TUser } from "./usersForm";
import { useSession } from "next-auth/react";

const UserList: React.FC = () => {
  const { data: session } = useSession(); 
  console.log(session,"data from use session in users")
  const [users, setUsers] = useState<TUser[]>([]);

  const [filteredUsers, setFilteredUsers] = useState<TUser[]>([]);
  const [displayForm, setDisplayForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<TUser | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth0", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "getAllUsers" }),
      });

      const users = await response.json();
      console.log(users,"users arepppp")
      setUsers(users);
      setFilteredUsers(users);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleModal = () => {
    setDisplayForm(false);
  };

  const checkEmailExists = async (email: any, excludeUserId = null) => {
    try {
      const token = await fetch("/api/auth0", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generateToken" }),
      })
        .then((res) => res.json())
        .then((data) => data.access_token);

      const users = await fetch("/api/auth0", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getAllUsers", token }),
      }).then((res) => res.json());

      return users.some(
        (user: any) => user.email === email && user.user_id !== excludeUserId
      );
    } catch (error) {
      console.error("Failed to check email existence:", error);
      return false;
    }
  };

  const createUser = async (userData: TUser) => {
    const emailExists = await checkEmailExists(userData.email);
    if (emailExists) {
      Swal.fire({
        icon: "error",
        title: "Duplicate Email",
        text: "User with the same email already exists!",
        confirmButtonColor: "rgba(0, 130, 182, 0.85)",
      });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/auth0", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "createUser", userData }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Failed to create user");
      }

      const result = await response.json();
      console.log("User created successfully:", result);
      await fetchAllUsers();
      Swal.fire({
        icon: "success",
        title: "User Created",
        text: "User has been created successfully!",
        confirmButtonColor: "rgba(0, 130, 182, 0.85)",
      }).then(() => {
        window.location.reload();
      });
      setDisplayForm(false);
    } catch (error: any) {
      console.error("Error creating user:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error creating user! Please ensure your password is at least 8 characters long and includes uppercase letters, lowercase letters, numbers, and special symbols.",
        confirmButtonColor: "rgba(0, 130, 182, 0.85)",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userId: string, userData: Partial<TUser>) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth0", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "updateUserDetails", userId, userData }),
      });

      const result = await response.json();
      console.log("User updated successfully:", result);
      await fetchAllUsers();
      Swal.fire({
        icon: "success",
        title: "User Updated",
        text: "User has been updated successfully!",
        confirmButtonColor: "rgba(0, 130, 182, 0.85)",
      }).then(() => {
        window.location.reload();
      });
      setDisplayForm(false);
      setEditMode(false);
    } catch (error: any) {
      console.error("Error updating user:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Error in Auth0 handler: ${error.message}`,
      });
      setLoading(false);
    }
  };

  const handleEdit = (user: TUser) => {
    setSelectedUser(user);
    setEditMode(true);
    setDisplayForm(true);
  };

  const handleDelete = async (userId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        const response = await fetch("/api/auth0", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action: "deleteUser", userId }),
        });

        const result = await response.json();
        console.log("User deleted successfully:", result);
        await fetchAllUsers();
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "User has been deleted.",
          confirmButtonColor: "rgba(0, 130, 182, 0.85)",
        }).then(() => {
          window.location.reload();
        });
      } catch (error) {
        console.error("Error deleting user:", error);
        setLoading(false);
      }
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(value.toLowerCase()) ||
          user.email.toLowerCase().includes(value.toLowerCase()) ||
          (user.user_metadata?.role
            .toLowerCase()
            .includes(value.toLowerCase()) ??
            false) ||
          (user.user_metadata?.contact
            .toLowerCase()
            .includes(value.toLowerCase()) ??
            false)
      );
      setFilteredUsers(filtered);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <div className=" px-1 h-[80vh]">
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <ProgressSpinner />
        </div>
      )}
      <div className="flex justify-between items-center py-2">
        <div className=" w-[40%] relative ">
          <InputText
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search..."
            className="p-2 w-full pl-7 rounded-md outline-none border text-sm dark:bg-transparent dark:text-black/80"
          />
          <FaSearch className="absolute left-1.5 top-3 text-gray-500" />
        </div>
        <button
          className="navbar-bg px-3 py-2 rounded-md flex justify-center items-center gap-2 hover:bg-[#0082b6] hover:cursor-pointer"
          onClick={() => {
            setSelectedUser(null);
            setEditMode(false);
            setDisplayForm(true);
          }}
        >
          <FaPlus color="white" /> <span className="text-white ">Add User</span>
        </button>
      </div>

      <DataTable value={filteredUsers} scrollHeight="70vh" className="border">
        <Column
          field="name"
          header="Name"
          headerClassName="navbar-bg py-2 border pl-2 text-white"
          bodyClassName="py-2 border pl-2 text-sm dark:text-black"
        />
        <Column
          field="email"
          header="Email"
          headerClassName="navbar-bg py-2 border pl-2 text-white"
          bodyClassName="py-2 border pl-2 text-sm dark:text-black"
        />
        <Column
          field="user_metadata.role"
          header="Role"
          headerClassName="navbar-bg py-2 border pl-2 text-white"
          bodyClassName="py-2 border pl-2 text-sm dark:text-black"
        />
        <Column
          field="user_metadata.contact"
          header="Contact"
          headerClassName="navbar-bg py-2 border pl-2 text-white"
          bodyClassName="py-2 border pl-2 text-sm dark:text-black"
        />
        <Column
          header="Actions"
          body={(rowData: TUser) => (
            <div className="flex justify-center items-center gap-3">
              <button
                onClick={() => handleEdit(rowData)}
                className="edit text-xl hover:edit cursor-pointer"
              >
                <FaEdit size={18} />
              </button>
              {session?.user?.email !== rowData.email && (
              <button
                onClick={() => handleDelete(rowData.user_id)}
                className="text-red-500 text-xl hover:text-red-700 cursor-pointer"
              >
                <FaTrash size={18} seed={45} />
              </button>
              )}
            </div>
          )}
          headerClassName="navbar-bg py-2 border pl-2 text-white"
          bodyClassName="py-2 border pl-2 dark:text-black"
        />
      </DataTable>
      {displayForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            {editMode ? (
              <>
                {" "}
                <h1 className="text-xl md:text-2xl font-semibold text-[#0082b6d9] -mb-2">
                  Update User
                </h1>
              </>
            ) : (
              <>
                <h1 className="text-xl md:text-2xl font-semibold text-[#0082b6d9] -mb-2">
                  Create User
                </h1>
              </>
            )}
            {/* <button
              className="absolute -top-5 -right-5 text-white px-2 py-2 rounded-full bg-blue-500 cursor-pointer"
              onClick={() => setDisplayForm(false)}
            >
              <FaTimes />
            </button> */}
            <UserForm
              onUserCreated={createUser}
              onUserUpdated={updateUser}
              selectedUser={selectedUser}
              editMode={editMode}
              toggleModal={toggleModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
