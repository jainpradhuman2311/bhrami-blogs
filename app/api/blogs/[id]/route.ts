import { NextRequest, NextResponse } from "next/server";
import { getBlogById } from "@/lib/blog-loader";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const blog = await getBlogById(id);

    if (!blog) {
      return NextResponse.json(
        { message: "Blog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(blog);
  } catch (error: any) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { message: error.message || "Error fetching blog" },
      { status: 500 }
    );
  }
}

