# Setup Instructions

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
foalandpony/
├── app/
│   ├── layout.tsx      # Root layout (metadata, global styles)
│   ├── page.tsx         # Homepage component
│   └── globals.css      # Global styles
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript config
├── next.config.js       # Next.js config
└── .eslintrc.json       # ESLint config
```

## Troubleshooting

### TypeScript Errors
If you see TypeScript errors before installing dependencies:
- Run `npm install` first
- The errors should disappear once dependencies are installed

### Port Already in Use
If port 3000 is busy:
```bash
npm run dev -- -p 3001
```

### Build Issues
```bash
npm run build
```

## Features Included

✅ Next.js 15 with App Router
✅ TypeScript support
✅ Responsive design
✅ Smooth animations
✅ SEO optimized
✅ All sections from original design

