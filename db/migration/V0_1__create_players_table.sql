CREATE TABLE players (
    player_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    nickname VARCHAR(50) NOT NULL,
    position VARCHAR(5) NOT NULL,
    super_bowl_wins SMALLINT DEFAULT 0,
    pro_bowls SMALLINT DEFAULT 0,
    mvps SMALLINT DEFAULT 0,
    year_retired SMALLINT DEFAULT NULL,
    picture TEXT DEFAULT NULL
);