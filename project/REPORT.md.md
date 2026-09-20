# Weekly Increment Report (template)

Copy this into your project repository as `REPORT.md` (and keep it in your
workspace `project/`). Fill it in each week and submit the link. Keep it honest
and specific: this is graded on what it shows about your week of work.

## Week of: (date)
09-20-26

## What changed this week
1.Built the core syllabifier and Latin↔Baybayin conversion engine in app.js, using the real Unicode Tagalog block (U+1700–U+171F).

2.Fixed a mapping bug where “l,” “r,” and “w” pointed to the wrong Unicode code points. This was traced by comparing the mappings against the official Unicode specification and confirmed by testing the misread word “Lebron” → “Ribkon,” which led to the exact swapped hexadecimal values being identified and corrected.

3.Added loan-letter substitution for c, f, j, q, v, x, z, and the “ch” digraph so words containing sounds that are not represented in Baybayin's traditional alphabet can still be converted sensibly. The substitutions were based on Filipino orthographic conventions rather than arbitrary guesses.

## Why
The goal was to create a working, deployable transliteration tool, rather than just a local demo. The Unicode accuracy fixes were important because an incorrect glyph mapping would cause the application to produce incorrect Baybayin characters, which defeats the purpose of the project. The loan-letter substitutions were added to make the tool more practical for real-world Filipino words, especially those containing borrowed letters and sounds.

## What broke or what I got stuck on
Spent significant time on file/folder path confusion locally, with backend files ending up in the wrong folder relative to the frontend. This caused repeated MODULE_NOT_FOUND errors until the actual folder structure was confirmed using dir. Also hit a PostgreSQL relation "conversions" does not exist error after setting up Neon. The database connection itself was working, but the required table had never been created. This was fixed by running the schema SQL directly in Neon's SQL editor.

## What is left
Nothing really everything is finished except for the progress reports.