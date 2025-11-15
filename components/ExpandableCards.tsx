"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ArrowLeft, Search as SearchIcon, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { BlogPost } from "@/lib/blog-data";
import { cn } from "@/lib/utils";

interface ExpandableCardsProps {
  posts: BlogPost[];
  category: string;
  onBack: () => void;
}

const ITEMS_PER_PAGE = 6;

export default function ExpandableCards({
  posts,
  category,
  onBack,
}: ExpandableCardsProps) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [translatedQuery, setTranslatedQuery] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const translateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Function to detect if text is primarily English
  const isEnglish = (text: string): boolean => {
    const englishPattern = /^[a-zA-Z0-9\s.,!?'"()-]+$/;
    const hindiPattern = /[\u0900-\u097F]/;
    
    if (hindiPattern.test(text)) {
      return false;
    }
    
    return englishPattern.test(text.trim());
  };

  // Translate English to Hindi
  useEffect(() => {
    // Clear previous timeout
    if (translateTimeoutRef.current) {
      clearTimeout(translateTimeoutRef.current);
    }

    if (searchQuery.trim() === "") {
      setTranslatedQuery("");
      setIsTranslating(false);
      return;
    }

    const trimmedQuery = searchQuery.trim();
    
    // If query is English, translate it
    if (isEnglish(trimmedQuery)) {
      setIsTranslating(true);
      
      // Debounce translation API call
      translateTimeoutRef.current = setTimeout(async () => {
        try {
          const response = await fetch('/api/translate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: trimmedQuery }),
          });

          if (response.ok) {
            const data = await response.json();
            let translated = data.translated || trimmedQuery;
            
            // If Google Translate returned the same word (partial word), use our mapping
            if (translated === trimmedQuery) {
              const partialWordMap: { [key: string]: string } = {
                'mahav': 'महावीर',
                'jain': 'जैन',
                'dharm': 'धर्म',
                'bhag': 'भगवान',
                'swam': 'स्वामी',
              };
              
              const lowerQuery = trimmedQuery.toLowerCase();
              for (const [partial, fullHindi] of Object.entries(partialWordMap)) {
                if (lowerQuery.includes(partial)) {
                  translated = fullHindi;
                  break;
                }
              }
            }
            
            setTranslatedQuery(translated);
          } else {
            // Fallback: try to handle common partial words
            const partialWordMap: { [key: string]: string } = {
              'mahav': 'महावीर',
              'jain': 'जैन',
              'dharm': 'धर्म',
              'bhag': 'भगवान',
              'swam': 'स्वामी',
            };
            
            const lowerQuery = trimmedQuery.toLowerCase();
            let translated = trimmedQuery;
            for (const [partial, fullHindi] of Object.entries(partialWordMap)) {
              if (lowerQuery.includes(partial)) {
                translated = fullHindi;
                break;
              }
            }
            setTranslatedQuery(translated);
          }
        } catch (error) {
          console.error('Translation error:', error);
          // Fallback: try to handle common partial words
          const partialWordMap: { [key: string]: string } = {
            'mahav': 'महावीर',
            'jain': 'जैन',
            'dharm': 'धर्म',
            'bhag': 'भगवान',
            'swam': 'स्वामी',
          };
          
          const lowerQuery = trimmedQuery.toLowerCase();
          let translated = trimmedQuery;
          for (const [partial, fullHindi] of Object.entries(partialWordMap)) {
            if (lowerQuery.includes(partial)) {
              translated = fullHindi;
              break;
            }
          }
          setTranslatedQuery(translated);
        } finally {
          setIsTranslating(false);
        }
      }, 300); // 300ms debounce
    } else {
      // Query is already in Hindi or mixed
      setTranslatedQuery(trimmedQuery);
      setIsTranslating(false);
    }

    return () => {
      if (translateTimeoutRef.current) {
        clearTimeout(translateTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Filter posts based on translated query
  const filteredPosts = useMemo(() => {
    if (!translatedQuery.trim()) {
      return posts;
    }

    const query = translatedQuery.toLowerCase().trim();
    const originalQuery = searchQuery.toLowerCase().trim();
    
    // Search with both translated and original query
    return posts.filter((post) => {
      const titleMatch = 
        post.title.toLowerCase().includes(query) ||
        post.title.toLowerCase().includes(originalQuery);
      const excerptMatch = 
        post.excerpt.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(originalQuery);
      const contentMatch = 
        post.content.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(originalQuery);
      
      return titleMatch || excerptMatch || contentMatch;
    });
  }, [posts, translatedQuery, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  return (
    <section className="py-24 bg-black min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>श्रेणियों पर वापस जाएं</span>
        </button>

        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">
            {category}
          </h2>
          <p className="text-lg text-gray-400 mb-6">
            पूर्वावलोकन देखने के लिए पूर्वावलोकन बटन पर क्लिक करें। पूरा लेख देखने के लिए पढ़ें बटन का उपयोग करें।
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="इस श्रेणी में खोजें... (Search in English or Hindi)"
                className="w-full pl-12 pr-12 py-3 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all"
              />
              {isTranslating && (
                <Loader2 className="absolute right-12 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
              )}
              {searchQuery && !isTranslating && (
                <button
                  onClick={() => handleSearchChange("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {searchQuery && (
              <div className="mt-2 flex items-center justify-center gap-2">
                <p className="text-sm text-gray-500">
                  {filteredPosts.length} {filteredPosts.length === 1 ? "परिणाम मिला" : "परिणाम मिले"}
                </p>
                {translatedQuery && translatedQuery !== searchQuery && (
                  <span className="text-xs text-gray-600">
                    • "{searchQuery}" → "{translatedQuery}"
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Posts List */}
        {paginatedPosts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg mb-2">कोई लेख नहीं मिला</p>
            <p className="text-gray-500 text-sm">
              {searchQuery ? (
                <>
                  "{translatedQuery || searchQuery}" के लिए कोई परिणाम नहीं मिला
                  {translatedQuery && translatedQuery !== searchQuery && (
                    <span className="block mt-1 text-xs text-gray-600">
                      (खोजा गया: "{translatedQuery}" from "{searchQuery}")
                    </span>
                  )}
                </>
              ) : (
                "इस श्रेणी में अभी कोई लेख नहीं है"
              )}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-8">
              {paginatedPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="relative"
                >
                  <motion.div
                    className="relative overflow-hidden rounded-2xl transition-all duration-300 bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-white/20 hover:shadow-lg"
                  >
                    <div className="flex items-center gap-4 px-6 py-4">
                      <div className="relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border border-white/10">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-white mb-1 truncate">
                          {post.title}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {new Date(post.date).toLocaleDateString('hi-IN')} • {post.readTime} मिनट पढ़ना
                        </p>
                      </div>

                      <div className="ml-auto flex items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPost(post);
                          }}
                          className="inline-flex items-center gap-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                        >
                          पूर्वावलोकन
                        </button>
                        <Link
                          href={`/blog/${post.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="hidden sm:inline-flex items-center gap-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                        >
                          पढ़ें
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={cn(
                    "flex items-center gap-1 px-4 py-2 rounded-full border transition-all",
                    currentPage === 1
                      ? "border-white/5 text-gray-500 cursor-not-allowed bg-white/5"
                      : "border-white/10 text-gray-300 hover:border-white/20 hover:text-white hover:bg-white/10"
                  )}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="text-sm font-medium">पिछला</span>
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={cn(
                            "w-10 h-10 rounded-full text-sm font-medium transition-all",
                            currentPage === page
                              ? "bg-white text-black"
                              : "bg-white/5 backdrop-blur-xl text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"
                          )}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return (
                        <span key={page} className="text-gray-600">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className={cn(
                    "flex items-center gap-1 px-4 py-2 rounded-full border transition-all",
                    currentPage === totalPages
                      ? "border-white/5 text-gray-500 cursor-not-allowed bg-white/5"
                      : "border-white/10 text-gray-300 hover:border-white/20 hover:text-white hover:bg-white/10"
                  )}
                >
                  <span className="text-sm font-medium">अगला</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => {
              setSelectedPost(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10"
            >
              <button
                onClick={() => {
                  setSelectedPost(null);
                }}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center text-white hover:bg-white/20 transition-colors border border-white/20"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative h-64">
                <Image
                  src={selectedPost.image}
                  alt={selectedPost.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              </div>

              <div className="p-8">
                <div className="mb-4">
                  <span className="px-3 py-1 bg-white/10 backdrop-blur-xl text-white text-sm font-semibold rounded-full border border-white/20">
                    {selectedPost.category}
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  {selectedPost.title}
                </h2>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {selectedPost.excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
                  <span>{selectedPost.author}</span>
                  <span>•</span>
                  <span>{new Date(selectedPost.date).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{selectedPost.readTime} मिनट पढ़ना</span>
                </div>
                <Link
                  href={`/blog/${selectedPost.id}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-100 transition-colors"
                >
                  पूरा लेख पढ़ें
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
