import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Video, { IVideo } from "@/models/video.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const videos = (await Video.find({})
      .sort({ createdAt: -1 })
      .lean()) as IVideo[];
    if (!videos || videos.length === 0) {
      return NextResponse.json([], { status: 200 });
    }
    return NextResponse.json(videos);
  } catch {
    return NextResponse.json(
      { error: "failed to fetch videos" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body: IVideo = await request.json();

    if (
      !body.title ||
      !body.description ||
      !body.thumbnailUrl ||
      !body.videoUrl
    ) {
      return NextResponse.json(
        { error: "missing required field" },
        { status: 400 },
      );
    }

    const videoData = {
      ...body,
      controls: body?.controls ?? true,
      transformation: {
        width: 1920,
        height: 1080,
        quality: body.transformation?.quality ?? 100,
      },
    };

    const newVideo = await Video.create(videoData);
    return NextResponse.json(newVideo);
  } catch {
    return NextResponse.json(
      { error: "failed to create video" },
      { status: 500 },
    ); 
  }
}
