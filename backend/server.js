import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import express from 'express';
import { google } from 'googleapis';
import dayjs from 'dayjs';

const app = express();
const PORT = process.env.NODE_ENV || 3000;

// Middleware
app.use(express.json()); // Enables JSON body parsing

// OAuth2 Client Setup
const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);

// Token Verification Middleware (For protecting routes)
async function verify(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) throw new Error("No authorization header");

        const token = authHeader.split(' ')[1]; // Extract token from Bearer scheme
        if (!token) throw new Error("No token found");

        const ticket = await oauth2Client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID, // Ensure the token is for your app
        });

        const payload = ticket.getPayload();
        if (!payload) throw new Error("Invalid ID Token");

        req.userId = payload['sub']; // Save user ID for future use
        next();
    } catch (error) {
        console.error("Token verification failed:", error);
        res.status(401).send({ error: "Unauthorized" });
    }
}

// OAuth Login Route (for frontend to initiate Google Sign-In)
app.post("/auth/google", async (req, res) => {
    try {
        const { token } = req.body; // Receive the token from frontend
        const ticket = await oauth2Client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload) throw new Error("Invalid ID Token");

        // You could generate your own token/session here if needed
        res.send({ message: "Google Sign-In successful", userId: payload['sub'] });
    } catch (error) {
        console.error("Google Sign-In Error:", error);
        res.status(401).send({ error: "Invalid Google ID Token" });
    }
});

// Protected Route (requires a valid Google ID token)
app.get('/protected', verify, (req, res) => {
    res.send({ message: `Protected resource accessed by user ${req.userId}` });
});

// Google OAuth Scopes
const scopes = ['https://www.googleapis.com/auth/calendar'];

// Google Calendar API Setup
const calendar = google.calendar({
    version: 'v3',
    //auth: process.env.API_KEY,
    auth: oauth2Client,
});

// OAuth Login Route
app.get("/google", (req, res) => {
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes
    });
    res.redirect(url);
});

// Google OAuth Callback
app.get("/google/redirect", async (req, res) => {
    try {
        const code = req.query.code;
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        res.send({ msg: "Successful login" });
    } catch (error) {
        console.error("Google Auth Redirect Error:", error);
        res.status(500).send({ error: "Authentication failed" });
    }
});

app.post("/google/calendar/schedule_event", async (req, res) => {
    const accessToken = req.headers.authorization?.split(" ")[1];
    console.log(accessToken);

    if (!accessToken) {
        return res.status(401).json({ error: "Missing access token" });
    }

//oauth2Client.setCredentials({ refresh_token: refreshToken });
    oauth2Client.setCredentials({ access_token: accessToken });

    try {
        const event = await calendar.events.insert({
            calendarId: "primary",
            requestBody: req.body,
        });
        res.json({ success: true, event: event.data, eventId: event.data.id });
    } catch (error) {
        console.error("Error Creating Event:", error);
        res.status(500).json({ error: "Failed to create event" });
    }
});

// Edit Event in Google Calendar
app.put("/google/calendar/update_event", async (req, res) => {
    const accessToken = req.headers.authorization?.split(" ")[1];
    console.log(`access token: ${accessToken}`);

    if (!accessToken) {
        return res.status(401).json({ error: "Missing access token" });
    }

    oauth2Client.setCredentials({ access_token: accessToken });

    try {
        const event = await calendar.events.update({
            calendarId: "primary",
            eventId: req.body.eventId,
            requestBody: req.body.eventDetails,
        });
        res.json({ success: true, event: event.data });
    } catch (error) {
        console.error("Error Updating Event:", error);
        res.status(500).json({ error: "Failed to update event" });
    }
});

// Delete Event from Google Calendar
app.delete("/google/calendar/delete_event", async (req, res) => {
    try {
        const accessToken = req.headers.authorization?.split(" ")[1];
        if (!accessToken) {
            return res.status(401).json({ error: "Missing access token" });
        }

        oauth2Client.setCredentials({ access_token: accessToken });

        await calendar.events.delete({
            calendarId: 'primary',
            auth: oauth2Client,
            eventId: req.body.eventId,
        });

        res.send({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error("Error deleting event:", error);
        if (error.code === 'ECONNABORTED') {
            res.status(500).json({ error: "Request timed out" });
        } else {
            res.status(500).json({ error: "Failed to delete event" });
        }
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Helper Functions
function getListOfEventsFromGoogle(calendarId, auth, singleEvents, q, maxResults) {
    return calendar.events.list({
        calendarId,
        auth,
        singleEvents,
        q,
        maxResults
    });
}
