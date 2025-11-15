# Blog System Documentation

## Overview

The blog system has been restructured to support 1000+ blog posts efficiently. Instead of storing all blogs in a single TypeScript file, each blog post is now stored as an individual JSON file in the `content/blogs/` directory.

## Benefits

1. **Scalability**: Easily handle thousands of blog posts without performance issues
2. **Maintainability**: Each blog is a separate file, making it easy to edit, add, or remove posts
3. **Performance**: Built-in caching system (5-minute cache) for optimal performance
4. **Static Generation**: All blogs are loaded at build time for Next.js static generation
5. **Easy Management**: Simple file-based structure - just add/remove JSON files

## File Structure

```
content/
  blogs/
    1.json
    2.json
    3.json
    ...
    template.json (for reference)
    README.md
```

## Adding a New Blog Post

1. Create a new JSON file in `content/blogs/` directory
2. Name it `{id}.json` where `{id}` is a unique identifier (e.g., `100.json`, `my-blog-post.json`)
3. Use `template.json` as a reference for the structure
4. Fill in all required fields
5. The blog will automatically appear on the website (after cache expires or rebuild)

## Blog Post JSON Structure

```json
{
  "id": "unique-id",
  "title": "Blog Title",
  "excerpt": "Short description",
  "content": "Full content in markdown",
  "author": "Author Name",
  "date": "YYYY-MM-DD",
  "category": "Category Name",
  "image": "Image URL",
  "readTime": 5,
  "sourceUrl": "Optional source URL"
}
```

### Required Fields

- `id`: Unique identifier (string)
- `title`: Blog post title (string)
- `excerpt`: Short description/excerpt (string)
- `content`: Full blog content in markdown format (string)
- `author`: Author name (string)
- `date`: Publication date in YYYY-MM-DD format (string)
- `category`: Category name (string)
- `image`: Image URL (string)
- `readTime`: Estimated reading time in minutes (number)

### Optional Fields

- `sourceUrl`: Source URL if content is from another source (string)

## Featured Blogs

Featured blogs are managed through `content/featured.json` file. Simply add or remove blog IDs from the `featuredIds` array to control which blogs appear in the featured carousel on the homepage.

### Example `featured.json`:
```json
{
  "featuredIds": [
    "1",
    "2",
    "5",
    "10"
  ],
  "description": "List of blog post IDs that should be featured..."
}
```

**Important:**
- The order in the array determines the display order
- Only blogs that exist will be shown (invalid IDs are skipped with a warning)
- If no featured blogs are set, the system falls back to showing the first 5 blogs

## API Functions

### `getAllBlogs()`
Returns all blog posts sorted by date (newest first).

```typescript
const blogs = await getAllBlogs();
```

### `getFeaturedBlogs()`
Returns featured blog posts based on IDs in `content/featured.json`.

```typescript
const featured = await getFeaturedBlogs();
```

### `getBlogById(id: string)`
Returns a single blog post by ID.

```typescript
const blog = await getBlogById("1");
```

### `getBlogsByCategory(category: string)`
Returns all blogs in a specific category.

```typescript
const blogs = await getBlogsByCategory("धर्म");
```

### `searchBlogs(query: string)`
Searches blogs by title, excerpt, content, or category.

```typescript
const results = await searchBlogs("जैन");
```

### `getAllCategories()`
Returns all unique categories.

```typescript
const categories = await getAllCategories();
```

## Performance Optimization

1. **Caching**: Blog posts are cached for 5 minutes to reduce file system reads
2. **Static Generation**: All blogs are loaded at build time for Next.js
3. **Lazy Loading**: Individual blog files are only read when needed
4. **Efficient Search**: Search is performed on cached data

## Migration from Old System

If you have blogs in the old `blog-data.ts` format, you can manually convert them:

1. Create a JSON file for each blog in `content/blogs/` directory
2. Name it `{id}.json` where `{id}` matches the blog ID
3. Copy the blog data structure into the JSON file
4. Use `content/blogs/template.json` as a reference

## API Routes

### GET `/api/blogs`
Get all blogs or search blogs.

**Query Parameters:**
- `q`: Search query (optional)
- `limit`: Limit number of results (optional)

**Examples:**
- `/api/blogs` - Get all blogs
- `/api/blogs?q=जैन` - Search for "जैन"
- `/api/blogs?limit=10` - Get first 10 blogs

## Best Practices

1. **Unique IDs**: Use descriptive, unique IDs for each blog post
2. **Consistent Categories**: Use consistent category names across blogs
3. **Valid Dates**: Always use YYYY-MM-DD format for dates
4. **Markdown Content**: Use markdown formatting in content field
5. **Image URLs**: Use reliable image URLs (Unsplash, CDN, etc.)
6. **File Naming**: Use lowercase IDs with hyphens (e.g., `my-blog-post.json`)

## Troubleshooting

### Blogs not appearing?
- Check that the JSON file is valid JSON
- Ensure all required fields are present
- Check file name matches the ID in the JSON
- Clear cache: The cache expires after 5 minutes, or restart the dev server

### Performance issues?
- The system is optimized for 1000+ blogs
- Cache reduces file system reads
- Consider using a CDN for images

### Search not working?
- Ensure the Search component is using the API route
- Check that blogs are properly indexed
- Verify JSON structure is correct

## Example Blog Post

See `content/blogs/1.json` and `content/blogs/2.json` for example blog posts.

## Support

For issues or questions, check:
- `content/blogs/README.md` - Detailed file structure guide
- `lib/blog-loader.ts` - Implementation details
- `lib/blog-data.ts` - Public API exports

