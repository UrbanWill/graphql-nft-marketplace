import admin from "firebase-admin";
import { getNonceToSign, loginWithWallet } from "./nftMarketplaceDataSource";
import { Config, Logger } from "../../types";

import credential from "../firebaseConfig";

export class NftMarketplaceDataSource {
  constructor({ logger, config }: { logger: Logger; config: Config }) {
    logger.info("Init DataSource");
    admin.initializeApp({
      credential,
      projectId: config.projectId,
    });
  }
  getNonceToSign = getNonceToSign;
  loginWithWallet = loginWithWallet;
}
