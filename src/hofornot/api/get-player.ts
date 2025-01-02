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
        })
    }
    finally {
        readClient.release();
    }
};
