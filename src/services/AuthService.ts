import axios from "axios";
import config from "../../config";
import { createLogger } from "../logger/createLogger";

const logger = createLogger();

const authClient = axios.create({
  baseURL: config.firebaseAuthUrl,
  timeout: 1000,
});

export function getUserToken({ customToken }: { customToken: string }) {
  return authClient
    .post("", { token: customToken, returnSecureToken: true })
    .then((response) => response.data.idToken)
    .catch((error) => {
      logger.error(error);
      throw new Error("Error getting user token");
    });
}
