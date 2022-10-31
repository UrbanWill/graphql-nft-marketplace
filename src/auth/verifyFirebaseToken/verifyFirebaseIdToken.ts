import admin from "firebase-admin";
import { createLogger } from "../../logger/createLogger";

const logger = createLogger();

export const verifyFirebaseIdToken = async ({
  idToken,
}: {
  idToken: string | undefined;
}): Promise<string> => {
  try {
    const verifiedToken = await admin.auth().verifyIdToken(idToken);
    return verifiedToken.uid;
  } catch (error) {
    logger.error(error);
    throw new Error(`INVALID_ID_TOKEN ${idToken}`);
  }
};
