import { ApolloServer } from "@apollo/server";
import { GraphQLError } from "graphql";
import assert from "assert";
import { readFileSync } from "fs";

import { Role } from "../../../generated/graphql";
import resolvers from "../../../resolvers";
import { NftMarketplaceDataSource } from "../../../datasource/createDataSource";
import { AppContext } from "../../../../types";
import { createLoggerMock } from "../../__mocks__/mockLogger";
import config from "../../../../config";

const typeDefs = readFileSync("./schema.graphql", { encoding: "utf-8" });

let testServer: ApolloServer<AppContext>;
const mockLogger = createLoggerMock();

const dataSource = new NftMarketplaceDataSource({ config, logger: mockLogger });

beforeAll(async () => {
  testServer = new ApolloServer<AppContext>({
    typeDefs,
    resolvers,
  });
});

describe("loginWithWallet", () => {
  const mockWalletAddress = "0x123";
  const LOG_IN_WITH_WALLET =
    "mutation LoginWithWallet($walletAddress: String!, $message: String!, $signedMessage: String!) { loginWithWallet(walletAddress: $walletAddress, message: $message, signedMessage: $signedMessage) { token, user { id, email, role, profilePicture, } } }";

  it("Should throw", async () => {
    const ERROR_MESSAGE = "Invalid wallet address";
    dataSource.loginWithWallet = jest.fn().mockResolvedValueOnce(
      new GraphQLError(ERROR_MESSAGE, {
        extensions: {
          code: "INVALID_WALLET_ADDRESS",
          mockWalletAddress,
        },
      })
    );

    const { body } = await testServer.executeOperation(
      {
        query: LOG_IN_WITH_WALLET,
        variables: {
          walletAddress: mockWalletAddress,
          message: "123",
          signedMessage: "dEaD",
        },
      },
      {
        contextValue: {
          dataSources: {
            nftMarketplaceAPI: dataSource,
          },
          user: { id: null, role: Role.User },
          logger: mockLogger,
        },
      }
    );

    assert(body.kind === "single");
    assert(body.singleResult.errors);
    const [{ message }] = body.singleResult.errors;
    expect(message).toEqual(ERROR_MESSAGE);
  });

  it("should return token and user", async () => {
    const expectedResponse = {
      token: "firebase_token_1234",
      user: {
        id: mockWalletAddress,
        email: "demo@gmail.com",
        role: Role.User,
        profilePicture: "https://example.com",
      },
    };
    dataSource.loginWithWallet = jest.fn(async () => expectedResponse);

    const { body } = await testServer.executeOperation(
      {
        query: LOG_IN_WITH_WALLET,
        variables: {
          walletAddress: mockWalletAddress,
          message: "123",
          signedMessage: "dEaD",
        },
      },
      {
        contextValue: {
          dataSources: {
            nftMarketplaceAPI: dataSource,
          },
          user: { id: null, role: Role.User },
          logger: mockLogger,
        },
      }
    );

    assert(body.kind === "single");
    expect(body.singleResult.errors).toBeUndefined();
    assert(body.kind === "single");
    expect(body.singleResult.errors).toBeUndefined();
    expect(body.singleResult.data?.loginWithWallet).toEqual(expectedResponse);
  });
});
