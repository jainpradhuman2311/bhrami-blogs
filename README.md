# Bhrami Blog

A modern, beautiful blog website built with Next.js 16, TypeScript, Tailwind CSS, and Aceternity UI-inspired components.

## Features

- 🎨 **Modern Block Theme UI** - Beautiful, responsive design with block-based layouts
- 🚀 **Hero Section** - Animated hero section with gradient backgrounds and smooth animations
- 📝 **Blog Cards** - Elegant blog card components with hover effects
- 📄 **Blog Detail Pages** - Dynamic routing for individual blog posts
- 🌙 **Dark Mode Support** - Automatic dark mode based on system preferences
- ✨ **Animations** - Smooth animations powered by Framer Motion
- 📱 **Responsive Design** - Fully responsive across all devices

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
bhrami-blogs/
├── app/
│   ├── blog/
│   │   └── [id]/
│   │       └── page.tsx      # Dynamic blog detail page
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page with hero and blog listing
│   ├── not-found.tsx          # 404 page
│   └── globals.css            # Global styles
├── components/
│   ├── Spotlight.tsx          # Hero section with spotlight effect
│   ├── AppleCardsCarousel.tsx # Featured blogs carousel
│   ├── BentoGrid.tsx         # Category grid component
│   └── ...                    # Other components
├── content/
│   ├── blogs/                # Individual blog JSON files
│   │   ├── 1.json
│   │   ├── 2.json
│   │   └── template.json
│   └── featured.json          # Featured blog IDs
├── lib/
│   ├── blog-loader.ts         # Blog loading system
│   ├── blog-data.ts           # Blog API exports
│   └── utils.ts               # Utility functions
└── public/                    # Static assets
```

## Customization

### Adding New Blog Posts

1. Create a new JSON file in `content/blogs/` directory
2. Name it `{id}.json` where `{id}` is a unique identifier
3. Use `content/blogs/template.json` as a reference
4. Fill in all required fields (id, title, excerpt, content, author, date, category, image, readTime)
5. The blog will automatically appear on the website

For detailed documentation, see `BLOG_SYSTEM.md`

### Featured Blogs

Edit `content/featured.json` to control which blogs appear in the featured carousel. Simply add or remove blog IDs from the `featuredIds` array.

### Styling

The project uses Tailwind CSS v4. Customize colors and styles in `app/globals.css` or by modifying Tailwind classes directly in components.

## License

MIT
