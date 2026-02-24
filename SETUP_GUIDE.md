# Tars Chat App - Complete Setup & Submission Guide

## 🎯 Project Overview
Real-time chat messaging app built with Next.js 14, TypeScript, Convex, and Clerk.

## 📋 Prerequisites

Before starting, you need:
1. **Node.js 18+** installed
2. **Git** installed
3. **GitHub account** (for hosting code)
4. **Vercel account** (for deployment - free)
5. **Convex account** (for backend - free tier)
6. **Clerk account** (for auth - free tier)
7. **Loom account** (for video - free)

## 🚀 Step-by-Step Setup Instructions

### Step 1: Extract and Initialize Project

```bash
# Extract the project
cd tars-chat-app

# Install dependencies
npm install

# This will take 2-3 minutes
```

### Step 2: Set Up Convex (Backend & Database)

1. **Go to** https://convex.dev
2. **Sign up** with GitHub (free tier)
3. **Create a new project** called "tars-chat"
4. **Install Convex CLI:**
   ```bash
   npm install -g convex
   ```
5. **Initialize Convex in your project:**
   ```bash
   npx convex dev
   ```
6. This will:
   - Create a `.env.local` file with `CONVEX_DEPLOYMENT`
   - Open browser to authenticate
   - Start Convex dev server

### Step 3: Set Up Clerk (Authentication)

1. **Go to** https://clerk.com
2. **Sign up** (free tier)
3. **Create new application** called "Tars Chat"
4. **Select authentication methods:**
   - ✅ Email
   - ✅ Google (recommended)
   - ✅ GitHub (recommended)
5. **Copy your keys:**
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
6. **Add to `.env.local`:**
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```

### Step 4: Configure Clerk + Convex Integration

1. In Clerk Dashboard:
   - Go to **JWT Templates**
   - Create new template: **Convex**
   - Copy the **Issuer URL** (e.g., `https://your-app.clerk.accounts.dev`)

2. In Convex Dashboard:
   - Go to **Settings** → **Environment Variables**
   - Add: `CLERK_ISSUER_URL` = (your issuer URL from above)

### Step 5: Run the Development Server

```bash
# Terminal 1: Start Convex
npx convex dev

# Terminal 2: Start Next.js
npm run dev
```

Open http://localhost:3000

### Step 6: Test the Application

1. **Sign up** with a new account
2. **Open in incognito** window and sign up with another account
3. **Test features:**
   - Search for users
   - Start a conversation
   - Send messages (should appear in real-time on both sides)
   - Check online/offline status
   - Test typing indicators
   - Test unread counts
   - Test responsive layout (resize browser)

## 📤 Deployment Instructions

### Deploy to Vercel

1. **Push code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Tars chat app"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/tars-chat-app.git
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repo
   - Vercel will auto-detect Next.js
   - Add environment variables:
     ```
     NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
     CLERK_SECRET_KEY=...
     CONVEX_DEPLOYMENT=...
     ```
   - Click "Deploy"

3. **Configure Convex for Production:**
   ```bash
   npx convex deploy --prod
   ```

4. **Update Clerk redirect URLs:**
   - In Clerk Dashboard → **Domains**
   - Add your Vercel URL: `https://your-app.vercel.app`

### Test Production Deployment

1. Visit your Vercel URL
2. Sign up and test all features
3. Ensure real-time messaging works
4. Test on mobile device

## 🎥 Create Loom Video (REQUIRED)

### Video Structure (5 minutes):

**0:00 - 0:30: Introduction**
- "Hi, I'm [Your Name]"
- "I built this real-time chat app for the Tars internship"
- Brief background about yourself

**0:30 - 1:30: Live Demo**
- Show the deployed app
- Sign in as user 1
- Open incognito as user 2
- Send messages in real-time
- Show typing indicator
- Show online/offline status
- Show unread counts

**1:30 - 4:00: Code Walkthrough**
- Open VS Code
- Show project structure
- **Pick ONE feature you're proud of:**
  - Real-time subscriptions in Convex
  - Typing indicator logic
  - Unread message tracking
  - OR any other feature
