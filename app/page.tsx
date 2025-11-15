import Spotlight from "@/components/Spotlight";
import AppleCardsCarousel from "@/components/AppleCardsCarousel";
import BentoGrid from "@/components/BentoGrid";
import { blogPosts } from "@/lib/blog-data";

export default function Home() {
  return (
    <>
      <Spotlight />
      <AppleCardsCarousel posts={blogPosts} />
      <BentoGrid posts={blogPosts} />
    </>
  );
}
