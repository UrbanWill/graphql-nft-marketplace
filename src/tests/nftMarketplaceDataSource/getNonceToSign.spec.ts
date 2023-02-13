import {
  mockFirestoreDb,
  mockCollection,
  mockGet,
  mockDoc,
  mockSet,
} from "../__mocks__/mockDataSource";
import getNonceToSign from "../../datasource/nftMarketplaceDataSource/getNonceToSign";
import config from "../../../config";

const mockGenerateNonce = 99999;

jest.mock("../../utils", () => ({
  createUserClosure: jest.fn().mockResolvedValue(null),
  generateNonce: () => mockGenerateNonce,
}));

describe("getNonceToSign", () => {
  afterEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  const mockedWalletAddress = "0xa7B623fD5d7e54DC0bA89eb70529574DAa25B202";
  const mockedNonce = { nonce: 12345678 };
  const mockedNonceEntry = [{ id: mockedWalletAddress, ...mockedNonce }];

  mockFirestoreDb({ mockedNonces: mockedNonceEntry });
  it("should return nonce if doc already exists", async () => {
    const res = await getNonceToSign(mockedWalletAddress);

    expect(mockCollection).toHaveBeenCalledWith(config.noncesCollection);
    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockDoc).toHaveBeenCalledWith(mockedWalletAddress);
    expect(res).toEqual(mockedNonce);
  });

  it("should create a new nonce if doc does not exist", async () => {
    const mockedNewWalletAddress = "0x123";

    await getNonceToSign(mockedNewWalletAddress);

    expect(mockCollection).toHaveBeenCalledWith(config.noncesCollection);
    expect(mockGet).toHaveBeenCalledTimes(2);
    expect(mockDoc).toHaveBeenCalledWith(mockedNewWalletAddress);
    expect(mockSet).toHaveBeenCalledTimes(1);
    expect(mockSet).toHaveBeenCalledWith({
      nonce: mockGenerateNonce,
    });
  });
});
