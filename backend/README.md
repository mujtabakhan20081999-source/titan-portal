# TITAN Sukkur — Backend

Express + MongoDB (Mongoose) backend for the TITAN Sukkur Management System.

## What was done

The `backend` folder originally only had an empty `.env` and a `package.json` with a
single dependency (`dotenv`) — there was no server code at all. This has been built out:

- `server.js` — Express app entry point, connects to MongoDB and mounts all API routes.
- `config/db.js` — MongoDB connection logic using Mongoose.
- `models/` — `User`, `Trainer`, `Student`, `Payment`, `Attendance` schemas.
- `routes/` — REST endpoints (auth + CRUD) for each model.
- `middleware/` — JWT auth guard (`auth.js`) and a central error handler.
- `.env` — filled in with your MongoDB URI, a JWT secret, and a port.

## Run it

```bash
cd backend
npm install
npm run dev     # nodemon, auto-restarts on changes
# or
npm start       # plain node
```

Server runs on `http://localhost:5000` by default (see `PORT` in `.env`).

Check it's alive:
```
GET http://localhost:5000/api/health
```

## ⚠️ Important — MongoDB Atlas IP Whitelist

I tested the connection string you gave me and the server code connects correctly,
but Atlas rejected the connection with:

> Could not connect to any servers in your MongoDB Atlas cluster... your current IP
> address is on your Atlas cluster's IP whitelist.

**This is not a code bug** — it's an Atlas security setting. Your cluster's Network
Access list doesn't currently allow the IP trying to connect. To fix it:

1. Go to MongoDB Atlas → your project → **Network Access**.
2. Click **Add IP Address**.
3. For development/testing, choose **Allow Access from Anywhere** (`0.0.0.0/0`).
   For production, add the specific IP of the server that will host this backend.
4. Save — it takes about a minute to apply.

Once that's added, `npm run dev` will connect successfully and print:
```
✅ MongoDB Connected: <host>
📦 Database: project
```

## API Endpoints

| Method | Route | Auth required |
|---|---|---|
| POST | `/api/auth/register` | No |
| POST | `/api/auth/login` | No |
| GET/POST | `/api/trainers` | Yes |
| GET/PUT/DELETE | `/api/trainers/:id` | Yes |
| GET/POST | `/api/students` | Yes |
| GET/PUT/DELETE | `/api/students/:id` | Yes |
| GET/POST | `/api/payments` | Yes |
| PUT/DELETE | `/api/payments/:id` | Yes |
| GET/POST | `/api/attendance` | Yes |
| PUT/DELETE | `/api/attendance/:id` | Yes |

"Auth required" routes need an `Authorization: Bearer <token>` header, using the
token returned from `/api/auth/login` or `/api/auth/register`.

## Note on the Frontend

The React frontend currently uses local mock/sample data in every page (e.g.
`services/trainerService.js`) — it does not call any API yet. Connecting the
frontend pages to these new endpoints (replacing the mock arrays with real
`fetch`/`axios` calls) is a separate follow-up step, since you asked specifically
for the backend + MongoDB connection.
