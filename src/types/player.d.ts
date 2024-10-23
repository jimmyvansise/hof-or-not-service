type Player = {
    readonly playerId: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly nickname: string;
    readonly position: string;
    readonly superBowlWins: number;
    readonly proBowls: number;
    readonly mvps: number;
    readonly yearRetired: number;
    readonly picture: string;
};

type PlayerRow = {
    readonly player_id: string;
    readonly first_name: string;
    readonly last_name: string;
    readonly nickname: string;
    readonly position: string;
    readonly super_bowl_wins: string;
    readonly pro_bowls: string;
    readonly mvps: string;
    readonly year_retired: string;
    readonly picture: string;
};

type PlayerPayload = {
    readonly firstName: string;
    readonly lastName: string;
    readonly nickname: string;
    readonly position: string;
    readonly superBowlWins: number;
    readonly proBowls: number;
    readonly mvps: number;
    readonly yearRetired: number;
    readonly picture: string;
};

type PlayerIdPayload = {
    readonly playerId: string;
};

type PlayerPayloadWithPlayerId = PlayerPayload & PlayerIdPayload;