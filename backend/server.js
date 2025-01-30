import dotenv from 'dotenv'
dotenv.config({path: './.env'})
import express from 'express'
import { google } from 'googleapis'
import dayjs from 'dayjs'
const app = express()
const PORT = process.env.NODE_ENV || 3000

// app.use(express.json())

//uses the googleapis library to create a new OAuth2 client with keys from the .env file
const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
)

//list of scopes that the app will have access to
const scopes = [
    'https://www.googleapis.com/auth/calendar'
]

const token = "";

//creates a new calendar object with the google calendar API
const calendar = google.calendar({
    version: 'v3', 
    auth: process.env.API_KEY
});

//tell the user to log in to google
app.get("/google", (req, res)=>{
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes
    });
    res.redirect(url)
});

//redirects the user to the google login page after the user has logged in
app.get("/google/redirect", async (req, res)=>{
    const code = req.query.code;
    
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    res.send({
        msg: "Successful login"
    });
});

//schedules an event on the user's google calendar
app.get("/google/calendar/schedule_event", async (req, res)=>{
    try {
        // console.log(oauth2Client.credentials.access_token)
        await calendar.events.insert({
            calendarId: 'primary',
            auth: oauth2Client,
            requestBody: {
                summary: 'Test event',
                description: 'This is a test event',
                start: {
                    dateTime: dayjs().add(1, 'day').format(),
                    timeZone: 'America/New_York'
                },
                end: {
                    dateTime: dayjs().add(1, 'day').add(1, 'hour').format(),
                    timeZone: 'America/New_York'
                }
            }
        })

        res.send('Event scheduled')
    } catch (error) {
        console.log(error)
        fiveHundredErr(error, res)
    }
});

//deletes an event from the user's google calendar
app.get("/google/calendar/delete_event", async (req, res)=>{
    try {
        //get the lists of events first
        let events = await getListOfEventsFromGoogle('primary', oauth2Client, true, 'Test event', 3)
        console.log(events.data.items)

        //delete the first event in the list based on the id
        await calendar.events.delete({
            calendarId: 'primary',
            auth: oauth2Client,
            eventId: `${events.data.items[0].id}`
        })

        console.log(events.data.items[0])
        res.send('Event deleted')
    } catch (error) {
        console.log(error)
        fiveHundredErr(error, res)
    }
});

//starts the server on the specified port
app.listen(PORT, ()=>{
    console.log(`server running on port ${PORT}`)
});

function fiveHundredErr(err, res){
    res.status(500).send(err)
}

function getListOfEventsFromGoogle(calendarId, auth, singleEvents, q, maxResults){
    return calendar.events.list({
        calendarId: calendarId,
        auth: auth,
        singleEvents: singleEvents,
        // q can search for events with a specific description, summary, location, email
        q: q,
        maxResults: maxResults
    })
}