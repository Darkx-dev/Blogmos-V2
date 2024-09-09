import UserModel from "@/lib/models/UserModel";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { id } = await request.json();
  const user = (await UserModel.findById(id)) || false;
  if (!user) {
    return NextResponse.json({ message: "User not found", found: false });
  }
  return NextResponse.json({ user, found: true });
}