- Walk through the code
- Explain your approach

**4:00 - 4:30: Live Code Change**
- Change a color in Tailwind
- OR change a text label
- OR modify some logic
- Save and show it reflected in browser

**4:30 - 5:00: Conclusion**
- Mention challenges you faced
- What you learned
- Thank them for the opportunity

### Recording Tips:

1. **Use Loom:** https://loom.com (free)
2. **Camera ON** - your face must be visible
3. **Practice 2-3 times** before recording
4. **Speak clearly** - accent doesn't matter, clarity does
5. **Be confident** - you built something cool!
6. **Check your recording** before submitting

## 📧 Submission Email

**To:** vaibhav@hellotars.com  
**CC:** vinit@hellotars.com  
**Subject:** Fullstack Intern Code Challenge Submission

**Body:**
```
Full Name: [Your Full Name]
Email: [Your Email]
Link to GitHub Repo: https://github.com/YOUR_USERNAME/tars-chat-app
Link to Vercel App: https://your-app.vercel.app
Link to Loom Video: https://loom.com/share/...
Link to LinkedIn Profile: https://linkedin.com/in/YOUR_PROFILE
AI-Assisted Coding Tool you used: Claude (Anthropic)

---

Features Implemented:
✅ 1. Authentication with Clerk
✅ 2. User list & search
✅ 3. One-on-one direct messages (real-time)
✅ 4. Message timestamps
✅ 5. Empty states
✅ 6. Responsive layout
✅ 7. Online/offline status
✅ 8. Typing indicator
✅ 9. Unread message count
✅ 10. Smart auto-scroll

[Optional - if you implemented these:]
✅ 11. Delete own messages
✅ 12. Message reactions
✅ 13. Loading & error states
✅ 14. Group chat

Thank you for considering my submission!
```

## ✅ Pre-Submission Checklist

Before sending the email, verify:

- [ ] Code pushed to **public** GitHub repository
- [ ] App deployed on Vercel and **working**
- [ ] Can sign up as new user on production
- [ ] Real-time messaging works on production
- [ ] Loom video recorded (5 minutes, camera on)
- [ ] Video includes live code change
- [ ] All URLs tested and accessible
- [ ] Frequent git commits in history

## 🐛 Troubleshooting

### Convex connection issues:
```bash
npx convex dev --once
npm run dev
```

### Clerk authentication not working:
- Check redirect URLs match in Clerk dashboard
- Verify API keys are correct in `.env.local`

### Real-time not updating:
- Ensure Convex dev server is running
- Check browser console for errors
- Verify Convex subscription code is correct

### Build errors on Vercel:
- Check all environment variables are set
- Ensure TypeScript has no errors: `npm run build` locally
- Check Vercel build logs for specific errors

## 📚 Resources

- **Next.js Docs:** https://nextjs.org/docs
- **Convex Docs:** https://docs.convex.dev
- **Clerk Docs:** https://clerk.com/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **shadcn/ui:** https://ui.shadcn.com

## 🎯 Evaluation Criteria

Your submission will be judged on:
1. **Features Completed** (40%) - How many work correctly?
2. **Code Quality** (20%) - Clean, readable TypeScript
3. **Schema Design** (15%) - Convex table structure
4. **UI/UX Polish** (15%) - Does it feel good to use?
5. **Presentation** (10%) - Video explanation quality

## 💡 Tips for Success

1. **Don't rush** - Quality over quantity of features
2. **Test everything** - Especially on production
3. **Commit often** - They check git history
4. **Comment complex code** - Shows understanding
5. **Handle edge cases** - Empty states, errors, loading
6. **Mobile-first** - Test on phone viewport
7. **Be yourself** in the video - They want to know you!

---

## Timeline

- **Day 1-2:** Setup + Build features 1-6
- **Day 3:** Build features 7-10
- **Day 4:** Polish, test, deploy
- **Day 5:** Record video, submit

Good luck! You've got this! 🚀
