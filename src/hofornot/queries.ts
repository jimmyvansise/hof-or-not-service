import { TABLES } from "../enums";

export const SELECT_PLAYER_BY_PLAYER_ID = `
    SELECT * FROM ${TABLES.PLAYERS}
    WHERE player_id = $1
`;

export const UPSERT_VOTE = `
    INSERT INTO ${TABLES.VOTES}
    ( user_id, player_id, hof_choice )
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id, player_id) DO UPDATE SET
    hof_choice=$3
    RETURNING *
`;