import ConnectDB from "@/lib/config/db";
import { NextResponse } from "next/server";

const LoadDB = async () => {
  await ConnectDB();
};

LoadDB();

export async function POST(request) {
  const { email, password } = await request.json();
  return NextResponse.json({ message: "Success", email, password });
}

export const runtime = "nodejs";