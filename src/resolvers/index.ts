import { Resolvers } from "../generated/graphql";
import queries from "./queries";
import mutations from "./mutations";

// Note this "Resolvers" type isn't strictly necessary because we are already
// separately type checking our queries and resolvers. However, the "Resolvers"
// generated types is useful syntax if you are defining your resolvers
// in a single file.
const resolvers: Resolvers = { Query: queries, Mutation: mutations };

export default resolvers;
