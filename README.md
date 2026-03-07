# 🎼 Ulvin Najafov - Composer Portfolio

A modern, elegant portfolio website for classical composer Ulvin Najafov. Built with React, TypeScript, and Tailwind CSS, featuring an immersive audio player, 3D interactive elements, and a luxurious editorial design aesthetic.

![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite&logoColor=white)

## ✨ Features

- **🎹 Interactive Audio Player** - Full-featured music player with shuffle, repeat, queue management, and fullscreen mode
- **🎨 Editorial Design** - Luxurious, magazine-inspired aesthetic with custom typography and animations
- **🌙 Dark/Light Mode** - Seamless theme switching with system preference detection
- **📱 Fully Responsive** - Optimized for all devices from mobile to desktop
- **🎭 3D Elements** - Interactive 3D piano scene powered by Spline
- **⚡ Fast & Modern** - Built with Vite for lightning-fast development and builds

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/UlikGames/composer-portfolio.git
   cd composer-portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📁 Project Structure

```
composer-portfolio/
├── public/
│   ├── audio/          # Music files
│   ├── images/         # Work thumbnails and assets
│   └── scores/         # PDF scores
├── src/
│   ├── components/
│   │   ├── features/   # Audio player, theme toggle, etc.
│   │   ├── layout/     # Header, Footer, Layout
│   │   ├── pages/      # HomePage, WorksPage, AboutPage, ContactPage
│   │   └── ui/         # Reusable UI components
│   ├── context/        # Audio player context
│   ├── data/           # Works data and content
│   ├── styles/         # Global CSS styles
│   └── utils/          # Utility functions
├── api/                # Serverless functions (Netlify/Vercel)
└── ...config files
```

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Build Tool | Vite |
| Routing | React Router v7 |
| 3D Graphics | Three.js + React Three Fiber |
| Deployment | Netlify / Vercel |

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🎨 Design System

The portfolio uses a custom design system with:

- **Typography**: Playfair Display (serif) + custom sans-serif
- **Colors**: Charcoal, Alabaster, Gold accents, Warm Grey
- **Animations**: Fade-ins, smooth transitions, hover effects
- **Shadows**: Luxury shadow system for depth

## 📧 Contact Form

The contact form uses Resend for email delivery. To configure:

1. Create a `.env.local` file:
   ```
   RESEND_API_KEY=your_api_key_here
   ```

2. The serverless function in `/api/send-email.ts` handles form submissions.

## 🌐 Deployment

### Netlify

The project includes `netlify.toml` configuration. Simply connect your repository to Netlify for automatic deployments.

### Vercel

The project includes `vercel.json` configuration. Connect your repository to Vercel for instant deployments.

## 📄 License

This project is private and not licensed for public use.

---

<p align="center">
  <em>Crafting Timeless Music</em><br>
  <strong>Ulvin Najafov</strong>
</p>
