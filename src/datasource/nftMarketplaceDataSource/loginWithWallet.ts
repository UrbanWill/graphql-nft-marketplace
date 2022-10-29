import { GraphQLError } from "graphql";
import admin from "firebase-admin";
import { collection, update, get } from "typesaurus";
import {
  Token,
  Nonce,
  MutationLoginWithWalletArgs,
} from "../../generated/graphql";
import config from "../../../config";
import { ethers } from "ethers";
import { createLogger } from "../../logger/createLogger";

const logger = createLogger();

const loginWithWallet = async ({
  walletAddress,
  message,
  signedMessage,
}: MutationLoginWithWalletArgs): Promise<Token> => {
  const noncesEntries = collection<Nonce>(config.noncesCollection);

  const {
    data: { nonce },
  } = await get(noncesEntries, walletAddress);

  /** checks if the sign in attempt is a replay attack */
  if (message !== String(nonce)) {
    logger.warn(`Wallet address: ${walletAddress} invalid nonce`);
    throw new GraphQLError(`Wallet address: ${walletAddress} invalid nonce`, {
      extensions: { code: "INVALID_NONCE" },
    });
  }

  /** recovers signature from signed message */
  const msgHash = ethers.utils.hashMessage(String(nonce));
  const msgHashBytes = ethers.utils.arrayify(msgHash);
  const recoveredAddress = ethers.utils.recoverAddress(
    msgHashBytes,
    signedMessage
  );

  const isSignatureValid = recoveredAddress === walletAddress;

  if (!isSignatureValid) {
    logger.warn(`Wallet address: ${walletAddress} invalid signature`);
    throw new GraphQLError(
      `Wallet address: ${walletAddress} Invalid signature`,
      {
        extensions: { code: "INVALID_SIGNATURE" },
      }
    );
  }

  try {
    /** Updates nonce to prevent replay attacks */
    const generatedNonce = Math.floor(Math.random() * 1000000);
    await update(collection<Nonce>(config.noncesCollection), recoveredAddress, {
      nonce: generatedNonce,
    });

    const firebaseToken = await admin
      .auth()
      .createCustomToken(recoveredAddress);
    return { token: firebaseToken };
  } catch (error) {
    logger.warn(
      `Wallet address: ${walletAddress} failed to generate token. Error: ${error}`
    );
    throw new GraphQLError(
      `Wallet address: ${walletAddress} failed to generate token, Error: ${error}`,
      {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      }
    );
  }
};

export default loginWithWallet;
