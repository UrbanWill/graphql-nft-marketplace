import logger from "pino";
import config from "../../config";

import { Logger } from "../../types";

let instantiateLogger: Logger;

export const createLogger = (): Logger => {
  const appLogger = logger({ level: config.logLevel }) as Logger;

  appLogger.logMemoryUsage = () => {
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    appLogger.info(`Using approximately ${Math.round(used * 100) / 100} MB`);
  };

  return appLogger;
};

export const getLogger = (): Logger => {
  if (!instantiateLogger) createLogger();
  return instantiateLogger;
};
