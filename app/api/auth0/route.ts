import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosError, AxiosResponse } from "axios";
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
      headers: { "Content-Type": "application/json" },
    });
    return response.data.access_token;
  } catch (error: unknown) {
    const err = error as AxiosError;
    console.error("Error generating token:", err.message);
    throw new Error(`Error generating token: ${err.message}`);
  }
}

async function createUser(userData: UserData, token: string) {
  try {
    const response = await axios.post(
      "https://dev-yhh3mpvvi0nowbsn.us.auth0.com/api/v2/users",
      { ...userData, connection: "Username-Password-Authentication" },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError;
    console.error("Error creating user:", err.message);
    throw new Error(`Failed to create user: ${err.message}`);
  }
}

async function getAllUsers(token: string): Promise<AxiosResponse> {
  try {
    return await axios.get(
      "https://dev-yhh3mpvvi0nowbsn.us.auth0.com/api/v2/users",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error: unknown) {
    const err = error as AxiosError;
    console.error("Error fetching users:", err.message);
    throw new Error(`Failed to fetch users: ${err.message}`);
  }
}

async function updateUserDetails(
  userData: Partial<UserData>,
  userId: string,
  token: string
) {
  try {
    const response = await axios.patch(
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
  } catch (error: unknown) {
    const err = error as AxiosError;
    console.error("Error updating user:", err.message);
    throw new Error(`Failed to update user: ${err.message}`);
  }
}

async function changeUserPassword(
  userId: string,
  newPassword: string,
  token: string
) {
  try {
    const response = await axios.patch(
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
  } catch (error: unknown) {
    const err = error as AxiosError;
    console.error("Error changing password:", err.message);
    throw new Error(`Failed to change password: ${err.message}`);
  }
}

async function deleteUser(userId: string, token: string): Promise<void> {
  try {
    await axios.delete(
      `https://dev-yhh3mpvvi0nowbsn.us.auth0.com/api/v2/users/${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error: unknown) {
    const err = error as AxiosError;
    console.error("Error deleting user:", err.message);
    throw new Error(`Failed to delete user: ${err.message}`);
  }
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    action: string;
    userId?: string;
    userData?: UserData;
    newPassword?: string;
  };

  try {
    const token = await generateToken();

    switch (body.action) {
      case "createUser":
        return NextResponse.json(await createUser(body.userData!, token));
      case "getAllUsers":
        const users = await getAllUsers(token);
        return NextResponse.json(users.data);
      case "updateUserDetails":
        return NextResponse.json(
          await updateUserDetails(body.userData!, body.userId!, token)
        );
      case "changeUserPassword":
        return NextResponse.json(
          await changeUserPassword(body.userId!, body.newPassword!, token)
        );
      case "deleteUser":
        await deleteUser(body.userId!, token);
        return NextResponse.json({ message: "User deleted successfully" });
      default:
        return NextResponse.json(
          { message: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { message: `Error in Auth0 handler: ${err.message}` },
      { status: 500 }
    );
  }
}
