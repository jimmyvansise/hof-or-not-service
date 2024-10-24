CREATE TABLE votes (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    player_id INTEGER REFERENCES players(player_id),
    hof_choice BOOLEAN NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(user_id, player_id)
);
-- TODO: Add Indexes