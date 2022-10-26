import { GraphQLError } from "graphql";
import { ApolloServerErrorCode } from "@apollo/server/errors";
import admin from "firebase-admin";
import { collection, get } from "typesaurus";
import { Token, MutationLoginWithWalletArgs } from "../../generated/graphql";
import config from "../../../config";

const loginWithWallet = async ({
  walletAddress,
  signature,
}: MutationLoginWithWalletArgs): Promise<Token> => {
  // const noncesEntries = collection<Nonce>(config.noncesCollection);

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
    throw new GraphQLError(`${walletAddress} invalid signature`, {
      extensions: { code: "UNAUTHORIZED" },
    });
  }
};

export default loginWithWallet;
