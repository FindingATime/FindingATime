insert into Users
  (id, name)
values
  ('00569fb6-acee-4edc-93c0-09ac8b814daf', 'Sutton Gibson'),
  ('fb511b72-8d6d-450c-be69-dd5e82dfda5b', 'Tyler Williams'),
  ('9e33186f-95db-4385-a974-ee38c8e07547', 'Bryson Glenn');

insert into Events
  (id, title, description, starttime, endtime, location, timezone, mode, config, creator)
values
  (
  '0e2f547c-1dd1-4ea2-a7df-80eefd18b94c',
  'Bowling', 
  'Bowling event', 
  '2024-07-12T23:11:25.000Z', 
  '2024-07-12T23:11:25.000Z', 
  'Bowling alley', 
  'PST', 
  'weekly', 
  ('{
    "Mon": true,
    "Tue": true,
    "Wed": false,
    "Thu": false,
    "Fri": false,
    "Sat": false,
    "Sun": false
  }'), 
  '00569fb6-acee-4edc-93c0-09ac8b814daf'),
  (
  '3301bfc2-43f3-43cc-8e25-856eee164012',
  'Reading Club', 
  'Reading club meeting', 
  '2024-07-12T23:11:25.000Z', 
  '2024-07-12T23:11:25.000Z', 
  'Library', 
  'UTC', 
  'specific', 
  ('{"days": ["2024-01-01"]}'), 
  '9e33186f-95db-4385-a974-ee38c8e07547'
  ),
  (
  '422b9945-e8c6-4a30-85d9-933a9a46a389',
  'Track Meet', 
  'Track', 
  '2024-07-12T23:11:25.000Z', 
  '2024-07-12T23:11:25.000Z', 
  'Track field', 
  'EST', 
  'weekly', 
  ('{
  "Mon": true,
  "Tue": true,
  "Wed": false,
  "Thu": false,
  "Fri": false,
  "Sat": false,
  "Sun": false
  }'), 
  '9e33186f-95db-4385-a974-ee38c8e07547'
  );

insert into Attendees
  (eventid, attendee, timesegments)
values
  ('422b9945-e8c6-4a30-85d9-933a9a46a389', 
  '9e33186f-95db-4385-a974-ee38c8e07547', 
  ('{
    "Mon": [],
    "Tue": [
      {
        "beginning":"09:00",
        "end":"10:00",
        "type":"Preferred"
      },
      {
        "beginning":"11:00",
        "end":"12:00",
        "type":"Regular"
        }
      ], 
    "Wed": [],
    "Thu": [],
    "Fri": [],
    "Sat": [],
    "Sun": []
  }')
  ),
  ('0e2f547c-1dd1-4ea2-a7df-80eefd18b94c', 
  '9e33186f-95db-4385-a974-ee38c8e07547',
    ('{
    "Mon": [],
    "Tue": [
      {
        "beginning":"09:00",
        "end":"10:00",
        "type":"Preferred"
      },
      {
        "beginning":"11:00",
        "end":"12:00",
        "type":"Regular"
        }
      ], 
    "Wed": [],
    "Thu": [],
    "Fri": [],
    "Sat": [],
    "Sun": []
  }')
  ),
  ('3301bfc2-43f3-43cc-8e25-856eee164012', 
  '9e33186f-95db-4385-a974-ee38c8e07547', 
    ('{
    "Aug 10": [],
    "Aug 11": [
      {
        "beginning":"09:00",
        "end":"10:00",
        "type":"Preferred"
      },
      {
        "beginning":"11:00",
        "end":"12:00",
        "type":"Regular"
        }
      ], 
    "Aug 12": [],
    "Aug 15": []
  }')
  ), 
  ('3301bfc2-43f3-43cc-8e25-856eee164012', 
  'fb511b72-8d6d-450c-be69-dd5e82dfda5b', 
    ('{
    "Aug 10": [],
    "Aug 11": [
      {
        "beginning":"09:00",
        "end":"10:00",
        "type":"Preferred"
      },
      {
        "beginning":"11:00",
        "end":"12:00",
        "type":"Regular"
        }
      ], 
    "Aug 12": [],
    "Aug 15": []
  }')
  );