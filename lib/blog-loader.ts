import fs from "fs";
import path from "path";

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
  readTime: number;
  sourceUrl?: string;
}

const BLOGS_DIR = path.join(process.cwd(), "content", "blogs");
const FEATURED_FILE = path.join(process.cwd(), "content", "featured.json");
const CACHE_KEY = "blog-posts-cache";
let blogCache: BlogPost[] | null = null;
let featuredCache: BlogPost[] | null = null;
let cacheTimestamp: number = 0;
// In development, disable cache (0) for immediate updates. In production, use 5 minutes cache
const CACHE_DURATION = 0;

/**
 * Get all blog posts with caching for performance
 */
export async function getAllBlogs(): Promise<BlogPost[]> {
  const now = Date.now();
  
  // Check cache validity (disabled in development for immediate updates)
  if (CACHE_DURATION > 0 && blogCache && now - cacheTimestamp < CACHE_DURATION) {
    return blogCache;
  }

  // Ensure blogs directory exists
  if (!fs.existsSync(BLOGS_DIR)) {
    console.warn(`Blogs directory not found: ${BLOGS_DIR}`);
    return [];
  }

  try {
    const files = fs.readdirSync(BLOGS_DIR);
    const blogs: BlogPost[] = [];

    for (const file of files) {
      if (!file.endsWith(".json")) continue;

      try {
        const filePath = path.join(BLOGS_DIR, file);
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const blog: BlogPost = JSON.parse(fileContent);
        
        // Validate blog structure
        if (validateBlogPost(blog)) {
          blogs.push(blog);
        } else {
          console.warn(`Invalid blog post structure in ${file}`);
        }
      } catch (error) {
        console.error(`Error reading blog file ${file}:`, error);
      }
    }

    // Sort by date (newest first)
    blogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Update cache
    blogCache = blogs;
    cacheTimestamp = now;

    return blogs;
  } catch (error) {
    console.error("Error loading blogs:", error);
    return [];
  }
}

/**
 * Get a single blog post by ID
 */
export async function getBlogById(id: string): Promise<BlogPost | null> {
  const blogs = await getAllBlogs();
  return blogs.find((blog) => blog.id === id) || null;
}

/**
 * Get blogs by category
 */
export async function getBlogsByCategory(category: string): Promise<BlogPost[]> {
  const blogs = await getAllBlogs();
  return blogs.filter((blog) => blog.category === category);
}

/**
 * Search blogs by query
 */
export async function searchBlogs(query: string): Promise<BlogPost[]> {
  const blogs = await getAllBlogs();
  const lowerQuery = query.toLowerCase();
  
  return blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(lowerQuery) ||
      blog.excerpt.toLowerCase().includes(lowerQuery) ||
      blog.content.toLowerCase().includes(lowerQuery) ||
      blog.category.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get all unique categories
 */
export async function getAllCategories(): Promise<string[]> {
  const blogs = await getAllBlogs();
  const categories = new Set(blogs.map((blog) => blog.category));
  return Array.from(categories).sort();
}

/**
 * Validate blog post structure
 */
function validateBlogPost(blog: any): blog is BlogPost {
  return (
    typeof blog === "object" &&
    typeof blog.id === "string" &&
    typeof blog.title === "string" &&
    typeof blog.excerpt === "string" &&
    typeof blog.content === "string" &&
    typeof blog.author === "string" &&
    typeof blog.date === "string" &&
    typeof blog.category === "string" &&
    typeof blog.image === "string" &&
    typeof blog.readTime === "number" &&
    blog.title.length > 0 &&
    blog.content.length > 0
  );
}

/**
 * Clear the blog cache (useful for development)
 */
export function clearBlogCache(): void {
  blogCache = null;
  featuredCache = null;
  cacheTimestamp = 0;
}

/**
 * Get blog count
 */
export async function getBlogCount(): Promise<number> {
  const blogs = await getAllBlogs();
  return blogs.length;
}

/**
 * Get featured blog posts
 * Reads from content/featured.json file which contains an array of blog IDs
 */
export async function getFeaturedBlogs(): Promise<BlogPost[]> {
  // Check cache validity
  const now = Date.now();
  if (featuredCache && blogCache && now - cacheTimestamp < CACHE_DURATION) {
    return featuredCache;
  }

  try {
    // Read featured IDs from file
    let featuredIds: string[] = [];
    
    if (fs.existsSync(FEATURED_FILE)) {
      const featuredContent = fs.readFileSync(FEATURED_FILE, "utf-8");
      const featuredData = JSON.parse(featuredContent);
      featuredIds = featuredData.featuredIds || [];
    } else {
      // If featured.json doesn't exist, return empty array
      console.warn(`Featured file not found: ${FEATURED_FILE}`);
      return [];
    }

    // Get all blogs
    const allBlogs = await getAllBlogs();
    
    // Filter blogs by featured IDs, maintaining the order from featured.json
    const featuredBlogs: BlogPost[] = [];
    
    for (const id of featuredIds) {
      const blog = allBlogs.find((b) => b.id === id);
      if (blog) {
        featuredBlogs.push(blog);
      } else {
        console.warn(`Featured blog with ID "${id}" not found`);
      }
    }

    // Update cache
    featuredCache = featuredBlogs;
    
    return featuredBlogs;
  } catch (error) {
    console.error("Error loading featured blogs:", error);
    return [];
  }
}

