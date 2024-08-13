create table
Attendees (
id uuid primary key default gen_random_uuid(),
eventid uuid references Events(id),
attendee uuid references Users(id),
timesegments json
);