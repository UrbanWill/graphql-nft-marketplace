import { GraphQLError } from "graphql";
import admin from "firebase-admin";
import { collection, get } from "typesaurus";
import {
  Token,
  Nonce,
  MutationLoginWithWalletArgs,
} from "../../generated/graphql";
import config from "../../../config";
import { ethers } from "ethers";

const loginWithWallet = async ({
  message,
  signedMessage,
}: MutationLoginWithWalletArgs): Promise<Token> => {
  // const noncesEntries = collection<Nonce>(config.noncesCollection);

  // const signerAddress = ethers.utils.verifyMessage(message, signedMessage);

  // const addressFromMessage = message
  //   .replace(/\n|\r/g, "")
  //   .split("Wallet address:")
  //   .pop()
  //   .split("Nonce:")[0]
  //   .trim();

  // const nonce = message.split("Nonce:").pop().trim();

  try {
    // const res = await get(noncesEntries, walletAddress);

    // if (!res) {
    //   // The user document does not exist, create it first
    //   const generatedNonce = Math.floor(Math.random() * 1000000);

    //   // Create an Auth user
    //   const createdUser = await admin.auth().createUser({
    //     uid: walletAddress,
    //   });

    //   // Associate the nonce with that user
    //   await admin
    //     .firestore()
    //     .collection(config.noncesCollection)
    //     .doc(createdUser.uid)
    //     .set({
    //       nonce: generatedNonce,
    //     });

    //   return { nonce: generatedNonce };
    // } else {
    //   // The nonce document exists already, return the nonce
    //   return res.data;
    // }
    return { token: "123" };
  } catch {
    throw new GraphQLError(` invalid signature`, {
      extensions: { code: "UNAUTHORIZED" },
    });
  }
};

export default loginWithWallet;
