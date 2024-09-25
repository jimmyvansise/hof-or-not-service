CREATE TABLE players (
    player_id UUID PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    nickname VARCHAR(50) NOT NULL,
    year_retired SMALLINT DEFAULT NULL
);