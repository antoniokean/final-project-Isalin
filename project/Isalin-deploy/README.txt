Final-Project/ ← open a terminal HERE for the backend
├── app.js # Express API
├── package.json
├── node_modules/
├── .env # holds DATABASE_URL 
├── Isalin/ ← open a SECOND terminal here for the frontend
│ ├── index.html
│ ├── package.json
│ └── src/
│ ├── App.jsx
│ ├── main.jsx
│ ├── index.css
│ ├── api.js
│ └── components/
└── Isalin-Server/
└── db/
└── schema.sql 

How to run it

You need two terminals open at the same time — one for the backend, one for the frontend.

Terminal 1 — backend. Open it at the Final-Project root (the outermost folder, the one that directly contains app.js):

bash
cd Final-Project
node --env-file=.env app.js

Leave this terminal running.

Terminal 2 — frontend. Open a new terminal at the Isalin folder (one level inside Final-Project):

bash
cd Final-Project/Isalin
npm install
npm run dev

Open http://localhost:5173 in your browser 
