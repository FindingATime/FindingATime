create table
Events (
id uuid primary key default gen_random_uuid(),
title text,
description text,
starttime text,
endtime text,
location text,
timezone text,
mode text,
config json,
creator uuid references Users(id),
-- new column to to create a link that can be shared
shareable_link text
);