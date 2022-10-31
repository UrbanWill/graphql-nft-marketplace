import {
  mockFirestoreDb,
  mockCollection,
  mockGet,
  mockDoc,
} from "../../../__mocks__/mockDataSource";
import loginWithWallet from "../loginWithWallet";
import config from "../../../../config";
import * as AuthService from "../../../services/AuthService";

const mockedToken = "1234";

jest.spyOn(AuthService, "getUserToken").mockResolvedValue(mockedToken);

describe("loginWithWallet", () => {
  afterEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  const mockedWalletAddress = "0xa7B623fD5d7e54DC0bA89eb70529574DAa25B202";
  const mockedNonce = { nonce: 12345678 };

  const mockedNonceEntry = [{ id: mockedWalletAddress, ...mockedNonce }];

  mockFirestoreDb({ mockedNonces: mockedNonceEntry });

  it("should return a token", async () => {
    const mockedValidSignedMessage =
      "0x9e81c23915fa05ea74bc134290c8a6cf3d3d33272c6b36954ea6ab01d65764d1680dcf343ef0d6065b2f8bba1edd06a85277cd045d4671f2f7c764444e6f1e501b"; // this signature is valid for the nonce 12345678 and the wallet address 0xa7B623fD5d7e54DC0bA89eb70529574DAa25B202
    const { token } = await loginWithWallet({
      walletAddress: mockedWalletAddress,
      message: String(mockedNonce.nonce),
      signedMessage: mockedValidSignedMessage,
    });
    expect(mockCollection).toHaveBeenCalledWith(config.noncesCollection);
    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockDoc).toHaveBeenCalledWith(mockedWalletAddress);
    expect(token).toBe(mockedToken);
  });

  it("should throw invalid nonce when the message nonce does NOT match the nonce in the db", async () => {
    const mockedAlreadyUsedNonce = { nonce: 87654321 };
    await expect(
      loginWithWallet({
        walletAddress: mockedWalletAddress,
        message: String(mockedAlreadyUsedNonce),
        signedMessage: "1234",
      })
    ).rejects.toThrow(`Wallet address: ${mockedWalletAddress} invalid nonce`);
    expect(mockCollection).toHaveBeenCalledWith(config.noncesCollection);
    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockDoc).toHaveBeenCalledWith(mockedWalletAddress);
  });

  it("should throw invalid signature", async () => {
    await expect(
      loginWithWallet({
        walletAddress: mockedWalletAddress,
        message: String(mockedNonce.nonce),
        signedMessage: "1234",
      })
    ).rejects.toThrow(
      `Wallet address: ${mockedWalletAddress} Invalid signed message`
    );
    expect(mockCollection).toHaveBeenCalledWith(config.noncesCollection);
    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockDoc).toHaveBeenCalledWith(mockedWalletAddress);
  });
});
