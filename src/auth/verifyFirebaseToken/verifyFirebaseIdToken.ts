import admin from "firebase-admin";
import { createLogger } from "../../logger/createLogger";
import { User } from "../../generated/graphql";

const logger = createLogger();

export const verifyFirebaseIdToken = async ({
  idToken,
}: {
  idToken: string;
}): Promise<User> => {
  try {
    const { uid, role } = await admin.auth().verifyIdToken(idToken);

    const user = { id: uid, role };

    return user;
  } catch (error) {
    logger.error(error);
    throw new Error(`INVALID_ID_TOKEN ${idToken}`);
  }
};
