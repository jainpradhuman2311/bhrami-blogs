import { getAllBlogs, getBlogById, getBlogsByCategory, searchBlogs, getAllCategories, getFeaturedBlogs, BlogPost } from "./blog-loader";

// Re-export everything for backward compatibility
export type { BlogPost };
export { getAllBlogs, getBlogById, getBlogsByCategory, searchBlogs, getAllCategories, getFeaturedBlogs };
