import { TABLES } from "../enums";

export const SELECT_PLAYER_BY_PLAYER_ID = `
    SELECT * FROM ${TABLES.PLAYERS}
    WHERE player_id = $1
`;

export const SELECT_PLAYER_NAMES = `
    SELECT player_id, first_name || last_name AS name FROM ${TABLES.PLAYERS}
`;

export const UPSERT_VOTE = `
    INSERT INTO ${TABLES.VOTES}
    ( user_id, player_id, hof_choice )
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id, player_id) DO UPDATE SET
    hof_choice=$3
    RETURNING *
`;

export const SELECT_HOF_YES_PERCENT = `
    WITH vote_counts AS (
        SELECT
        COUNT(*) FILTER (WHERE hof_choice = TRUE) AS total_yes_votes,
        COUNT(*) FILTER (WHERE hof_choice = FALSE) AS total_no_votes
        FROM ${TABLES.VOTES}
        WHERE player_id = $1
    )
    SELECT
    *,
    100 * total_yes_votes / NULLIF(total_yes_votes + total_no_votes, 0) AS hof_yes_percent
    FROM vote_counts;
`;

