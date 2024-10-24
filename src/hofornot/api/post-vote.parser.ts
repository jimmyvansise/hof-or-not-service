import { Request } from 'express';
import { toSuccess, toFailure, zodErrorToString} from '../../utils/helpers';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const POST_VOTE_SCHEMA = z.
    object({
        playerId: z.number(),
        hofChoice: z.boolean(),
    })
    .strict();


export const parsePostVotePayload = (
    req: Readonly<Request>,
): Either<Error, VotePayloadWithUserId> => {
    let userId = req.cookies?.userId;
    if (!userId) {
        userId = uuidv4();
    }

    const maybeParsedBody = POST_VOTE_SCHEMA.safeParse(req.body);
    if (!maybeParsedBody.success) {
        return toFailure(400, zodErrorToString(maybeParsedBody.error));
    }

    return toSuccess(201, {
        ...maybeParsedBody.data,
        userId,
    });
};