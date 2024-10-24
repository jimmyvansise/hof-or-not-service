import { Request } from 'express';
import winston from 'winston';
import { z, ZodError, ZodIssue } from 'zod';

export const toFailure = (status: number, message: string): Failure<Error> => ({
    ok: false,
    status,
    error: new Error(message)
});

export const toSuccess = <T>(status: number, value: T): Success<T> => ({
    ok: true,
    status,
    value,
});

export const errorToString = (err: Readonly<Error>) =>
    JSON.stringify(err, Object.getOwnPropertyNames(err));

const zodIssueToString = (issue: Readonly<ZodIssue>) =>
    issue.path.length
        ? `\`${issue.path.join('.')}\`: ${issue.message}`
        : issue.message;

export const zodErrorToString = <T>(error: Readonly<ZodError<T>>) =>
    error.issues.map(zodIssueToString).join('; ');

export const parsePlayerIdParameterFromRequest = (
    req: Readonly<Request>,
): Either<Error, string> => {
    const maybePlayerId = z
        .object({
            playerId: z.string(),
        })
        .safeParse(req.params);

    return maybePlayerId.success
        ? {
            ok: true,
            status: 200,
            value: maybePlayerId.data.playerId,
        }
        : {
            ok: false,
            status: 400,
            error: new Error(zodErrorToString(maybePlayerId.error)),
        };
};

export const parseUserIdParameterFromRequest = (
    req: Readonly<Request>,
): Either<Error, string> => {
    const maybeUserId = z
        .object({
            userId: z.string(),
        })
        .safeParse(req.params);

    return maybeUserId.success
        ? {
            ok: true,
            status: 200,
            value: maybeUserId.data.userId,
        }
        : {
            ok: false,
            status: 400,
            error: new Error(zodErrorToString(maybeUserId.error)),
        };
};

export const logger = winston.createLogger({
    level: 'info',
    transports: [new winston.transports.Console()],
});