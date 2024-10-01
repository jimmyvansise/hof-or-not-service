type Player = {
    readonly playerId: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly nickname: string;
    readonly yearRetired: number;
};

type PlayerRow = {
    readonly player_id: string;
    readonly first_name: string;
    readonly last_name: string;
    readonly nickname: string;
    readonly year_retired: string;
};

type PlayerPayload = {
    readonly firstName: string;
    readonly lastName: string;
    readonly nickname: string;
    readonly yearRetired: number;
};

type PlayerIdPayload = {
    readonly playerId: string;
};

type PlayerPayloadWithPlayerId = PlayerPayload & PlayerIdPayload;
/*
CREATE TABLE players (
    player_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    nickname VARCHAR(50) NOT NULL,
    year_retired SMALLINT DEFAULT NULL
);
*/