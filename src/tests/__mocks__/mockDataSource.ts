import { mockGoogleCloudFirestore } from "firestore-jest-mock";
import {
  mockCollection,
  mockDoc,
  mockGet,
  mockUpdate,
  mockSet,
  mockAdd,
} from "firestore-jest-mock/mocks/firestore";
import admin from "firebase-admin";
import config from "../../../config";

import { mockFirebaseCredential } from "./mockFirestore";

const mockFirestoreDb = async ({
  mockedNonces = [],
  mockedUsers = [],
}: {
  mockedNonces?: any[];
  mockedUsers?: any[];
}) => {
  admin.initializeApp({
    credential: admin.credential.cert(mockFirebaseCredential),
    projectId: config.projectId,
  });

  return mockGoogleCloudFirestore({
    database: {
      [config.noncesCollection]: [...mockedNonces],
      [config.usersCollection]: [...mockedUsers],
    },
  });
};

export {
  mockFirestoreDb,
  mockCollection,
  mockDoc,
  mockGet,
  mockAdd,
  mockSet,
  mockUpdate,
};
