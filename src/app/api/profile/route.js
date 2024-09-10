import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import sharp from "sharp";
import UserModel from "@/lib/models/UserModel";
import { auth } from "@/auth";

const PATCH = auth(async (request) => {
  try {
    if (request.auth.user?.isAdmin) {
      // Extract data from the request body
      const { id, name, profileImg } = await request.json();

      // Fetch the user from the database
      const user = await UserModel.findById(id);
      if (!user) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }

      let compressedProfileImg;
      if (profileImg) {
        const imageBuffer = Buffer.from(profileImg, "base64");

        // Compress and resize the image using sharp
        compressedProfileImg = await sharp(imageBuffer)
          .resize(800) // Resize to a max width of 800px
          .webp({ quality: 80 }) // Convert to WebP with 80% quality
          .toBuffer();

        // Convert the compressed image back to Base64 format
        compressedProfileImg = `data:image/webp;base64,${compressedProfileImg.toString(
          "base64"
        )}`;
      }

      // Update the user's profile with new details
      const updatedUser = await UserModel.findByIdAndUpdate(
        id,
        {
          name,
          ...(compressedProfileImg && { profileImg: compressedProfileImg }), // Update profileImg only if provided
        },
        { new: true } // Return the updated user document
      );

      return NextResponse.json({
        success: true,
        message: "Profile updated successfully",
        updatedUser,
      });
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
});

async function GET(request) {
  return NextResponse.json({ message: "GET request to /api/profile" });
}

export { GET, PATCH };
export const runtime = "nodejs";
