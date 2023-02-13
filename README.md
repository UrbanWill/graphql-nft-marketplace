# GraphQL Marketplace API

NFT Marketplace API microservice for sign up, login and assigning authorization levels for users in the NFT marketplace system using web3 signature.

## How to use

- Clone the repo.
- Run `yarn install`.
- Make requests on port `4000` using Postman, Insomnia or Apollo Server on `http://localhost:4000`.

## Deployed version

- Make requests to https://nft-martketplace-graphql.herokuapp.com/ using Postman, Insomnia or using [Apollo sandbox explorer](https://studio.apollographql.com/sandbox/explorer) and pasting the deployed url on the sandbox field.
- To test signing up and signing in with a real wallet visit [Next NFT Marketplace](https://next-nft-marketplace-nine.vercel.app/). It is a WIP for the re-write of my previous [Metaverse Marketplace](https://nft-marketplace-dusky.vercel.app/).

### **Notes:**

- This is a WIP
- Metamask must be installed for sing in to work

## Types for Context and Resolvers

- Add new new types, queries or mutations to `schema.graphql` in the respective `Query` or `Mutation` type.
- Run `yarn codegen`, it will generate the correct type for `QueryResolvers` and `MutationResolvers` for the `AppContext`. Add the new query/mutation to `NftMarketplaceDataSource` class, this will add the correct types to `nftMarketplaceAPI`. The application is na fully typed.

## Testing

- Run `yarn test` to run existing tests.
- New datasource function tests should be added in `/tests/${DataSourceName}` folder.
- New endpoints tests should be added in `tests/${QueryOrMutation}` folder.
  ![Screen Shot 2023-02-13 at 21 42 42](https://user-images.githubusercontent.com/47801291/218488514-48906122-2daf-4536-9930-450c709d01ed.png)
