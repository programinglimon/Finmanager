# Deployment & GitHub Guide

## 1. Push to GitHub
I have initialized the local repository for you. Now follow these steps:

1.  **Create a New Repository** on GitHub:
    *   Go to [github.com/new](https://github.com/new).
    *   Name it `FinManager` (or whatever you like).
    *   Do **NOT** initialize with README, .gitignore, or License.
    *   Click **Create repository**.

2.  **Push your code**:
    Copy the commands under "…or push an existing repository from the command line" and run them in your terminal here:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/FinManager.git
    git branch -M main
    git push -u origin main
    ```

---

## 2. Best Places to Deploy

### Option A: Professional & Free Tier (Recommended)
**Frontend** -> **Vercel**
**Backend** -> **Render**

### Step 1: Deploy Backend (Render)
1.  Push your code to GitHub.
2.  Go to [dashboard.render.com](https://dashboard.render.com/).
3.  Click **New +** -> **Web Service**.
4.  Connect your GitHub account and select the `FinManager` repo.
5.  **Settings**:
    *   **Root Directory**: `server`
    *   **Build Command**: `npm install`
    *   **Start Command**: `node index.js`
    *   **Environment Variables**: Add these from your `.env` file:
        *   `MONGO_URI`: (Your full MongoDB connection string)
        *   `PORT`: `5000`
6.  Click **Create Web Service**.
7.  **Copy the URL** provided by Render (e.g., `https://finmanager-api.onrender.com`).

### Step 2: Deploy Frontend (Vercel)
1.  Go to [vercel.com](https://vercel.com).
2.  Click **Add New...** -> **Project**.
3.  Import your `FinManager` repo.
4.  **Settings**:
    *   **Framework Preset**: Vite (Auto-detected).
    *   **Root Directory**: Edit this -> Select `client`.
    *   **Environment Variables**:
        *   Name: `VITE_API_URL`
        *   Value: `https://your-render-backend-url.onrender.com` (The URL from Step 1)
5.  Click **Deploy**.

---

## 3. Important: Code Update
I have updated your React code to be dynamic. 
- Locally, it uses `http://localhost:5000`.
- On Vercel, it will use the `VITE_API_URL` you provide.
