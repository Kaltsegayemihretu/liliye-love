# Liliye — Full-Stack Interactive Romantic Website 💖

A private, highly personal interactive website designed as a digital love letter, relationship memory album, soundtrack experience, private chat, and final invitation.

Inspired by a playful, vibrant, modern romantic design language:
- Hot pink, vibrant magenta, and deep raspberry gradients
- Large rounded containers & translucent glassmorphism
- Ticking watch/time motif
- Interactive envelope & scrollable love letter
- Pink retro cassette boombox soundtrack player
- Interactive distance map & relationship timeline
- Private chat between Admin and Her with transactional email notifications
- Dedicated Vercel serverless API architecture & MongoDB Atlas integration
- Separate, secure Admin Dashboard (`/admin`)

---

## 🚀 Tech Stack

- **Frontend**: React 19, React Router v7, Vite, Tailwind CSS v4, Framer Motion, Lucide React, Canvas Confetti
- **Backend**: Node.js, Express (Vercel Serverless Function architecture under `/api`)
- **Database**: MongoDB Atlas (Mongoose ODM)
- **Authentication**: JWT, bcryptjs password hashing, separate Admin & Her roles
- **Email**: Transactional Email (Nodemailer)
- **Deployment**: GitHub + Vercel

---

## 🛠️ Getting Started Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your MongoDB Atlas URI, JWT Secret, and Email Credentials in `.env`.

### 3. Run Development Server
```bash
npm run dev
```
- Frontend runs at: `http://localhost:5173`
- Backend API runs at: `http://localhost:5000`

### 4. Credentials Out-Of-The-Box
- **Her Login**: `her@liliye.love` / `her123`
- **Admin Dashboard Login**: `admin@liliye.love` / `admin123`

---

## ☁️ Deploying to Vercel & GitHub

1. Push this project to your private GitHub repository:
   ```bash
   git add .
   git commit -m "Initial commit of full-stack romantic experience"
   git push origin main
   ```
2. Import the repository into [Vercel](https://vercel.com).
3. Set the Environment Variables in your Vercel Project Settings:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - `HER_EMAIL`
   - `HER_PASSWORD`
   - `EMAIL_USER`
   - `EMAIL_PASS`
   - `FRONTEND_URL`
4. Click **Deploy**. Vercel will automatically build the React SPA and serve the serverless endpoints under `/api`.

---

## 💖 Features & Story Journey

1. **Hero**: `"I'LL WAIT FOR YOU TILL THE END OF TIME"` with floating cutout stickers and opening audio.
2. **Watch Motif**: Ticking romantic clock animation & quote card.
3. **Memories Album**: Non-boring scrapbook with cutout photos, polaroid rotations, captions, and lightbox.
4. **Video Scrapbook**: Cinematic memory video container.
5. **Interactive Love Letter**: Tap-to-open envelope, handwritten notes, and sensible scroll threshold auto-closing back to envelope.
6. **Our Soundtrack Boombox**: Pink retro cassette player with playlist slide-out drawer, audio controls, and smooth background music fading.
7. **Relationship Timeline**: Vertical milestone story cards ending with *"And somehow, after everything... Here we are."*
8. **Two Locations**: Interactive distance card connecting MY PLACE & HER PLACE with an animated SVG path.
9. **Final Section & Red Button**: Deep-red rounded pill button (`"CLICK WHEN YOU'RE READY FOR US"`). Triggers romantic heart confetti, stores response in MongoDB, and notifies Admin via email.
10. **Footer**: Understated, playful: *"Technically, I'm not contacting you."*
11. **Admin Dashboard (`/admin`)**: Complete monitoring (visits, envelope opens, boombox plays, final button clicks), full content management (CRUD for photos, videos, letter, soundtrack, timeline, locations), and private chat.
