import config from "../config";
import admin from "firebase-admin";

import path from "path";
const mockFirebaseCredential = admin.credential.cert(
  path.resolve(__dirname, "./tests/__mocks__/mock.key.json")
);

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

const credential =
  config.nodeEnv === "test"
    ? mockFirebaseCredential
    : admin.credential.cert(firebaseConfig);

export default credential;
