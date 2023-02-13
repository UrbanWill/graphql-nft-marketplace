import config from "../config";
import admin from "firebase-admin";
import { mockFirebaseCredential } from "./tests/__mocks__/mockFirestore";

const firebaseConfig = {
  type: "service_account",
  projectId: config.projectId,
  privateKeyId: "",
  privateKey: config.firebasePrivateKey,
  clientEmail: config.firebaseClientEmail,
  clientId: config.firebaseClientId,
  authUri: "https://accounts.google.com/o/oauth2/auth",
  tokenUri: "https://oauth2.googleapis.com/token",
  authProviderX509CertUrl: "https://www.googleapis.com/oauth2/v1/certs",
  clientX509CertUrl: config.firebaseClientX509CertUrl,
};

const credential = admin.credential.cert(
  config.nodeEnv === "test" ? mockFirebaseCredential : firebaseConfig
);

export default credential;
