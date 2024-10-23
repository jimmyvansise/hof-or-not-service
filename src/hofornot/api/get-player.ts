import { Request, RequestHandler, Response } from 'express';

import { reader } from '../../rest-api/env';
import { errorToString, logger } from '../../utils/helpers';
import { selectPlayer } from '../player';

import { parseGetPlayerPayload } from './get-player.parser';

export const getPlayer: RequestHandler = async (
    req: Readonly<Request>,
    res: Readonly<Response>,
) => {
    const maybeGetPlayerPayload = parseGetPlayerPayload(req);

    if (!maybeGetPlayerPayload.ok) {
        logger.error(
            `[getPlayer] failed to parse payload: ${errorToString(
                maybeGetPlayerPayload.error)}`
        );
        return res.status(maybeGetPlayerPayload.status).send('Unable to parse payload');
    }

    const { playerId } = maybeGetPlayerPayload.value;

    const readClient = await reader();

    try {
        const maybeExistingPlayer = await selectPlayer(readClient, playerId);

        if (!maybeExistingPlayer.ok) {
            logger.error(
                `[getPlayer] could not select player. ${errorToString(maybeExistingPlayer.error)}`
            );
            return res.status(maybeExistingPlayer.status).send(
                errorToString(maybeExistingPlayer.error)
            );
        }
    
        return res.status(maybeExistingPlayer.status).send({
            id: maybeExistingPlayer.value.playerId, 
            firstName: maybeExistingPlayer.value.firstName,
            lastName: maybeExistingPlayer.value.lastName,
            nickname: maybeExistingPlayer.value.nickname,
            position: maybeExistingPlayer.value.position,
            superBowlWins: maybeExistingPlayer.value.superBowlWins,
            proBowls: maybeExistingPlayer.value.proBowls,
            mvps: maybeExistingPlayer.value.mvps,
            yearRetired: maybeExistingPlayer.value.yearRetired,
            picture: maybeExistingPlayer.value.picture,
        })
    }
    finally {
        readClient.release();
    }
};
