type Vote = {
    readonly id: string;
    readonly userId: string;
    readonly playerId: string;
    readonly hofChoice: boolean;
    readonly createdAt: dateTime;
    readonly updatedAt: dateTime;
};

type Results = {
    readonly hofYesPercent: number;
}

type VoteWithResults = Vote & Results;

type VoteRow = {
    readonly id: string;
    readonly user_id: string;
    readonly player_id: string;
    readonly hof_choice: boolean;
    readonly created_at: string;
    readonly updated_at: string;
};

type ResultsRow = {
    hof_yes_percent: string;
}

type VoteRowWithResults = VoteRow & ResultsRow;

type VotePayload = {
    readonly playerId: number;
    readonly hofChoice: boolean;
};

type UserIdPayload = {
    readonly userId: string;
};

type VotePayloadWithUserId = VotePayload & UserIdPayload;