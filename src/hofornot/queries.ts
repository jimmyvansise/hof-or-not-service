import { TABLES } from "../enums";

const YEAR_OFFSET_FOR_RELATED = 8;

export const SELECT_PLAYER_BY_PLAYER_ID = `
    WITH relatedplayers AS (
    SELECT
        rp.player_id AS related_player_id,
        rp.first_name AS related_player_first_name,
        rp.last_name AS related_player_last_name,
        rp.picture AS related_player_picture,
        ROW_NUMBER() OVER (ORDER BY RANDOM()) as rn
    FROM
        ${TABLES.PLAYERS} AS p
    LEFT JOIN
        ${TABLES.VOTES} AS v ON v.player_id = p.player_id AND v.user_id = $2
    LEFT JOIN
        ${TABLES.PLAYERS} AS rp ON ABS(COALESCE(rp.year_retired, EXTRACT(YEAR FROM CURRENT_DATE)) - 
            COALESCE(p.year_retired, EXTRACT(YEAR FROM CURRENT_DATE))) <= ${YEAR_OFFSET_FOR_RELATED}
    WHERE
        p.player_id = $1
        AND rp.player_id != p.player_id
        AND (
            (LENGTH(p.position) = 1 AND LENGTH(rp.position) = 1 AND p.position = rp.position) OR
            (LENGTH(p.position) > 1 AND LENGTH(rp.position) > 1 AND (p.position LIKE '%' || rp.position || '%' OR rp.position LIKE '%' || p.position || '%'))
        )
    ),
    limited_relatedplayers AS (
    SELECT *
    FROM relatedplayers
    WHERE rn <= 3
    ),
    related_player_votes AS (
    SELECT
        lrp.related_player_id,
        COALESCE(100 * COUNT(*) FILTER (WHERE v.hof_choice = TRUE) / NULLIF(COUNT(*), 0), 0) AS hof_yes_percent_related
    FROM limited_relatedplayers lrp
    LEFT JOIN ${TABLES.VOTES} v ON lrp.related_player_id = v.player_id
    GROUP BY lrp.related_player_id
    )
    SELECT
        p.*,
        v.hof_choice,
        MAX(CASE WHEN lrp.rn = 1 THEN related_player_first_name END) AS related_player_first_name_1,
        MAX(CASE WHEN lrp.rn = 1 THEN related_player_last_name END) AS related_player_last_name_1,
        MAX(CASE WHEN lrp.rn = 1 THEN related_player_picture END) AS related_player_picture_1,
        MAX(CASE WHEN lrp.rn = 1 THEN rpv.hof_yes_percent_related END) AS related_player_hof_yes_percent_1,
        MAX(CASE WHEN lrp.rn = 2 THEN related_player_first_name END) AS related_player_first_name_2,
        MAX(CASE WHEN lrp.rn = 2 THEN related_player_last_name END) AS related_player_last_name_2,
        MAX(CASE WHEN lrp.rn = 2 THEN related_player_picture END) AS related_player_picture_2,
        MAX(CASE WHEN lrp.rn = 2 THEN rpv.hof_yes_percent_related END) AS related_player_hof_yes_percent_2,
        MAX(CASE WHEN lrp.rn = 3 THEN related_player_first_name END) AS related_player_first_name_3,
        MAX(CASE WHEN lrp.rn = 3 THEN related_player_last_name END) AS related_player_last_name_3,
        MAX(CASE WHEN lrp.rn = 3 THEN related_player_picture END) AS related_player_picture_3,
        MAX(CASE WHEN lrp.rn = 3 THEN rpv.hof_yes_percent_related END) AS related_player_hof_yes_percent_3
    FROM
        ${TABLES.PLAYERS} AS p
    LEFT JOIN
        ${TABLES.VOTES} AS v ON v.player_id = p.player_id AND v.user_id = $2
    LEFT JOIN
        limited_relatedplayers AS lrp ON 1=1
    LEFT JOIN
        related_player_votes rpv ON lrp.related_player_id = rpv.related_player_id
    WHERE p.player_id = $1
    GROUP BY p.player_id, v.hof_choice;
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

