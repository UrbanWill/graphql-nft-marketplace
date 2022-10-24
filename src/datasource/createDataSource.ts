import admin from "firebase-admin";
import { getBooks, addBook } from "./booksdatasource";
import { Config, Logger, FirestoreDatasource } from "../../types";

const createDataSource = (
  config: Config,
  logger: Logger
): FirestoreDatasource => {
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

  logger.info("Init datasource");

  admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
    projectId: config.projectId,
  });

  return { getBooks, addBook };
};

export default createDataSource;
