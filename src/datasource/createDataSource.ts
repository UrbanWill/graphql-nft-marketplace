import admin from "firebase-admin";
import { getBooks, addBook } from "./booksdatasource";
import { Config, Logger, FirestoreDatasource } from "../../types";
import { serviceAccount } from "../../serviceAccount";

const createDataSource = (
  config: Config,
  logger: Logger
): FirestoreDatasource => {
  logger.info("Init datasource");

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: config.projectId,
  });

  return { getBooks, addBook };
};

export default createDataSource;
