"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { BlogPost } from "@/lib/blog-data";
import ExpandableCards from "./ExpandableCards";
import { GlowingBorder } from "./ui/glowing-border";

interface BentoGridProps {
  posts: BlogPost[];
}

const categories = [
  { name: "धर्म", icon: "🕉️", gradient: "from-gray-700/30 to-gray-800/30" },
  { name: "जीवन कथा", icon: "📖", gradient: "from-gray-600/30 to-gray-700/30" },
  { name: "पूजा", icon: "🪔", gradient: "from-gray-800/30 to-gray-900/30" },
  { name: "भजन", icon: "🎵", gradient: "from-gray-700/30 to-gray-600/30" },
  { name: "त्योहार", icon: "🎉", gradient: "from-gray-600/30 to-gray-800/30" },
  { name: "आहार", icon: "🥗", gradient: "from-gray-800/30 to-gray-700/30" },
  { name: "दर्शन", icon: "🧘", gradient: "from-gray-700/30 to-gray-900/30" },
  { name: "मंदिर", icon: "🛕", gradient: "from-gray-600/30 to-gray-900/30" },
  { name: "साधु जीवन", icon: "👳", gradient: "from-gray-800/30 to-gray-600/30" },
];

export default function BentoGrid({ posts }: BentoGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const getCategoryPosts = (category: string) => {
    return posts.filter((post) => post.category === category);
  };

  if (selectedCategory) {
    return (
      <ExpandableCards
        posts={getCategoryPosts(selectedCategory)}
        category={selectedCategory}
        onBack={() => setSelectedCategory(null)}
      />
    );
  }

  return (
    <section id="categories" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            श्रेणियां देखें
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            विषय के अनुसार लेख ब्राउज़ करें। संबंधित लेख देखने के लिए श्रेणी पर क्लिक करें।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const categoryPosts = getCategoryPosts(category.name);
            if (categoryPosts.length === 0) return null;

            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => setSelectedCategory(category.name)}
                className="cursor-pointer"
              >
                <GlowingBorder
                  className="h-[280px] rounded-[2.5rem] overflow-hidden"
                  size={300}
                  borderWidth={2}
                  borderColor="#ffffff"
                  glowColor="#ffffff"
                >
                  <div className="relative h-full bg-white/5 backdrop-blur-xl border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300">
                    {/* Glass reflection effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Subtle pattern overlay */}
                    <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,rgb(255,255,255)_1px,transparent_0)] [background-size:20px_20px]" />

                    <div className="relative h-full flex flex-col justify-between p-8 z-10 group">
                      <div>
                        <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                          {category.icon}
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-gray-100 transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-gray-400 text-sm font-medium">
                          {categoryPosts.length}{" "}
                          {categoryPosts.length === 1 ? "लेख" : "लेख"}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 text-white/90 group-hover:text-white group-hover:translate-x-2 transition-all duration-300 text-sm font-semibold">
                        <span>देखें</span>
                        <svg
                          className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </GlowingBorder>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

