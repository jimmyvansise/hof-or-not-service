type Vote = {
    readonly id: string;
    readonly userId: string;
    readonly playerId: string;
    readonly hofChoice: boolean;
    readonly createdAt: dateTime;
    readonly updatedAt: dateTime;
};

type VoteRow = {
    readonly id: string;
    readonly user_id: string;
    readonly player_id: string;
    readonly hof_choice: string;
    readonly created_at: string;
    readonly updated_at: string;
};

type VotePayload = {
    readonly playerId: number;
    readonly hofChoice: boolean;
};

type userIdPayload = {
    readonly userId: string;
};

type VotePayloadWithUserId = VotePayload & userIdPayload;