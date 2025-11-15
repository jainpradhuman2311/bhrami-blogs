"use client";

import { useState, useEffect, useRef } from "react";
import { Search as SearchIcon, X, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { blogPosts, BlogPost } from "@/lib/blog-data";
import { cn } from "@/lib/utils";

export default function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [translatedQuery, setTranslatedQuery] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [results, setResults] = useState<BlogPost[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const translateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setQuery("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      inputRef.current?.focus();
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

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

    if (query.trim() === "") {
      setTranslatedQuery("");
      setResults([]);
      setIsTranslating(false);
      return;
    }

    const trimmedQuery = query.trim();
    
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
            
            // Log for debugging
            if (translated !== trimmedQuery) {
              console.log(`Translated: "${trimmedQuery}" → "${translated}"`);
            }
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
  }, [query]);

  // Perform search with translated query
  useEffect(() => {
    if (!translatedQuery.trim()) {
      setResults([]);
      return;
    }

    const searchTerm = translatedQuery.toLowerCase().trim();
    const originalTerm = query.toLowerCase().trim();
    
    // Search with both translated and original query
    const filtered = blogPosts.filter((post) => {
      const titleMatch = 
        post.title.toLowerCase().includes(searchTerm) ||
        post.title.toLowerCase().includes(originalTerm);
      const excerptMatch = 
        post.excerpt.toLowerCase().includes(searchTerm) ||
        post.excerpt.toLowerCase().includes(originalTerm);
      const contentMatch = 
        post.content.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(originalTerm);
      const categoryMatch = 
        post.category.toLowerCase().includes(searchTerm) ||
        post.category.toLowerCase().includes(originalTerm);
      
      return titleMatch || excerptMatch || contentMatch || categoryMatch;
    });

    setResults(filtered);
  }, [translatedQuery, query]);

  const handleSearchClick = () => {
    setIsOpen(true);
  };

  const handleResultClick = () => {
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div ref={searchRef} className="relative">
      {/* Search Button/Input */}
      <div className="relative">
        {!isOpen ? (
          <button
            onClick={handleSearchClick}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all"
            aria-label="Search"
          >
            <SearchIcon className="w-4 h-4" />
            <span className="hidden sm:inline text-sm">खोजें</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            <SearchIcon className="w-4 h-4 text-white flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="खोजें... (Search in English or Hindi)"
              className="bg-transparent border-none outline-none text-white placeholder-gray-400 text-sm w-48 sm:w-64"
            />
            {isTranslating && (
              <Loader2 className="w-4 h-4 text-white animate-spin flex-shrink-0" />
            )}
            {query && !isTranslating && (
              <button
                onClick={() => {
                  setQuery("");
                  setTranslatedQuery("");
                  inputRef.current?.focus();
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-[90vw] sm:w-[500px] max-h-[60vh] overflow-y-auto bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl z-50">
          {query.trim() === "" ? (
            <div className="p-8 text-center text-gray-400">
              <SearchIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">खोज शुरू करने के लिए टाइप करें</p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <p className="text-sm">कोई परिणाम नहीं मिला</p>
              <p className="text-xs mt-1 text-gray-500">
                "{translatedQuery || query}" के लिए कोई लेख नहीं मिला
              </p>
              {translatedQuery && translatedQuery !== query && (
                <p className="text-xs mt-2 text-gray-600">
                  खोजा गया: "{translatedQuery}" (from "{query}")
                </p>
              )}
            </div>
          ) : (
            <div className="p-2">
              <div className="px-4 py-2 text-xs text-gray-400 border-b border-gray-700 flex items-center justify-between">
                <span>
                  {results.length} {results.length === 1 ? "परिणाम मिला" : "परिणाम मिले"}
                </span>
                {translatedQuery && translatedQuery !== query && (
                  <span className="text-gray-500 text-[10px]">
                    "{query}" → "{translatedQuery}"
                  </span>
                )}
              </div>
              <div className="divide-y divide-gray-700">
                {results.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.id}`}
                    onClick={handleResultClick}
                    className="block p-4 hover:bg-gray-800 transition-colors group"
                  >
                    <div className="flex gap-4">
                      <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-300 border border-gray-600">
                            {post.category}
                          </span>
                          <span className="text-xs text-gray-500">
                            {post.readTime} मिनट
                          </span>
                        </div>
                        <h3 className="text-sm font-semibold text-white mb-1 line-clamp-1 group-hover:text-gray-300 transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-xs text-gray-400 line-clamp-2">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

