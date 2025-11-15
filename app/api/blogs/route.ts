import { NextResponse } from "next/server";
import { getAllBlogs, searchBlogs, getFeaturedBlogs } from "@/lib/blog-loader";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const limit = searchParams.get("limit");
  const featured = searchParams.get("featured");

  try {
    // Return featured blogs if requested
    if (featured === "true") {
      const featuredBlogs = await getFeaturedBlogs();
      const limitedResults = limit ? featuredBlogs.slice(0, parseInt(limit)) : featuredBlogs;
      return NextResponse.json(limitedResults);
    }

    if (query) {
      const results = await searchBlogs(query);
      const limitedResults = limit ? results.slice(0, parseInt(limit)) : results;
      return NextResponse.json(limitedResults);
    } else {
      const blogs = await getAllBlogs();
      const limitedBlogs = limit ? blogs.slice(0, parseInt(limit)) : blogs;
      return NextResponse.json(limitedBlogs);
    }
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

