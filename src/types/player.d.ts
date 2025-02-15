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

type RelatedPlayers = {
    readonly relatedPlayer1FirstName: string;
    readonly relatedPlayer1LastName: string;
    readonly relatedPlayer1Picture: string;
    readonly relatedPlayer1HofYesPercent: number;
    readonly relatedPlayer2FirstName: string;
    readonly relatedPlayer2LastName: string;
    readonly relatedPlayer2Picture: string;
    readonly relatedPlayer2HofYesPercent: number;
    readonly relatedPlayer3FirstName: string;
    readonly relatedPlayer3LastName: string;
    readonly relatedPlayer3Picture: string;
    readonly relatedPlayer3HofYesPercent: number;
}

type PlayerWithHofChoiceRelatedPlayers = Player & HofChoice & RelatedPlayers;

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

type RelatedPlayersRow = {
    readonly related_player_first_name_1: string;
    readonly related_player_last_name_1: string;
    readonly related_player_picture_1: string;
    readonly related_player_hof_yes_percent_1: string; 
    readonly related_player_first_name_2: string;
    readonly related_player_last_name_2: string;
    readonly related_player_picture_2: string;
    readonly related_player_hof_yes_percent_2: string; 
    readonly related_player_first_name_3: string;
    readonly related_player_last_name_3: string;
    readonly related_player_picture_3: string;
    readonly related_player_hof_yes_percent_3: string;
}

type PlayerWithHofChoiceAndRelatedPlayersRow = PlayerRow & HofChoiceRow & RelatedPlayersRow;

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