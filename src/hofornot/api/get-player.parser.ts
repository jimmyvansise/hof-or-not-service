import { Request } from 'express';

import { parsePlayerIdParameterFromRequest, toSuccess} from '../../utils/helpers';

export const parseGetPlayerPayload = (
    req: Readonly<Request>,
): Either<Error, PlayerIdPayload> => {
    const maybePlayerId = parsePlayerIdParameterFromRequest(req);
    if (!maybePlayerId.ok) {
        return maybePlayerId;
    }

    return toSuccess(201, { playerId: maybePlayerId.value });
};