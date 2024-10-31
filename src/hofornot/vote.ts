import { PoolClient } from 'pg';
import { toFailure, toSuccess } from '../utils/helpers';
import moment from 'moment';

import { UPSERT_VOTE, SELECT_HOF_YES_PERCENT } from './queries';

const _normalize = (voteRow: VoteRowWithResults): VoteWithResults => {
    return { 
        id: voteRow.id,
        userId: voteRow.user_id,
        playerId: voteRow.player_id,
        hofChoice: voteRow.hof_choice,
        updatedAt:  moment(voteRow.updated_at),
        createdAt: moment(voteRow.created_at),
        hofYesPercent: parseInt(voteRow.hof_yes_percent),
    }
};

export const upsertVote = async (
    client: Readonly<PoolClient>,
    userId: string,
    playerId: number,
    hofChoice: boolean,
): Promise<Either<Error, VoteWithResults>> => 
    client.query<VoteRowWithResults>(UPSERT_VOTE, [
        userId, 
        playerId,
        hofChoice,
    ]).then((upsertResult) => {
        if (upsertResult.rows.length === 1) {
            return client.query<ResultsRow>(SELECT_HOF_YES_PERCENT, [
                playerId
            ]).then((selectResult) => {
                if (selectResult.rows.length === 1) {
                    return toSuccess(200, _normalize({...upsertResult.rows[0], ...selectResult.rows[0]}));
                }
                else {
                    return toFailure(404, 
                        `[postVote] Failed to select results for user id: ${userId}, playerId: ${playerId}, vote: ${hofChoice}`
                    );
                }
            }).catch((err) => {
                return toFailure(500, 
                    `[postVote] Error when selecting results for user id: ${userId}, playerId: ${playerId}, vote: ${hofChoice}. Error: ${err.message}`
                );
            });
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