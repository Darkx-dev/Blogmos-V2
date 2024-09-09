import ConnectDB from "@/lib/config/db";
import UserModel from "@/lib/models/UserModel";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const LoadDB = async () => {
  await ConnectDB();
};

LoadDB();

export async function POST(request) {
  const { email, password, name } =
    await request.json();
  const isExistingUser = await UserModel.findOne({ email: email });
  if (isExistingUser) {
    return NextResponse.status(409).json({ message: "Email already exists" });
  }
  const pwHash = (await bcrypt.hash(password, 10)).toString();
  const user = await UserModel.create({
    email,
    password: pwHash,
    name,
  });
  return NextResponse.json({ success: true, user });
}

export const runtime = "nodejs";
