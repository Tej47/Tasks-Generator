What I used AI for:

1.Boilerplate & Infrastructure: Built the initial Next.js API routes and the MongoDB connection utility with proper caching logic to prevent connection leaks.

2.Prompt Engineering: Took the help of AI to refine a SYSTEM_PROMPT that enforces strict JSON output and a sanitizeInput function to act as a pre-processing guardrail.

3.Complex Logic: I used AI to assist in integrating @dnd-kit, specifically for the mathematical logic involved in arrayMove and cross-column state updates.

4.Component Modularization: Used AI to help split a large monolithic page into clean, reusable components like TaskBoard, TaskColumn, and SortableTaskItem.

5.Consistent styling around the whole app.



What I implemented myself:

1.Schema Validation: I manually defined the Mongoose SpecSchema to ensure it matched the strict TypeScript interfaces, ensuring the database acts as a "source of truth" even if the AI output varies.

2.Shift from Local Storage to using the Database: In the homepage and the specification page, AI provided me the code such that the Spec data was stored and fetched from Local Storage. I changed that by fetching data from the database using API calls

3.History page: Implemented /history API to fetch last 5 specs from MongoDB. Implemented an OnClick function to ensure that the user gets redirected to the full details upon clicking a spec.

4.Environment Security: I personally verified that all sensitive keys (GROQ_API_KEY, MONGODB_URI) are strictly accessed via process.env and never exposed to the client-side.

5.Navigation using buttons around the whole app.

6.Save & “Saved ✓” UX: Implemented a responsive save button with real-time status updates instead of simple alerts given by AI, including copy and download functionality, ensuring the UI reflects the current state of tasks.

7.Drag & Drop Task Management: Integrated and fine-tuned @dnd-kit for tasks ensuring every case works as expected.

8.Manual Verification & Adjustments: Although Cursor AI was used as a reference during development, I manually reviewed the entire code, made project-specific modifications, and corrected numerous logical and functional errors to ensure the application works correctly and meets all requirements.


LLM and Provider Used:

For this project, I used the Groq provider along with LLaMA 3.3 70B Versatile as the language model.

Groq Provider: I chose Groq because it offers a free tier suitable for testing and development, making it the most accessible option among providers for this project. It integrates smoothly with the backend and allows efficient prompt-based generation without the need for paid credits.

LLaMA 3.3 70B Versatile: This model was selected for its speed and efficiency, which is critical for generating user stories and tasks interactively. Its performance allowed the app to provide near-real-time responses while maintaining high-quality structured output in JSON format.

Together, Groq and LLaMA 3.3 70B Versatile strike a balance between cost-effectiveness, speed, and output quality, making them an ideal combination for this tasks generator app.