import { GraphQLError } from "graphql";
import { ApolloServerErrorCode } from "@apollo/server/errors";
import admin from "firebase-admin";
import { collection, get, set } from "typesaurus";
import { Nonce } from "../../generated/graphql";
import config from "../../../config";
import { createLogger } from "../../logger/createLogger";

const logger = createLogger();

const getNonceToSign = async (walletAddress: string): Promise<Nonce> => {
  const noncesEntries = collection<Nonce>(config.noncesCollection);

  try {
    const res = await get(noncesEntries, walletAddress);

    if (!res) {
      // The user document does not exist, create it first
      const generatedNonce = Math.floor(Math.random() * 1000000);

      // Create an Auth user
      await admin.auth().createUser({
        uid: walletAddress,
      });

      await set(noncesEntries, walletAddress, { nonce: generatedNonce });

      return { nonce: generatedNonce };
    } else {
      // The nonce document exists already, return the nonce
      return res.data;
    }
  } catch (error) {
    logger.error({ error });
    throw new GraphQLError(`${walletAddress} error getting nonce to sign`, {
      extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
    });
  }
};

export default getNonceToSign;
