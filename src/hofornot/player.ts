import { PoolClient } from 'pg';

import { toFailure, toSuccess } from '../utils/helpers';

import { SELECT_PLAYER_BY_PLAYER_ID } from './queries';

const _normalize = (playerRow: PlayerRow): Player => {
    return { 
        playerId: playerRow.player_id, 
        firstName: playerRow.first_name,
        lastName: playerRow.last_name,
        nickname: playerRow.nickname,
        yearRetired: parseInt(playerRow.year_retired)
    }
};

export const selectPlayer = async (
    client: Readonly<PoolClient>,
    playerId: string,
): Promise<Either<Error, Player>> => 
    client.query<PlayerRow>(SELECT_PLAYER_BY_PLAYER_ID, [
        playerId,
    ]).then((result) => {
        if (result.rows.length === 1) {
            return toSuccess(200, _normalize(result.rows[0]));
        }
        else {
            return toFailure(404, 
                `[selectPlayer] Failed to select player for playerId ${playerId}. No rows found.`
            );
        }
    }).catch((err) => {
        return toFailure(500, 
            `[selectPlayer] Error when selecting player for playerId ${playerId}. Error: ${err.message}`
        );
    });