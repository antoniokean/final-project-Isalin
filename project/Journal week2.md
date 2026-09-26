# Reflection Journal (template)

Copy this into your workspace `journal/` as a weekly entry (for example
`journal/week-1.md`). Fill it in each week and submit the link. Write about the
specific things you actually did, not general statements.

## Week of: (date)

09-26-26

## My goal this week

This week was about wrapping up the project documentation and journals
(README, reports, this file) to match the finished state.

## What I did

-Set up a PostgreSQL database on Neon, wrote the schema, and connected
  it to the backend for saving, loading, and clearing conversion
  history.
-Fixed a bug where every keystroke was being saved as a separate
  history entry instead of one entry per completed conversion.
-Pushed the project to GitHub and deployed it publicly, the backend on
  Render, frontend on Vercel connected through an environment
  variable instead of a hardcoded URL.
-Debugged deployment failures, including a wrong root directory
  setting that made Vercel misdetect the project as Express instead of
  Vite, and a filename casing mismatch that only broke on Vercel's
  Linux build servers, not locally on Windows.
-Fixed the alphabet reference table, which was missing the three
  standalone vowel letters (a, e/i, o/u) also added a dedicated column so
  the reference is now complete.
## What blocked me

Nothing major this week was documentation, not new development, so
there weren't real technical blockers.

## What I learned
I learned how to prepare a project for deployment and make it accessible to the public by connecting the frontend, backend, and database. I also gained experience setting up PostgreSQL, managing conversion history, and configuring environment variables. Through debugging deployment issues, I learned the importance of correct project settings, file naming, and maintaining consistency between local and production environments. I also realized the importance of complete and accurate documentation, especially when presenting the finished state of a project.