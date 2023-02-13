import {
  mockFirestoreDb,
  mockCollection,
  mockGet,
  mockDoc,
  mockSet,
} from "../__mocks__/mockDataSource";
import loginWithWallet from "../../datasource/nftMarketplaceDataSource/loginWithWallet";
import config from "../../../config";
import * as AuthService from "../../services/AuthService";
import { Role } from "../../generated/graphql";

const mockedToken = "1234";

describe("loginWithWallet", () => {
  afterEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  const mockedWalletAddress = "0xa7B623fD5d7e54DC0bA89eb70529574DAa25B202";
  const mockedExistingUserWalletAddress =
    "0xDebEbd3Aa9D5d44f78823638dEf113660911DE05";
  const mockedNonce = { nonce: 12345678 };

  const mockedNoncesEntries = [
    { id: mockedWalletAddress, ...mockedNonce },
    { id: mockedExistingUserWalletAddress, ...mockedNonce },
  ];

  const mockedUsersEntries = [
    { id: mockedExistingUserWalletAddress, role: Role.Master },
  ];

  mockFirestoreDb({
    mockedNonces: mockedNoncesEntries,
    mockedUsers: mockedUsersEntries,
  });

  it("should create a new user, return a token and user", async () => {
    jest.spyOn(AuthService, "getUserToken").mockResolvedValue(mockedToken);
    // this signature is valid for the nonce 12345678 and mockedWalletAddress wallet address
    const mockedValidSignedMessage =
      "0x9e81c23915fa05ea74bc134290c8a6cf3d3d33272c6b36954ea6ab01d65764d1680dcf343ef0d6065b2f8bba1edd06a85277cd045d4671f2f7c764444e6f1e501b";
    const response = await loginWithWallet({
      walletAddress: mockedWalletAddress,
      message: String(mockedNonce.nonce),
      signedMessage: mockedValidSignedMessage,
    });

    expect(mockCollection).toHaveBeenCalledWith(config.noncesCollection);
    expect(mockCollection).toHaveBeenCalledWith(config.usersCollection);
    expect(mockGet).toHaveBeenCalledTimes(2);
    expect(mockSet).toHaveBeenCalledTimes(1);
    expect(mockSet).toHaveBeenCalledWith({
      id: mockedWalletAddress,
      role: Role.User,
    });
    expect(mockDoc).toHaveBeenCalledWith(mockedWalletAddress);
    expect(response).toEqual({
      user: { id: mockedWalletAddress, role: Role.User },
      token: mockedToken,
    });
  });

  it("should return existing user and a token", async () => {
    jest.spyOn(AuthService, "getUserToken").mockResolvedValue(mockedToken);
    // this signature is valid for the nonce 12345678 and mockedExistingUserWalletAddress wallet address
    const mockedValidSignedMessage =
      "0x6cb5c1d25303a8ce69a749e9eecc1516c7c3f3be86a86276d6021ddc17c6ff3d4ce40cc6ad4e1123f43f61abcffaf6bbe0e8abd2e0c208bebd11c9ebb34aadae1b";
    const response = await loginWithWallet({
      walletAddress: mockedExistingUserWalletAddress,
      message: String(mockedNonce.nonce),
      signedMessage: mockedValidSignedMessage,
    });

    expect(mockCollection).toHaveBeenCalledWith(config.noncesCollection);
    expect(mockCollection).toHaveBeenCalledWith(config.usersCollection);
    expect(mockGet).toHaveBeenCalledTimes(2);
    expect(mockSet).toHaveBeenCalledTimes(0);
    expect(mockDoc).toHaveBeenCalledWith(mockedExistingUserWalletAddress);
    expect(response).toEqual({
      user: { id: mockedExistingUserWalletAddress, role: Role.Master },
      token: mockedToken,
    });
  });

  it("should throw an error if the wallet address is not in the nonces collection", async () => {
    const mockedInvalidWalletAddress = "0xD34d";
    await expect(
      loginWithWallet({
        walletAddress: mockedInvalidWalletAddress,
        message: String(mockedNonce.nonce),
        signedMessage: "1234",
      })
    ).rejects.toThrow("Invalid wallet address");
  });

  it("should throw invalid nonce when the message nonce does NOT match the nonce in the db", async () => {
    const mockedAlreadyUsedNonce = { nonce: 87654321 };
    await expect(
      loginWithWallet({
        walletAddress: mockedWalletAddress,
        message: String(mockedAlreadyUsedNonce),
        signedMessage: "1234",
      })
    ).rejects.toThrow("Invalid nonce");
    expect(mockCollection).toHaveBeenCalledWith(config.noncesCollection);
    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockDoc).toHaveBeenCalledWith(mockedWalletAddress);
  });

  it("should throw invalid signed message", async () => {
    await expect(
      loginWithWallet({
        walletAddress: mockedWalletAddress,
        message: String(mockedNonce.nonce),
        signedMessage: "1234",
      })
    ).rejects.toThrow("Invalid signed message");
    expect(mockCollection).toHaveBeenCalledWith(config.noncesCollection);
    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockDoc).toHaveBeenCalledWith(mockedWalletAddress);
  });
  //
  it("should throw invalid signature when the recovered wallet address does not match the nonce for the wallet that is supposed to sign that nonce", async () => {
    const validSignatureWrongWallet =
      "0xc44cd9793651c9f007a2f943740bedcf7715cfaea5507ef2392998324014bddd28c651d5a560ab89c7b0e61a834a7fc16dcb3db23c7dfb0496c8c32bc550998d1c";
    await expect(
      loginWithWallet({
        walletAddress: mockedWalletAddress,
        message: String(mockedNonce.nonce),
        signedMessage: validSignatureWrongWallet,
      })
    ).rejects.toThrow("Invalid signature");
    expect(mockCollection).toHaveBeenCalledWith(config.noncesCollection);
    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockDoc).toHaveBeenCalledWith(mockedWalletAddress);
  });
});
