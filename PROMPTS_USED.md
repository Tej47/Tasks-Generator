Prompts used in Cursor ai:
1.
Create a reusable MongoDB connection utility using mongoose for a Next.js App Router project.
It should:
Prevent multiple connections in development
Throw error if MONGODB_URI is missing
Export an async connectDB() function
Keep it production-ready and clean

2.
Explain why this connection caching logic works in Next.js App Router.

3.
@tasks-generator/src/models/Spec.ts 
Create a Mongoose schema and model for a planning specification with the following structure:

goal: string
users: string
constraints: string
title: string
userStories: string[]
tasks: array of objects with:
id: string
title: string
group: string (Frontend | Backend | Database | DevOps)
risks: string[]
createdAt: Date (default now)

Export the model safely (avoid OverwriteModelError in Next.js).

4.
@tasks-generator/src/lib/openai.ts Create an OpenAI client setup for a Next.js server environment.
Read API key from process.env.OPENAI_API_KEY
Throw error if missing
Export a reusable function generateSpec(systemPrompt, userPrompt)
Use a low temperature (0.3)

Return raw text response only
Keep it clean and minimal.

5.
@tasks-generator/src/lib/prompts.ts Create a system prompt string for a senior product manager that:

Converts feature ideas into structured JSON
Returns strictly valid JSON
No markdown
No explanations
Output format:

{
"title": string,
"userStories": string[],
"tasks": [
{
"id": string,
"title": string,
"group": "Frontend" | "Backend" | "Database" | "DevOps"
}
],
"risks": string[]
}

Add strict rules to prevent extra fields.

6.
Also create a function buildUserPrompt(goal, users, constraints, templateType)

7.
Create a Next.js App Router POST API route that:

Validates goal, users, constraints
Calls connectDB()
Calls generateSpec()
Parses JSON safely
Saves spec to MongoDB
Keeps only last 5 specs (delete older ones)
Returns JSON response
Handles errors properly
Keep it production-ready and clean.

8.
Create a React client component called FeatureForm for a Next.js App Router project.
Requirements:
"Fields":
 1. goals(textarea)
 2. users(textarea)
 3.constraints(textarea)
 4. templateType(select: web app, mobile app, internal   tool)
All fields required
On submit:
 1. POST to /api/generate 
 2. Show loading spinner while waiting
 3. Handle error state
 4. On success, redirect to /generate and pass results using router.push with query param or localStorage
Use tailwind for clean styling
Keep state using useState
Make it production clean

9.
Create a clean home page that:

Displays app title
Short description
Renders FeatureForm component
Uses Tailwind for spacing
Centered layout

10.
Create a Next.js client page /generate/page.tsx for the Tasks Generator app.

Requirements:
Read the latest spec from localStorage key "latestSpec".
If not found, show an error message.
While loading the spec, show a loading spinner.
Display:
Title
Goal
User Stories (as a bulleted list)
Tasks grouped by their group field (Frontend, Backend, Database, DevOps). Each group should show a heading and list tasks under it.
Risks (as a bulleted list)
Use Tailwind for clean styling.
Include a "Back" button to go to the home page.
Handle dark mode styling.
Use useEffect and useState to fetch data.
Keep the component clean and production-ready

11.
Refactor this page so that:

Tasks are stored in local React state using useState
Load initial tasks from localStorage.latestSpec on mount
Each task must have a unique id (use crypto.randomUUID if needed)
The UI should render from state instead of directly from localStorage
Do NOT change styling
Keep existing grouping logic

12.
Integrate @dnd-kit into this page.

Wrap the task board inside DndContext
Use closestCenter collision detection
Add onDragEnd handler
For now, just log active.id and over.id
Do not change layout styling
Pass tasks and setTasks as props
Keep current grouping logic
GeneratePage should only render <TaskBoard />

13.
Refactor the task group rendering into a separate component called TaskColumn.

It should receive:
group name
tasks for that group
Do not add drag logic yet
Keep styling unchanged
TaskBoard should render one TaskColumn per group

14.
Create a new component called SortableTaskItem.

It should receive a task prop of type Task
Use useSortable from @dnd-kit/sortable
Apply attributes, listeners, and setNodeRef
Apply style={{ transform, transition }}
Keep the exact same styling as the current <li>
Do not change visual design
Export the component

15.
Update TaskColumn:

Import SortableContext from @dnd-kit/sortable
Wrap the task list inside SortableContext
Pass items={tasks.map(t => t.id)}
Use verticalListSortingStrategy
Replace the <li> with <SortableTaskItem task={task} />
Keep styling unchanged

16.
Update handleDragEnd:

Import arrayMove from @dnd-kit/sortable
If active.id !== over.id
Find old index and new index in the tasks array
Use arrayMove(tasks, oldIndex, newIndex)
Call setTasks with the new array
Only support reordering within same column for now
Do not implement cross-column moves yet

17.
Upgrade handleDragEnd to support cross-column movement:

If active and over are in different groups:
Remove the active task from its original position
Update its group to match overTask.group
Insert it into the new group at the position of overTask
Keep same-group reordering logic intact
Preserve order of unrelated groups
Do not change component structure