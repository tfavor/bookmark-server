CREATE TYPE star_rating AS ENUM ('1', '2', '3', '4', '5');

CREATE TABLE bookmarks (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    URL TEXT NOT NULL,
    description TEXT,
    rating star_rating NOT NULL 
)