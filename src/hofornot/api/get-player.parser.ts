import { Request } from 'express';

import { parsePlayerIdParameterFromRequest, toSuccess} from '../../utils/helpers';

export const parseGetPlayerPayload = (
    req: Readonly<Request>,
): Either<Error, PlayerIdUserIdPayload> => {
    const maybePlayerId = parsePlayerIdParameterFromRequest(req);
    if (!maybePlayerId.ok) {
        return maybePlayerId;
    }

    let userId = req.cookies?.userId;

    return toSuccess(201, { playerId: maybePlayerId.value, userId });
};