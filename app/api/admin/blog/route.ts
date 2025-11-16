import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { BlogPost } from "@/lib/blog-loader";

const BLOGS_DIR = path.join(process.cwd(), "content", "blogs");

export async function POST(request: NextRequest) {
  try {
    const blog: BlogPost = await request.json();

    // Validate required fields
    if (!blog.id || !blog.title || !blog.content) {
      return NextResponse.json(
        { message: "Missing required fields: id, title, content" },
        { status: 400 }
      );
    }

    // Ensure blogs directory exists
    if (!fs.existsSync(BLOGS_DIR)) {
      fs.mkdirSync(BLOGS_DIR, { recursive: true });
    }

    // Check if blog already exists
    const filePath = path.join(BLOGS_DIR, `${blog.id}.json`);
    if (fs.existsSync(filePath)) {
      return NextResponse.json(
        { message: `Blog with id "${blog.id}" already exists` },
        { status: 409 }
      );
    }

    // Write blog file
    fs.writeFileSync(filePath, JSON.stringify(blog, null, 2), "utf-8");

    return NextResponse.json(blog, { status: 201 });
  } catch (error: any) {
    console.error("Error creating blog:", error);
    return NextResponse.json(
      { message: error.message || "Error creating blog" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const blog: BlogPost = await request.json();

    // Validate required fields
    if (!blog.id || !blog.title || !blog.content) {
      return NextResponse.json(
        { message: "Missing required fields: id, title, content" },
        { status: 400 }
      );
    }

    // Ensure blogs directory exists
    if (!fs.existsSync(BLOGS_DIR)) {
      fs.mkdirSync(BLOGS_DIR, { recursive: true });
    }

    // Check if blog exists
    const filePath = path.join(BLOGS_DIR, `${blog.id}.json`);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { message: `Blog with id "${blog.id}" not found` },
        { status: 404 }
      );
    }

    // Write blog file
    fs.writeFileSync(filePath, JSON.stringify(blog, null, 2), "utf-8");

    return NextResponse.json(blog);
  } catch (error: any) {
    console.error("Error updating blog:", error);
    return NextResponse.json(
      { message: error.message || "Error updating blog" },
      { status: 500 }
    );
  }
}


