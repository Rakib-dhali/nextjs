import { connectDB } from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password is required;" },
        { status: 400 },
      );
    }

    await connectDB()
    const existedUser = await User.findOne({email})
    if(existedUser){
        return NextResponse.json(
        { error: "User is already register" },
        { status: 400 },
      );
    }

    User.create({
        email, password
    })

    return NextResponse.json(
        { message: "user registered successfully" },
        { status: 200 },
      );
  } catch (error) {
    console.error("registration error", error)
    return NextResponse.json(
        { error: "failed to register user" },
        { status: 400 },
      );
  }
}
