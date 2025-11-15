"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/lib/blog-data";

interface RelatedPostsProps {
  currentPost: BlogPost;
  allPosts: BlogPost[];
}

export default function RelatedPosts({ currentPost, allPosts }: RelatedPostsProps) {
  const relatedPosts = allPosts
    .filter((post) => post.category === currentPost.category && post.id !== currentPost.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  if (relatedPosts.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 sm:mb-8">
          संबंधित लेख
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {relatedPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/blog/${post.id}`}>
                <div className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl sm:rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300 h-full flex flex-col">
                  <div className="relative h-40 sm:h-48 overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 sm:p-6 flex-1 flex flex-col">
                    <span className="text-xs text-gray-400 mb-2 uppercase tracking-wider">
                      {post.category}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-gray-300 transition-colors leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3 sm:mb-4 line-clamp-2 flex-1">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{post.readTime} मिनट पढ़ना</span>
                      <span>{new Date(post.date).toLocaleDateString('hi-IN')}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

