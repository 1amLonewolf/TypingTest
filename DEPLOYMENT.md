# Deployment Guide

Your Typing Test application is now ready for deployment! Choose one of the options below:

## 🚀 Option 1: Vercel (Recommended)

**Advantages:**
- Zero-config deployment (works out of the box)
- Automatic deployments on git push
- Preview deployments for pull requests
- Better performance with edge CDN
- Built-in analytics and error tracking
- Custom domains support

### Steps:
1. **Push to GitHub** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/Typing_Test.git
   git branch -M main
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Select your `Typing_Test` repository
   - Click "Deploy" (no configuration needed!)
   - Your site will be live at `https://typing-test-YOUR_USERNAME.vercel.app`

3. **Custom Domain** (optional):
   - In Vercel dashboard, go to Settings → Domains
   - Add your custom domain

---

## 📄 Option 2: GitHub Pages

**Advantages:**
- Free hosting directly from your GitHub repository
- Simple setup for open-source projects
- No third-party account needed

### Steps:
1. **Update Repository Settings:**
   - Go to your GitHub repository Settings
   - Navigate to Pages (left sidebar)
   - Under "Build and deployment":
     - Source: Select "GitHub Actions"
     - (The workflow file is already set up in `.github/workflows/deploy.yml`)

2. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/Typing_Test.git
   git branch -M main
   git push -u origin main
   ```

3. **GitHub Actions will automatically:**
   - Build your project
   - Deploy to GitHub Pages
   - Your site will be live at `https://YOUR_USERNAME.github.io/Typing_Test/`

### If using GitHub Pages with a custom domain:
   - Go to Repository Settings → Pages
   - Under "Custom domain", enter your domain
   - Add a DNS CNAME record pointing to `YOUR_USERNAME.github.io`

---

## 🔍 Build Command

Both platforms will use your configured build command:
```
tsc && vite build
```

This builds your TypeScript files and optimizes your Vite project into the `dist/` directory.

---

## ✅ Checklist Before Deploying

- [ ] Run `npm run build` locally to verify no errors
- [ ] Test with `npm run preview` to preview production build
- [ ] Push all changes to GitHub
- [ ] Verify your site loads correctly after deployment

---

## 📝 Environment Variables (if needed)

For **Vercel**: Add variables in Dashboard → Settings → Environment Variables
For **GitHub Pages**: Not applicable (static site)

---

Choose Vercel unless you specifically prefer GitHub Pages! 🎉
