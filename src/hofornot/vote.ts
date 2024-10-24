import { PoolClient } from 'pg';
import { toFailure, toSuccess } from '../utils/helpers';
import moment from 'moment';

import { UPSERT_VOTE } from './queries';

const _normalize = (voteRow: VoteRow): Vote => {
    return { 
        id: voteRow.id,
        userId: voteRow.user_id,
        playerId: voteRow.player_id,
        hofChoice: voteRow.hof_choice === 'true',
        updatedAt:  moment(voteRow.updated_at),
        createdAt: moment(voteRow.created_at),
    }
};

export const upsertVote = async (
    client: Readonly<PoolClient>,
    userId: string,
    playerId: number,
    hofChoice: boolean,
): Promise<Either<Error, Vote>> => 
    client.query<VoteRow>(UPSERT_VOTE, [
        userId, 
        playerId,
        hofChoice,
    ]).then((result) => {
        if (result.rows.length === 1) {
            return toSuccess(200, _normalize(result.rows[0]));
        }
        else {
            return toFailure(404, 
                `[postVote] Failed to vote for user id: ${userId}, playerId: ${playerId}, vote: ${hofChoice}`
            );
        }
    }).catch((err) => {
        return toFailure(500, 
            `[postVote] Error when voting for user id: ${userId}, playerId: ${playerId}, vote: ${hofChoice}. Error: ${err.message}`
        );
    });