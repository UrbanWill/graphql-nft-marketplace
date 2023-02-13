import { GraphQLError } from "graphql";
import admin from "firebase-admin";
import { collection, get, set } from "typesaurus";
import { Nonce } from "../../generated/graphql";
import config from "../../../config";
import { createUserClosure, generateNonce } from "../../utils";

const getNonceToSign = async (walletAddress: string): Promise<Nonce> => {
  const noncesEntries = collection<Nonce>(config.noncesCollection);

  const existingNonce = await get(noncesEntries, walletAddress);

  if (existingNonce) {
    return existingNonce.data;
  }
  try {
    /** Having a set on a query is an anti-pattern. This should be refactored into:
     * - Signup with wallet, where the mutation creates the user document and nonce
     * - Get nonce to sign, where it just gets the nonce
     */
    const generatedNonce = generateNonce();

    await createUserClosure({ admin, walletAddress });
    await set(noncesEntries, walletAddress, { nonce: generatedNonce });
  } catch (error) {
    throw new GraphQLError("Error creating nonce for signing", {
      extensions: {
        code: "ERROR_CREATING_NONCE",
        walletAddress,
        error,
      },
    });
  }

  const newNonce = await get(noncesEntries, walletAddress);

  return newNonce?.data as Nonce;
};

export default getNonceToSign;
