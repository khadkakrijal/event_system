import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosResponse } from "axios";
import dotenv from "dotenv";

dotenv.config();

interface UserData {
  email: string;
  password?: string;
  username?: string;
  name?: string;
  picture?: string;
  nickname?: string;
  user_metadata?: {
    role: string;
    contact: string;
  };
}

interface TokenResponse {
  access_token: string;
}

async function generateToken(): Promise<string> {
  const url = "https://dev-yhh3mpvvi0nowbsn.us.auth0.com/oauth/token";
  const data = {
    client_id: process.env.AUTH0_CLIENT_ID!,
    client_secret: process.env.AUTH0_CLIENT_SECRET!,
    audience: "https://dev-yhh3mpvvi0nowbsn.us.auth0.com/api/v2/",
    grant_type: "client_credentials",
  };

  try {
    const response: AxiosResponse<TokenResponse> = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response.data.access_token, "response for token//.//");
    return response.data.access_token;
  } catch (error: any) {
    console.error("Error generating token:", error.message);
    throw new Error(`Error generating token: ${error.message}`);
  }
}

async function createUser(userData: UserData, token: string): Promise<any> {
  try {
    const response: AxiosResponse = await axios.post(
      "https://dev-yhh3mpvvi0nowbsn.us.auth0.com/api/v2/users",
      {
        ...userData,
        connection: "Username-Password-Authentication",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error creating user:", error.message);
    throw new Error(`Failed to create user: ${error.message}`);
  }
}

async function getAllUsers(token: string): Promise<any> {
  try {
    const response: AxiosResponse = await axios.get(
      "https://dev-yhh3mpvvi0nowbsn.us.auth0.com/api/v2/users",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error: any) {
    console.error("Error fetching users:", error.message);
    throw new Error(`Failed to fetch users: ${error.message}`);
  }
}

async function updateUserDetails(
  userData: UserData,
  userId: string,
  token: string
): Promise<any> {
  console.log("Updating user with data:", userData);
  try {
    const response: AxiosResponse = await axios.patch(
      `https://dev-yhh3mpvvi0nowbsn.us.auth0.com/api/v2/users/${userId}`,
      userData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error updating user:", error.message);
    throw new Error(`Failed to update user: ${error.message}`);
  }
}

async function changeUserPassword(
  userId: string,
  newPassword: string,
  token: string
): Promise<any> {
  try {
    const response: AxiosResponse = await axios.patch(
      `https://dev-yhh3mpvvi0nowbsn.us.auth0.com/api/v2/users/${userId}`,
      {
        password: newPassword,
        connection: "Username-Password-Authentication",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error changing password:", error.message);
    throw new Error(`Failed to change password: ${error.message}`);
  }
}

async function deleteUser(userId: string, token: string): Promise<any> {
  try {
    const response: AxiosResponse = await axios.delete(
      `https://dev-yhh3mpvvi0nowbsn.us.auth0.com/api/v2/users/${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error deleting user:", error.message);
    throw new Error(`Failed to delete user: ${error.message}`);
  }
}

export async function POST(req: NextRequest) {
  const { action, userId, userData, newPassword } = await req.json();

  try {
    const token = await generateToken();

    switch (action) {
      case "createUser":
        const createdUser = await createUser(userData, token);
        return NextResponse.json(createdUser);

      case "getAllUsers":
        const users = await getAllUsers(token);
        return NextResponse.json(users.data);

      case "updateUserDetails":
        const updatedUser = await updateUserDetails(userData, userId, token);
        return NextResponse.json(updatedUser);

      case "changeUserPassword":
        const passwordChanged = await changeUserPassword(
          userId,
          newPassword,
          token
        );
        return NextResponse.json(passwordChanged);

      case "deleteUser":
        const deletedUser = await deleteUser(userId, token);
        return NextResponse.json({ message: "User deleted successfully" });

      default:
        return NextResponse.json(
          { message: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error("Error in Auth0 handler:", error.message);
    return NextResponse.json(
      { message: `Error in Auth0 handler: ${error.message}` },
      { status: 500 }
    );
  }
}
