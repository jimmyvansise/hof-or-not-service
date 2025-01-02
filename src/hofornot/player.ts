import { PoolClient } from 'pg';

import { toFailure, toSuccess } from '../utils/helpers';

import { SELECT_PLAYER_BY_PLAYER_ID, SELECT_PLAYER_NAMES } from './queries';

const _normalize = (playerRow: PlayerWithHofChoiceRow): PlayerWithHofChoice => {
    return { 
        playerId: playerRow.player_id, 
        firstName: playerRow.first_name,
        lastName: playerRow.last_name,
        nickname: playerRow.nickname,
        position: playerRow.position,
        superBowlWins: parseInt(playerRow.super_bowl_wins),
        proBowls: parseInt(playerRow.pro_bowls),
        mvps: parseInt(playerRow.mvps),
        yearRetired: parseInt(playerRow.year_retired),
        picture: playerRow.picture,
        hofChoice: playerRow.hof_choice
    }
};

const _normalizePlayerNameRow = (playerNameRow: PlayerNameRow): PlayerName => {
    return { 
        playerId: playerNameRow.player_id, 
        name: playerNameRow.name,
    }
};

export const selectPlayer = async (
    client: Readonly<PoolClient>,
    playerId: string,
    userId: string | undefined,
): Promise<Either<Error, PlayerWithHofChoice>> => 
    client.query<PlayerWithHofChoiceRow>(SELECT_PLAYER_BY_PLAYER_ID, [
        playerId,
        userId,
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

export const selectPlayerNames = async (
    client: Readonly<PoolClient>
): Promise<Either<Error, PlayerName[]>> => 
    client.query<PlayerNameRow>(
        SELECT_PLAYER_NAMES
    ).then((result) => {
        if (result.rows.length > 0) {
            return toSuccess(200, result.rows.map(r => _normalizePlayerNameRow(r)));
        }
        else {
            return toFailure(404, 
                `[selectPlayerNames] Failed to select players. No rows found.`
            );
        }
    }).catch((err) => {
        return toFailure(500, 
            `[selectPlayerNames] Error when selecting players. Error: ${err.message}`
        );
    });