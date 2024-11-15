# Blogmos v2 🚀
[![Next.js](https://img.shields.io/badge/Built%20with-Next.js%2013-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/Typed-TypeScript-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styled%20with-Tailwind-38B2AC)](https://tailwindcss.com/)
[![Admin Panel](https://img.shields.io/badge/Features-Admin%20Panel-orange)](https://github.com/Darkx-dev/blogmos)

A modern, performant blogging platform with a powerful admin panel. Built for content creators who demand control and readers who deserve quality.

## ✨ Key Features

### For Readers
- 📱 Responsive, modern interface
- 🔍 Advanced search and filtering
- 🏷️ Category-based navigation
- 💌 Newsletter subscription
- 🌓 Dark/Light theme support

### For Admins
- 🎛️ Comprehensive Admin Dashboard
- ✍️ Rich Text Editor for posts
- 📊 Analytics and insights
- 👥 User management
- 📱 Mobile-friendly admin interface

## 🛠️ Tech Stack

- **Framework**: Next.js 13 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB
- **Authentication**: NextAuth.js
- **State Management**: React Context/Zustand
- **Deployment**: Vercel

## 🆕 What's New in v2

- 🏃‍♂️ Enhanced performance with Next.js 13
- 🎨 Redesigned UI/UX
- 📱 Improved mobile responsiveness
- 🔒 Enhanced security features
- 🎛️ Expanded admin capabilities
- 📊 Advanced analytics dashboard
- 🔍 Improved SEO optimization

## 💡 Core Functionalities

### Admin Panel
```typescript
features: {
  posts: {
    create: "Rich text editor with image upload",
    edit: "Real-time preview and drafts",
    delete: "Soft delete with recovery option",
    schedule: "Post scheduling capability"
  },
  management: {
    analytics: "Traffic and engagement metrics",
    users: "Subscriber management",
    categories: "Dynamic category creation"
  }
}
```

### Blog Features
```typescript
reader: {
  experience: {
    search: "Advanced filtering",
    categories: "Easy navigation",
    subscribe: "Newsletter integration",
    share: "Social media sharing"
  },
  performance: {
    loading: "Fast page loads",
    images: "Optimized media",
    responsive: "All device support"
  }
}
```

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/Darkx-dev/Blogmos-V2.git

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

## 📝 Environment Setup
```env
DATABASE_URL=your_database_url
NEXTAUTH_SECRET=your_secret
NEXT_PUBLIC_API_URL=your_api_url
```

## 🤝 Contributing

While Blogmos is primarily admin-controlled, we welcome contributions for:
- Bug fixes
- Performance improvements
- Feature suggestions
- Documentation improvements

## 📜 License

MIT License - feel free to use this project as inspiration for your own blogging platform!

## 🔗 Links

- [Demo](https://blogmos-v2.vercel.app)

---

<div align="center">
  Built with ❤️ by <a href="https://github.com/Darkx-dev">Darkx-dev</a>
</div>
