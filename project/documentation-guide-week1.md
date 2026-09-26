# Documentation guide (what your docs must contain)

Your Documentation Update is graded in week 1 and again in week 2. Documentation
is not an afterthought: a reader who has never seen your project should be able
to understand what it is, get it running, and use it, from your docs alone. Keep
your documentation in your project repository's `README.md` (and link it, or a
copy, from your workspace `project/`).

Your documentation must contain these sections. Aim for clear and complete, not
long.

## 1. Overview

Isalin converts text between the Latin alphabet and Baybayin, the pre-colonial Filipino syllabary. It's a transliterator, not a translator it converts how a word sounds, not what it means, by breaking each word into syllables (onset, vowel, coda) and mapping each syllable to its corresponding Baybayin glyph, rather than substituting letters one-to-one. It's built for Filipino students, educators, or anyone curious about the traditional script who wants to see a word rendered correctly, syllable by syllable.

## 2. Setup and installation

Every step to get the project running from nothing, in order:

1.Node.js version 20 or later (this project was built and tested on Node 24, which is required for the --env-file flag used to run the backend)
A code editor (VS Code recommended)
Git

2.git clone your repo's url
cd Final-Project

3.npm install
cd Isalin
npm install
cd ..

4.DATABASE_URL	postgresql://user:password@host/dbname?sslmode=require app runs without it, just skips saving history
PORT	3001

5.Create a Postgres database (Neon, or any Postgres instance).
Run the schema in Isalin-Server/db/schema.sql against it:

## 3. How to run it

Terminal 1 backend, from the project root:
node --env-file=.env app.js

Terminal 2 frontend, from Isalin/:
npm run dev

## 4. Features and usage

Type Filipino (or any Latin-alphabet) text into the input box.
The Baybayin output appears live as you type.
Click away from the input box this saves the conversion to "Recent conversions" (only complete entries are saved, not every keystroke).
Click the arrow buttons to swap direction and convert Baybayin back to Latin instead.
Click any entry in "Recent conversions" to reload it into the converter.
Use "Clear" to wipe all saved history, or "View all" to expand past the default 5 shown.

## 5. Project structure

Final-Project/
 app.js              # Express API: mapping table, syllabifier, routes
 package.json         # backend dependencies (express, cors, pg)
 .env                  # DATABASE_URL not committed
 Isalin-Server/
   db/schema.sql      # Postgres table definition
      Isalin/               # React (Vite) frontend
        index.html
        vite.config.js
        src/
            App.jsx          # main component, state, layout
            api.js            # fetch calls to the backend
            index.css          # design tokens + all styling
            components/
                BreakdownView.jsx   # syllable breakdown chips
                HistoryList.jsx      # recent conversions sidebar
                ReferenceChart.jsx    # alphabet reference table

## 6. Screenshots

![Converter view](Screen1.png)
![History panel](Screen2.png)

At least one screenshot of the app running. More if it has several screens.

## 7. Known issues and next steps

The syllabifier is a heuristic, not a full linguistic parser it handles common Filipino word shapes and consonant clusters well, but wasn't built to cover every possible edge case.
The loan-letter substitution rules are a simplification (e.g. "c" before e/i/y "s", otherwise "k")  documented in app.js, not an exhaustive phonetic system.

## How it is graded

See `rubrics.md` in this unit for the exact point breakdown. In short: your setup
and run steps must actually work (that is the largest share), your feature and
usage docs must match what the code really does, and screenshots plus clear
writing carry the rest.
