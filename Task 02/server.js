import express from 'express';
import itemRoutes from './routes/items.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Parse incoming JSON payloads. This is built into Express and is super fast.
app.use(express.json());

// Simple request logger to keep an eye on response times and basic traffic
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const latency = Date.now() - start;
        console.log(`[${req.method}] ${req.originalUrl} - ${res.statusCode} (${latency}ms)`);
    });
    next();
});

// Setup our main resource routes
app.use('/items', itemRoutes);

// Catch 404s for anything that doesn't match our routes
app.use((req, res) => {
    res.status(404).json({
        error: "Not Found",
        message: "Looks like this endpoint doesn't exist."
    });
});

// Global error handler so the server doesn't crash if something goes wrong
app.use((err, req, res, next) => {
    console.error('Whoops, something broke:', err.stack);
    res.status(500).json({
        error: "Internal Server Error",
        message: "Something went wrong on our end. We're looking into it!"
    });
});

app.listen(PORT, () => {
    console.log(`API is up and running on port ${PORT}`);
});
