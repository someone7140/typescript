import camelcaseKeys from "camelcase-keys";
import { Db } from "mongodb";

import { USER_ACCOUNTS_COLLECTION } from "@/db/collectionConstants";
import { toCamel, toSnake } from "./typeConvertUtil";

type AccountUserCollection = {
  _id: string;
  name: string;
  user_setting_id: string;
  google_id: string;
  url_list: string[];
  detail?: string;
  image_url?: string;
};

export type AccountUserEntity = ReturnType<
  typeof camelcaseKeys<AccountUserCollection, { deep: true }>
>;

export const getUserAccountByGoogleId = async (db: Db, googleId: string) => {
  const userAccountsCol = db.collection<AccountUserCollection>(
    USER_ACCOUNTS_COLLECTION,
  );
  const userAccount = await userAccountsCol.findOne<AccountUserCollection>({
    google_id: googleId,
  });
  if (!userAccount) {
    return null;
  }

  return toCamel<AccountUserEntity>(userAccount);
};

export const getUserAccountByUserSettingId = async (
  db: Db,
  userSettingId: string,
) => {
  const userAccountsCol = db.collection<AccountUserCollection>(
    USER_ACCOUNTS_COLLECTION,
  );
  const userAccount = await userAccountsCol.findOne<AccountUserCollection>({
    user_setting_id: userSettingId,
  });
  if (!userAccount) {
    return null;
  }

  return toCamel<AccountUserEntity>(userAccount);
};

export const registerUserAccount = async (
  db: Db,
  account: AccountUserEntity,
) => {
  const userAccountsCol = db.collection<AccountUserCollection>(
    USER_ACCOUNTS_COLLECTION,
  );

  await userAccountsCol.insertOne(toSnake<AccountUserCollection>(account));
};
