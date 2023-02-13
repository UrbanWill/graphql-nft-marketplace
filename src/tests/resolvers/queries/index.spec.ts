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

describe("getNonceToSign", () => {
  const mockWalletAddress = "0x123";
  const GET_NONCE =
    "query NonceToSign($walletAddress: String!) { nonceToSign(walletAddress: $walletAddress) { nonce } }";

  it("Should throw", async () => {
    const ERROR_MESSAGE = "Error creating nonce";
    dataSource.getNonceToSign = jest.fn().mockResolvedValueOnce(
      new GraphQLError(ERROR_MESSAGE, {
        extensions: {
          code: "ERROR_CREATING_NONCE",
          mockWalletAddress,
        },
      })
    );

    const { body } = await testServer.executeOperation(
      {
        query: GET_NONCE,
        variables: { walletAddress: mockWalletAddress },
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

  it("should get nonce", async () => {
    const expectedResponse = { nonce: 1234 };
    dataSource.getNonceToSign = jest.fn(async () => expectedResponse);

    const { body } = await testServer.executeOperation(
      {
        query: GET_NONCE,
        variables: { walletAddress: mockWalletAddress },
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
    expect(body.singleResult.data?.nonceToSign).toEqual(expectedResponse);
  });
});
