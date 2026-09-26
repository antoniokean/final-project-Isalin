# Weekly Increment Report (template)

Copy this into your project repository as `REPORT.md` (and keep it in your
workspace `project/`). Fill it in each week and submit the link. Keep it honest
and specific: this is graded on what it shows about your week of work.

## Week of: (date)
09-26-26

## What changed this week
1.Set up a PostgreSQL database on Neon, wrote the conversions schema, and connected it to the backend for saving, loading, and clearing conversion history.

2.Fixed a bug where every keystroke was being saved as a separate history entry — separated "live preview" from "save to history" so only one entry gets saved per completed input instead of spamming the history list.

3.Pushed the project to GitHub and deployed it publicly: backend on Render, frontend on Vercel, connected through a VITE_API_URL environment variable instead of a hardcoded address.

4.Fixed the alphabet reference table — it was only showing consonant glyphs and was missing the three standalone vowel letters (a, e/i, o/u) entirely, even though the app itself uses them for words that start with a 
bare vowel sound. Added a "vowel" column to the same table so the reference is now complete.

5.Finished the project documentation — README (overview, setup, environment variables, run instructions, API endpoints, project structure, known issues) and this weekly report.

## Why
The goal this week was to move from "working locally" to "actually deployed and documented" — a finished project a reader who has never seen it before can set up and understand from the docs alone. The history-spam fix mattered because a history feature that saves every keystroke isn't actually useful. The alphabet reference fix mattered because a reference table that's silently missing three letters (including the very first letter of "Isalin" itself) isn't actually complete, even though it looked fine at a glance.

## What broke or what I got stuck on
Deployment was the hardest part of the week. Vercel repeatedly built from the wrong root directory, misdetecting the project as Express instead of Vite, since the repo has both a backend and a frontend in different folders. Also hit a case-sensitivity bug (BreakDownView.jsx vs BreakdownView.jsx) that only failed on Vercel's Linux build servers, not locally on Windows, since Windows doesn't distinguish filename casing the way Linux does. Also couldn't deploy directly from the school's GitHub organization repo because forking was disabled and the org hadn't approved the hosting platform's GitHub App — worked around it by pushing the same code to a separate personal repo just for deployment.

## What is left
Nothing really everything is finished except for the progress reports.
