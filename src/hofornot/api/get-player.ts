import { Request, RequestHandler, Response } from 'express';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { reader } from '../../rest-api/env';
import { errorToString, logger } from '../../utils/helpers';
import { selectPlayer } from '../player';
import { parseGetPlayerPayload } from './get-player.parser';
import dotenv from 'dotenv';

dotenv.config();

const accessKeyId = process.env.AWS_ACCESS_KEY_ID as string;
const secretAccessKey = process.env.SECRET_ACCESS_KEY as string;
const s3Client = new S3Client({
    region: 'us-east-2',
    credentials: {
        accessKeyId,
        secretAccessKey
    },
});

async function generatePresignedUrl(key: string) {
    if (!key.length) return '';

    const params = {
        Bucket: 'nfl-player-pictures',
        Key: key,
        Expires: 60 * 60 * 24 // 24 hours
    };

    const signedUrl = await getSignedUrl(s3Client, new GetObjectCommand(params), {
        expiresIn: 60 * 60 * 24,
    });

    return signedUrl;
}

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

    const { playerId, userId } = maybeGetPlayerPayload.value;

    const readClient = await reader();

    try {
        const maybeExistingPlayer = await selectPlayer(readClient, playerId, userId);
        
        if (!maybeExistingPlayer.ok) {
            logger.error(
                `[getPlayer] could not select player. ${errorToString(maybeExistingPlayer.error)}`
            );
            return res.status(maybeExistingPlayer.status).send(
                errorToString(maybeExistingPlayer.error)
            );
        }
        const presignedUrl = await generatePresignedUrl(maybeExistingPlayer.value.picture);
        const related1Url = await generatePresignedUrl(maybeExistingPlayer.value.relatedPlayer1Picture);
        const related2Url = await generatePresignedUrl(maybeExistingPlayer.value.relatedPlayer2Picture);
        const related3Url = await generatePresignedUrl(maybeExistingPlayer.value.relatedPlayer3Picture);
    
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
            picture: presignedUrl,
            hofChoice: maybeExistingPlayer.value.hofChoice,
            relatedPlayer1FirstName: maybeExistingPlayer.value.relatedPlayer1FirstName,
            relatedPlayer1LastName: maybeExistingPlayer.value.relatedPlayer1LastName,
            relatedPlayer1Picture: related1Url,
            relatedPlayer1HofYesPercent:  maybeExistingPlayer.value.relatedPlayer1HofYesPercent,
            relatedPlayer2FirstName: maybeExistingPlayer.value.relatedPlayer2FirstName,
            relatedPlayer2LastName: maybeExistingPlayer.value.relatedPlayer2LastName,
            relatedPlayer2Picture: related2Url,
            relatedPlayer2HofYesPercent:  maybeExistingPlayer.value.relatedPlayer2HofYesPercent,
            relatedPlayer3FirstName: maybeExistingPlayer.value.relatedPlayer3FirstName,
            relatedPlayer3LastName: maybeExistingPlayer.value.relatedPlayer3LastName,
            relatedPlayer3Picture: related3Url,
            relatedPlayer3HofYesPercent:  maybeExistingPlayer.value.relatedPlayer3HofYesPercent
        });
    }
    finally {
        readClient.release();
    }
};
