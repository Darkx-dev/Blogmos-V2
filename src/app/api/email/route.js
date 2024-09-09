import ConnectDB from "@/lib/config/db";
import EmailModel from "@/lib/models/EmailModel";
import { NextResponse } from "next/server";
const LoadDB = async () => {
  await ConnectDB();
};

export async function POST(request) {
  const formData = await request.formData();
  const emailData = {
    email: formData.get("email"),
  };
  const subscriber = await EmailModel.create(emailData);
  return NextResponse.json({
    success: true,
    message: "Subscribed",
    subscriber,
  });
}

export async function GET(request, response) {
  const emails = await EmailModel.find({});
  return NextResponse.json({
    success: true,
    emails,
  });
}

export async function DELETE(request) {
  const id = request.nextUrl.searchParams.get("id");
  await EmailModel.findByIdAndDelete(id);
  return NextResponse.json({
    success: true,
    message: "Email deleted successfully",
  });
}
