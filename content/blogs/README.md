# Blog Posts Directory

This directory contains individual JSON files for each blog post. Each file should be named `{id}.json` where `{id}` is the unique identifier for the blog post.

## File Structure

Each blog post JSON file should follow this structure:

```json
{
  "id": "unique-id",
  "title": "Blog Title",
  "excerpt": "Short description of the blog post",
  "content": "Full content in markdown format",
  "author": "Author Name",
  "date": "YYYY-MM-DD",
  "category": "Category Name",
  "image": "Image URL",
  "readTime": 5,
  "sourceUrl": "Optional source URL"
}
```

## Required Fields

- `id`: Unique identifier (string)
- `title`: Blog post title (string)
- `excerpt`: Short description/excerpt (string)
- `content`: Full blog content in markdown format (string)
- `author`: Author name (string)
- `date`: Publication date in YYYY-MM-DD format (string)
- `category`: Category name (string)
- `image`: Image URL (string)
- `readTime`: Estimated reading time in minutes (number)

## Optional Fields

- `sourceUrl`: Source URL if content is from another source (string)

## Adding New Blog Posts

1. Create a new JSON file in this directory
2. Name it `{id}.json` where `{id}` is a unique identifier
3. Fill in all required fields
4. The blog will automatically appear on the website

## Example

See `1.json` and `2.json` for example blog post structures.

## Performance

- Blog posts are cached for 5 minutes for optimal performance
- All blogs are loaded automatically on build time for static generation
- Individual blog files are only read when needed

