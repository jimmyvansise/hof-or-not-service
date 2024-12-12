import { Request, RequestHandler, Response } from 'express';
import { reader } from '../../rest-api/env';
import { errorToString, logger } from '../../utils/helpers';
import { selectPlayerNames } from '../player';

export const getPlayerNames: RequestHandler = async (
    req: Readonly<Request>,
    res: Readonly<Response>,
) => {
    const readClient = await reader();

    try {
        const maybeExistingPlayerNames = await selectPlayerNames(readClient);

        if (!maybeExistingPlayerNames.ok) {
            logger.error(
                `[getPlayerNames] could not select players. ${errorToString(maybeExistingPlayerNames.error)}`
            );
            return res.status(maybeExistingPlayerNames.status).send(
                errorToString(maybeExistingPlayerNames.error)
            );
        }
    
        return res.status(maybeExistingPlayerNames.status).send(maybeExistingPlayerNames.value);
    }
    finally {
        readClient.release();
    }
};
