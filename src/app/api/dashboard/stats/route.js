import { NextResponse } from "next/server";
import ConnectDB from "@/lib/config/db";
import BlogModel from "@/lib/models/BlogModel";
import EmailModel from "@/lib/models/EmailModel";
import UserModel from "@/lib/models/UserModel";

export async function GET() {
  try {
    await ConnectDB();

    const totalPosts = await BlogModel.countDocuments();
    const subscribers = await EmailModel.countDocuments();
    const totalUsers = await UserModel.countDocuments();

    // Calculate total views (assuming you have a 'views' field in your BlogModel)
    const blogs = await BlogModel.find({}, "views");
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
