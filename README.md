# GlobalCare Landing Page

A modern, responsive marketing website for GlobalCare, built with React and Vite.

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd globalcare_landingpage
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

### Build

Build the project for production:

```bash
npm run build
```

### Preview

Preview the production build:

```bash
npm run preview
```

## 📂 Project Structure

```
src/
├── components/        # Reusable UI components
├── constants/         # Static data and configuration
├── layouts/           # Page layouts (LandingPageLayouts, etc.)
├── Pages/             # Main page components
│   ├── LandingPage.jsx
│   ├── PackagesPage.jsx
│   ├── Navbar.jsx
│   └── ...
├── service/           # API services (auth, etc.)
├── utils/             # Utility functions
└── App.jsx            # Main application component
```

## 🎨 Design System

### Color Palette

```css
:root {
  --text: #6b6375;
  --text-h: #08060d;
  --bg: #fff;
  --border: #e5e4e7;
  --code-bg: #f4f3ec;
  --accent: #aa3bff;
  --accent-bg: rgba(170, 59, 255, 0.1);
  --accent-border: rgba(170, 59, 255, 0.5);
  --social-bg: rgba(244, 243, 236, 0.5);
  --shadow:
    rgba(0, 0, 0, 0.1) 0 10px 15px -3px,
    rgba(0, 0, 0, 0.05) 0 4px 6px -2px;
}

@media (prefers-color-scheme: dark) {
  :root {
    --text: #9ca3af;
    --text-h: #f3f4f6;
    --bg: #16171d;
    --border: #2e303a;
    --code-bg: #1f2028;
    --accent: #c084fc;
    --accent-bg: rgba(192, 132, 252, 0.15);
    --accent-border: rgba(192, 132, 252, 0.5);
    --social-bg: rgba(47, 48, 58, 0.5);
    --shadow:
      rgba(0, 0, 0, 0.4) 0 10px 15px -3px,
      rgba(0, 0, 0, 0.25) 0 4px 6px -2px;
  }
}
```

### Typography

- **Sans**: `system-ui, 'Segoe UI', Roboto, sans-serif`
- **Heading**: `system-ui, 'Segoe UI', Roboto, sans-serif`
- **Mono**: `ui-monospace, Consolas, monospace`

## 📱 Responsive Design

The website uses a mobile-first approach with responsive breakpoints:

- **Desktop**: 1024px+
- **Tablet**: 768px - 1024px
- **Mobile**: Below 768px

## 🛠️ Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Icons**: React Icons
- **Styling**: CSS variables

## 🚀 Deployment

To deploy the application:

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the contents of the `dist/` folder to your hosting provider (Netlify, Vercel, GitHub Pages, etc.).

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.