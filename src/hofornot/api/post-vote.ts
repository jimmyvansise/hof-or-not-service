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
        const maybeVoteAndResults = await upsertVote(writeClient, userId, playerId, hofChoice);

        if (!maybeVoteAndResults.ok) {
            logger.error(
                `[postVote] could not vote. ${errorToString(maybeVoteAndResults.error)}`
            );
            return res.status(maybeVoteAndResults.status).send(
                errorToString(maybeVoteAndResults.error)
            );
        }
    
        return res.status(maybeVoteAndResults.status)
                .cookie('userId', userId, { maxAge: 800000000000 })
                .send({ ...maybeVoteAndResults.value });
    }
    finally {
        writeClient.release();
    }
};
