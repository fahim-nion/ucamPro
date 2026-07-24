import express from 'express';
import authRouter from './api/auth.js';
import profileRouter from './api/profile.js';
import resultRouter from './api/result.js';
import routineRouter from './api/routine.js';
import attendanceRouter from './api/attendance.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Critical for reading login data
app.use(express.static('public')); // Serves the UI

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/profile', profileRouter);
app.use('/api/results', resultRouter);
app.use('/api/routine', routineRouter);
app.use('/api/attendance', attendanceRouter);

app.listen(PORT, () => {
    console.log(`🚀 UCAM PRO Running at http://localhost:${PORT}`);
});