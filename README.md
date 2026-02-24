# 💬 Tars Real-Time Chat Application

A modern, real-time chat application built for the Tars Full Stack Engineer Internship Challenge 2026.

## 🚀 Features

### Core Features (Required)
- ✅ **Authentication** - Sign up/in with Clerk (email + social)
- ✅ **User Discovery** - Search and find other users
- ✅ **Real-Time Messaging** - Instant message delivery with Convex
- ✅ **Smart Timestamps** - Context-aware time display
- ✅ **Empty States** - Helpful UI when no data
- ✅ **Responsive Design** - Works on desktop and mobile
- ✅ **Online Status** - See who's currently active
- ✅ **Typing Indicators** - Know when someone is typing
- ✅ **Unread Counts** - Track unread messages
- ✅ **Smart Scroll** - Auto-scroll with user control

### Optional Features (If Time Permits)
- ⬜ Message deletion
- ⬜ Message reactions (emoji)
- ⬜ Loading & error states
- ⬜ Group chat

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Backend:** Convex (real-time database)
- **Auth:** Clerk
- **Styling:** Tailwind CSS + shadcn/ui
- **Deployment:** Vercel

## 📁 Project Structure

```
tars-chat-app/
├── app/
│   ├── (auth)/           # Authentication pages
│   ├── (chat)/           # Main chat interface
│   └── layout.tsx        # Root layout with providers
├── convex/
│   ├── schema.ts         # Database schema
│   ├── users.ts          # User queries/mutations
│   ├── conversations.ts  # Conversation logic
│   ├── messages.ts       # Message operations
│   └── typingStatus.ts   # Typing indicator logic
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── UserList.tsx
│   ├── ConversationSidebar.tsx
│   ├── ChatArea.tsx
│   ├── MessageList.tsx
│   └── MessageInput.tsx
└── lib/
    └── utils.ts          # Utility functions
```

## 🚦 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Convex

```bash
# Install Convex CLI globally
npm install -g convex

# Initialize Convex (this creates .env.local)
npx convex dev
```

This will:
- Create a Convex project
- Generate environment variables
- Start the Convex dev server

### 3. Set Up Clerk

1. Go to [clerk.com](https://clerk.com) and create an account
2. Create a new application
3. Copy your API keys
4. Add to `.env.local`:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```

### 4. Configure Clerk + Convex Integration

**In Clerk Dashboard:**
- Go to JWT Templates
- Create "Convex" template
- Copy the Issuer URL

**In Convex Dashboard:**
- Go to Settings → Environment Variables
- Add: `CLERK_ISSUER_URL` = your issuer URL

### 5. Run Development Server

```bash
# Terminal 1: Convex dev server
npx convex dev

# Terminal 2: Next.js dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📦 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Configure Production Convex

```bash
npx convex deploy --prod
```

## 🎯 Key Implementation Details

### Real-Time Subscriptions

Messages update in real-time using Convex's `useQuery` hook:

```typescript
const messages = useQuery(api.messages.list, { 
  conversationId 
});
```

Convex automatically re-runs queries when data changes - no WebSocket setup needed!

### Online Status

Users are marked online/offline based on:
1. Active connection to Convex
2. Page visibility API
3. Heartbeat mechanism every 30 seconds

### Typing Indicator

1. User types → debounced update to `typingStatus` table
2. Other users subscribe to typing status
3. Show indicator if last typed < 2 seconds ago
4. Auto-hide after 2 seconds of inactivity

### Unread Count

1. Track last read timestamp per conversation per user
2. Count messages created after last read
3. Clear when user opens conversation
4. Update in real-time as messages arrive

## 🧪 Testing

### Manual Testing Checklist

- [ ] Sign up new user
- [ ] Search for users
- [ ] Start conversation
- [ ] Send messages (appear in real-time?)
- [ ] Open in incognito (2nd user)
- [ ] Send from both sides
- [ ] Check typing indicator
- [ ] Check online status
- [ ] Check unread counts
- [ ] Test mobile responsive
- [ ] Test empty states

## 🐛 Common Issues

### Convex not connecting
- Ensure `npx convex dev` is running
- Check `.env.local` has correct `CONVEX_DEPLOYMENT`

### Auth not working  
- Verify Clerk keys in `.env.local`
- Check redirect URLs in Clerk dashboard

### Messages not real-time
- Confirm using `useQuery` not `fetch`
- Check Convex dev server is running

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Convex Docs](https://docs.convex.dev)
- [Clerk Docs](https://clerk.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 👤 Author

**Your Name**  
Built for Tars Full Stack Engineer Internship Challenge 2026

## 📄 License

This project was built as part of an internship application.
