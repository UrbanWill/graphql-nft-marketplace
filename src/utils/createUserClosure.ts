export const createUserClosure = ({
  admin,
  walletAddress,
}: {
  admin: any;
  walletAddress: string;
}) => {
  return admin.auth().createUser({ uid: walletAddress });
};
