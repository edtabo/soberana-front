# Soberana Frontend

Frontend application built with Next.js, React, and TailwindCSS.

## 🚀 Tech Stack

- **Framework**: Next.js 16.0.7
- **UI Library**: React 19.2.0
- **Styling**: TailwindCSS 4
- **State Management**: Zustand
- **Form Handling**: React Hook Form
- **Icons**: React Icons
- **Data Fetching**: Next.js API Routes
- **Type Safety**: TypeScript

## 🛠️ Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher) or yarn

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd front
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn
   ```

3. **Set up environment variables**
   - Create a `.env.local` file in the root directory
   - Add the following variables:
     ```bash
     # Backend API URL
     BACK_URL=http://localhost:3005

     # Maximum number of days allowed for inventory submission (default: 3)
     MAX_DAYS=3
     ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open in browser**
   - Visit [http://localhost:3000](http://localhost:3000)

## 📂 Project Structure

- `/src/app` - Application pages and routing
- `/src/components` - Reusable UI components
- `/src/features` - Feature modules (login, inventory, users)
- `/public` - Static files

## 🛠 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Edge (latest)
- Safari (latest)