import ConnectDB from "@/lib/config/db";
import EmailModel from "@/lib/models/EmailModel";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// Ensure database connection
async function connectDatabase() {
  if (mongoose.connection.readyState === 0) {
    await ConnectDB();
  }
}

// API endpoint to get all subscribers with pagination and search
export async function GET(request) {
  try {
    await connectDatabase(); // Ensure DB connection

    const page = parseInt(request.nextUrl.searchParams.get("page")) || 1;
    const limit = parseInt(request.nextUrl.searchParams.get("limit")) || 10;
    const query = request.nextUrl.searchParams.get("query");

    let filter = {};
    if (query) {
      const searchRegex = new RegExp(query, "i");
      filter.email = searchRegex;
    }

    const skip = (page - 1) * limit;
    const totalSubscribers = await EmailModel.countDocuments(filter);
    const totalPages = Math.ceil(totalSubscribers / limit);

    const subscribers = await EmailModel.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ date: -1 });

    return NextResponse.json({
      subscribers,
      currentPage: page,
      totalPages,
      totalSubscribers,
    });
  } catch (error) {
    console.error("Error in GET request:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// API endpoint to add a new subscriber
export async function POST(request) {
  try {
    await connectDatabase(); // Ensure DB connection

    const { email } = await request.json();
    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const subscriber = await EmailModel.create({ email });
    return NextResponse.json({
      success: true,
      message: "Subscribed",
      subscriber,
    });
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// API endpoint to delete a subscriber
export async function DELETE(request) {
  try {
    await connectDatabase(); // Ensure DB connection

    const id = request.nextUrl.searchParams.get("id");
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid email ID format" },
        { status: 400 }
      );
    }

    const deletedSubscriber = await EmailModel.findByIdAndDelete(id);
    if (!deletedSubscriber) {
      return NextResponse.json(
        { message: "Subscriber not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Email deleted successfully",
      id,
    });
  } catch (error) {
    console.error("Error in DELETE request:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
