import { TABLES } from "../enums";

export const SELECT_PLAYER_BY_PLAYER_ID = `
    SELECT * FROM ${TABLES.PLAYERS}
    WHERE player_id = $1
`;