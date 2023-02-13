import { GraphQLError } from "graphql";
import admin from "firebase-admin";
import { collection, update, get, set } from "typesaurus";
import {
  UserWithToken,
  Nonce,
  User,
  MutationLoginWithWalletArgs,
  Role,
} from "../../generated/graphql";
import config from "../../../config";
import { ethers } from "ethers";
import { getUserToken } from "../../services/AuthService";

const loginWithWallet = async ({
  walletAddress,
  message,
  signedMessage,
}: MutationLoginWithWalletArgs): Promise<UserWithToken> => {
  const noncesEntries = collection<Nonce>(config.noncesCollection);
  const usersEntries = collection<User>(config.usersCollection);

  const res = await get(noncesEntries, walletAddress);

  if (!res) {
    throw new GraphQLError("Invalid wallet address", {
      extensions: { code: "INVALID_WALLET_ADDRESS", walletAddress },
    });
  }

  const { nonce } = res.data;

  /** checks if the sign in attempt is a replay attack */
  if (message !== String(nonce)) {
    throw new GraphQLError("Invalid nonce", {
      extensions: { code: "INVALID_NONCE", walletAddress },
    });
  }

  /** recovers signature from signed message */
  const msgHash = ethers.utils.hashMessage(String(nonce));
  const msgHashBytes = ethers.utils.arrayify(msgHash);

  let recoveredAddress = "";

  try {
    recoveredAddress = await ethers.utils.recoverAddress(
      msgHashBytes,
      signedMessage
    );
  } catch (error) {
    throw new GraphQLError("Invalid signed message", {
      extensions: { code: "INVALID_SIGNED_MESSAGE", walletAddress, error },
    });
  }

  const isSignatureValid = recoveredAddress === walletAddress;

  if (!isSignatureValid) {
    throw new GraphQLError("Invalid signature", {
      extensions: { code: "INVALID_SIGNATURE", walletAddress },
    });
  }

  try {
    /** Updates nonce to prevent replay attacks */
    const generatedNonce = Math.floor(Math.random() * 1000000);
    await update(collection<Nonce>(config.noncesCollection), recoveredAddress, {
      nonce: generatedNonce,
    });

    const userRes = await get(usersEntries, walletAddress);

    let user;

    if (!userRes) {
      const newUser = {
        id: walletAddress,
        role: Role.User,
      };

      await set(usersEntries, walletAddress, newUser);
      user = { ...newUser };
    } else {
      user = { ...userRes.data, id: userRes.ref.id };
    }

    const firebaseToken = await admin
      .auth()
      .createCustomToken(recoveredAddress, { role: user.role });

    const idToken = await getUserToken({ customToken: firebaseToken });

    return { user, token: idToken };
  } catch (error) {
    throw new GraphQLError("Failed to generate token", {
      extensions: { code: "INTERNAL_SERVER_ERROR", walletAddress, error },
    });
  }
};

export default loginWithWallet;
