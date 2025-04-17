/**
 * Verifies Google ID Token and extracts user ID.
 */
async function verifyToken(idToken) {
    try {
        const response = await fetch(
            `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const payload = await response.json();
        if (!payload.sub) {
            throw new Error('Invalid ID Token');
        }

        return payload.sub; // Return user ID
    } catch (error) {
        console.error('Token verification failed:', error);
        throw new Error('Unauthorized');
    }
}

/**
 * Creates a Google Calendar event.
 */
async function createEvent(accessToken, eventDetails) {
    try {
        const response = await fetch(
            'https://www.googleapis.com/calendar/v3/calendars/primary/events',
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(eventDetails),
            }
        );

        //console.log("Full API Response:", response);

        if (!response.ok) {
            try {
                const errorBody = await response.json(); // Attempt to parse as JSON
                console.error("API Error Body (JSON):", errorBody);
                throw new Error(`HTTP error! status: ${response.status}, Error: ${JSON.stringify(errorBody)}`);
            } catch (jsonError) {
                // If parsing as JSON fails, try parsing as plain text
                const errorText = await response.text();
                console.error("API Error Body (Text):", errorText);
                throw new Error(`HTTP error! status: ${response.status}, Error: ${errorText}`);
            }

        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating event:', error);
        throw new Error('Failed to create event');
    }
}

async function updateEvent(accessToken, eventId, eventDetails) {
    try {
        const response = await fetch(
            `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
            {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(eventDetails),
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating event:', error);
        throw new Error('Failed to update event');
    }
}

async function deleteEvent(accessToken, eventId) {
    try {
        const response = await fetch(
            `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
            {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${accessToken}` },
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return { message: 'Event deleted successfully' };
    } catch (error) {
        console.error('Error deleting event:', error);
        throw new Error('Failed to delete event');
    }
}

/**
 * Lists events from Google Calendar.
 --
    Note: Google Calendar wants the UTC timezone instead, so we have to convert our timezone into UTC
    EST: today 12:00AM EST -> today 04:00AM UTC and today 11:59PM EST -> tomorrow 03:59AM UTC
*/
async function listEvents(accessToken, maxResults = 10) {
    try {
        const date = new Date(); // Current time in UTC
        const start = new Date(date.setHours(0,0,0,0)); // 4AM today UTC
        const end = new Date(date.setHours(23,59,59,999)); // 3:59AM tomorrow UTC

        const timeMin = start.toISOString();
        const timeMax = end.toISOString(); 

        const response = await fetch(
            // `https://www.googleapis.com/calendar/v3/calendars/primary/events?q=tinyTasksTitle='TinyTasks'&maxResults=${maxResults}&singleEvents=true&orderBy=startTime`,
            `https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=${maxResults}&singleEvents=true&orderBy=startTime&timeMin=${timeMin}&timeMax=${timeMax}`,
            //https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=${maxResults}&singleEvents=true&orderBy=startTime
            // `https://www.googleapis.com/calendar/v3/calendars/primary/events?q=tinyTasksTitle='TinyTasks'&maxResults=${maxResults}&orderBy=startTime`,
            {
                method: 'GET',
                headers: { Authorization: `Bearer ${accessToken}` },
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); 
        let validEvents = [];
        for (let i = 0; i < data.items.length; i++) {
            if (data.items[i].start.dateTime) {
                validEvents.push(data.items[i]);
            }
        }

        return validEvents;
    } catch (error) {
        console.error('Error retrieving events: ', error);
        throw new Error('Failed to retrieve events');
    }
}


export { verifyToken, createEvent, updateEvent, deleteEvent, listEvents };
