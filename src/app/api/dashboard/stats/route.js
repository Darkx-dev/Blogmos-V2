import { NextResponse } from "next/server";
import BlogModel from "@/lib/models/BlogModel";
import EmailModel from "@/lib/models/EmailModel";
import UserModel from "@/lib/models/UserModel";
import mongoose from "mongoose";
import { auth } from "@/auth";

async function connectDatabase() {
  if (mongoose.connection.readyState === 0) {
    await ConnectDB();
  }
}

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    connectDatabase()

    const blogs = await BlogModel.find({}, "views")
    const totalPosts = blogs.length
    const subscribers = await EmailModel.estimatedDocumentCount();
    const totalUsers = await UserModel.estimatedDocumentCount()
    
    
    // Calculate total views 
    const totalViews = blogs.reduce((sum, blog) => sum + (blog.views || 0), 0);
    // Calculate new posts in the last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const newPosts = await BlogModel.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    return NextResponse.json({
      totalPosts,
      totalViews,
      subscribers,
      newPosts,
      totalUsers,
      blogs
    });
  } catch (error) {
    console.error("Error in dashboard stats API:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
