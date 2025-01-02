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

type HofChoice = {
    readonly hofChoice: boolean | null;
}

type PlayerWithHofChoice = Player & HofChoice;

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

type HofChoiceRow = {
    readonly hof_choice: boolean | null;
}

type PlayerWithHofChoiceRow = PlayerRow & HofChoiceRow;

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

type UserIdPayload = {
    readonly userId: string;
};

type PlayerIdUserIdPayload = PlayerIdPayload & UserIdPayload;

type PlayerPayloadWithPlayerId = PlayerPayload & PlayerIdPayload;