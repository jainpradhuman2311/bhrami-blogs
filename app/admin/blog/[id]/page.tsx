"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import RichTextEditor from "@/components/RichTextEditor";
import { BlogPost } from "@/lib/blog-loader";

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const blogId = params.id as string;
  const isNew = blogId === "new";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [blog, setBlog] = useState<Partial<BlogPost>>({
    id: "",
    title: "",
    excerpt: "",
    content: "",
    author: "",
    date: new Date().toISOString().split("T")[0],
    category: "",
    image: "",
    readTime: 5,
  });

  useEffect(() => {
    if (!isNew) {
      // Load existing blog
      fetch(`/api/blogs/${blogId}`)
        .then((res) => res.json())
        .then((data) => {
          setBlog(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error loading blog:", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [blogId, isNew]);

  const handleSave = async () => {
    if (!blog.title || !blog.content) {
      alert("Please fill in title and content");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/admin/blog", {
        method: isNew ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...blog,
          id: isNew ? blog.id || Date.now().toString() : blogId,
        }),
      });

      if (response.ok) {
        const savedBlog = await response.json();
        router.push(`/blog/${savedBlog.id}`);
        router.refresh();
      } else {
        const error = await response.json();
        alert(`Error saving blog: ${error.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error saving blog:", error);
      alert("Error saving blog. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white mb-4"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold">
            {isNew ? "Create New Blog Post" : "Edit Blog Post"}
          </h1>
        </div>

        <div className="space-y-6">
          {/* ID Field (only for new posts) */}
          {isNew && (
            <div>
              <label className="block text-sm font-medium mb-2">Blog ID</label>
              <input
                type="text"
                value={blog.id || ""}
                onChange={(e) => setBlog({ ...blog, id: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 3, my-blog-post"
              />
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input
              type="text"
              value={blog.title || ""}
              onChange={(e) => setBlog({ ...blog, title: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Blog post title"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium mb-2">Excerpt</label>
            <textarea
              value={blog.excerpt || ""}
              onChange={(e) => setBlog({ ...blog, excerpt: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Short description"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium mb-2">Content *</label>
            <RichTextEditor
              value={blog.content || ""}
              onChange={(content) => setBlog({ ...blog, content })}
              placeholder="Write your blog content here. You can paste from Google Docs and formatting will be preserved!"
            />
            <p className="mt-2 text-sm text-gray-400">
              Tip: Copy text from Google Docs and paste it here. Bold, italic,
              headings, and lists will be preserved automatically.
            </p>
          </div>

          {/* Author */}
          <div>
            <label className="block text-sm font-medium mb-2">Author</label>
            <input
              type="text"
              value={blog.author || ""}
              onChange={(e) => setBlog({ ...blog, author: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Author name"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              value={blog.date || ""}
              onChange={(e) => setBlog({ ...blog, date: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <input
              type="text"
              value={blog.category || ""}
              onChange={(e) => setBlog({ ...blog, category: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Category name"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium mb-2">Image URL</label>
            <input
              type="url"
              value={blog.image || ""}
              onChange={(e) => setBlog({ ...blog, image: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          {/* Read Time */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Read Time (minutes)
            </label>
            <input
              type="number"
              value={blog.readTime || 5}
              onChange={(e) =>
                setBlog({ ...blog, readTime: parseInt(e.target.value) || 5 })
              }
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
            />
          </div>

          {/* Source URL (Optional) */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Source URL (Optional)
            </label>
            <input
              type="url"
              value={blog.sourceUrl || ""}
              onChange={(e) =>
                setBlog({ ...blog, sourceUrl: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://..."
            />
          </div>

          {/* Save Button */}
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Blog Post"}
            </button>
            <button
              onClick={() => router.back()}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

