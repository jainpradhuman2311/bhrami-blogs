"use client";

import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import { BlogPost } from "@/lib/blog-data";

interface AppleCardsCarouselWrapperProps {
  posts: BlogPost[];
}

export default function AppleCardsCarouselWrapper({
  posts,
}: AppleCardsCarouselWrapperProps) {
  const featuredPosts = posts.slice(0, 5);

  const cards = featuredPosts.map((card, index) => (
    <Card key={card.id} card={card} index={index} layout={true} />
  ));

  return (
    <section id="featured-blogs" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-white mb-16 font-sans">
          जैन धर्म की शिक्षाओं को जानें।
        </h2>
        <div className="w-full h-full">
          <Carousel items={cards} />
        </div>
      </div>
    </section>
  );
}

