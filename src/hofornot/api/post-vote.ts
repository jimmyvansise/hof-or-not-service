import { Request, RequestHandler, Response } from 'express';

import { writer } from '../../rest-api/env';
import { errorToString, logger } from '../../utils/helpers';
import { parsePostVotePayload } from './post-vote.parser';
import { upsertVote } from '../vote';

export const postVote: RequestHandler = async (
    req: Readonly<Request>,
    res: Readonly<Response>,
) => {
    const maybePostVotePayload = parsePostVotePayload(req);

    if (!maybePostVotePayload.ok) {
        logger.error(
            `[postVote] failed to parse payload: ${errorToString(maybePostVotePayload.error)}`
        );
        return res.status(maybePostVotePayload.status).send('Unable to parse payload');
    }

    const { userId, playerId, hofChoice } = maybePostVotePayload.value;

    const writeClient = await writer();

    try {
        const maybeVote = await upsertVote(writeClient, userId, playerId, hofChoice);

        if (!maybeVote.ok) {
            logger.error(
                `[postVote] could not vote. ${errorToString(maybeVote.error)}`
            );
            return res.status(maybeVote.status).send(
                errorToString(maybeVote.error)
            );
        }
    
        //TODO: Send vote results back for the player they voted for...
        // or create another endpoint for vote results for a player
        // or do both of the above
        return res.status(maybeVote.status)
                .cookie('userId', userId, { maxAge: 800000000000 })
                .send({ ...maybeVote.value });
    }
    finally {
        writeClient.release();
    }
};
