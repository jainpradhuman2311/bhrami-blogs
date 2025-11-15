import Spotlight from "@/components/Spotlight";
import AppleCardsCarousel from "@/components/AppleCardsCarousel";
import BentoGrid from "@/components/BentoGrid";
import { getAllBlogs, getFeaturedBlogs } from "@/lib/blog-data";

export default async function Home() {
  const blogPosts = await getAllBlogs();
  const featuredPosts = await getFeaturedBlogs();
  
  return (
    <>
      <Spotlight />
      <AppleCardsCarousel posts={featuredPosts.length > 0 ? featuredPosts : blogPosts.slice(0, 5)} />
      <BentoGrid posts={blogPosts} />
    </>
  );
}
