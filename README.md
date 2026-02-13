# 📋 Tasks Generator (AI-Powered Planning Tool)

A full-stack web application that transforms rough feature ideas into structured, actionable engineering plans. Built with Next.js 14, Tailwind CSS, and Groq (Llama 3), it automates the creation of user stories, technical tasks, and risk assessments.

# 🚀 Live Demo

[https://tasks-generator-ashen.vercel.app/]

# ✨ Features / What is done

1. Smart Specification Generation
Feature Form: Input your goal, target users, and constraints.

Contextual Templates: Choose between Web App, Mobile App, or Internal Tool to tailor the AI's output logic.

AI Engine: Uses Llama 3 via Groq for high-speed, professional product management insights.

2. Task Management & Reordering
Interactive Task Board: Tasks are automatically grouped into four categories: Frontend, Backend, Database, and DevOps.

Drag & Drop: Fully implemented reordering using @dnd-kit. Move tasks within groups or drag them to different technical areas.

Live Editing: Click on any task to edit it inline or use the trash icon to remove it.

3. Persistence & History
Database Integration: Powered by MongoDB to save every generated plan.

History: Quickly access and review your last 5 generated specifications. Click on any specification to view or edit its details.

4. Exporting
Markdown Support: Download your entire plan as a .md file for documentation.

One-Click Copy: Copy the structured plan to your clipboard to paste into Jira, Notion, or Trello.

5. System Health Monitoring
Status Page: A dedicated dashboard to monitor the connectivity of the Backend, Database, and LLM (Groq) API.

# 🛠️ Tech Stack

Framework: Next.js 14 (App Router)

Language: TypeScript

Styling: Tailwind CSS + Lucide Icons

Database: MongoDB (via Mongoose)

AI Inference: Groq SDK (Llama 3.3 70B)

Drag & Drop: @dnd-kit

# ⚙️ Installation & Setup / How to run

1. Clone the repository
   
git clone https://github.com/Tej47/Tasks-Generator.git
cd Tasks-Generator

3. Install dependencies

npm install

4. Environment Variables

Create a .env file in the root directory (refer to .env.example):


MONGODB_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
4. Run the development server


npm run dev

Open http://localhost:3000 with your browser to see the result.

# 🏗️ Architecture
The project follows a modular Next.js architecture:

/app/api: Serverless routes for AI generation, history retrieval, and system status.

/components: Reusable UI elements like TaskBoard, FeatureForm, and SortableItem.

/lib: Core logic including database connection pooling and AI prompt engineering.

/models: Mongoose schemas defining the structure of a Spec and Task.

# 🛡️ AI Safety & Validation
To ensure professional results and system stability:

Input Sanitization: A custom layer filters and transforms sensitive keywords into professional context before sending them to the LLM.

Schema Enforcement: The AI is forced to return a strictly formatted JSON object, which is then validated against a Mongoose schema before being saved.

# What is not done

The app ensures that no fields are left empty and that all data is sent in the correct format. It does not, however, validate the specific category or 'kind' of input provided by the user, allowing for any type of feature idea to be processed.
