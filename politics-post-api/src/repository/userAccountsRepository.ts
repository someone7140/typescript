import { Db } from "mongodb";

import { USER_ACCOUNTS_COLLECTION } from "@/db/collectionConstants";
import type { AccountUserCollection, AccountUserEntity } from "@/type/db/dbType";
import { toCamel, toSnake } from "@/type/db/typeConvertUtil";

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

  return toCamel<AccountUserCollection>(userAccount);
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

  return toCamel<AccountUserCollection>(userAccount);
};

export const getUserAccountById = async (db: Db, id: string) => {
  const userAccountsCol = db.collection<AccountUserCollection>(
    USER_ACCOUNTS_COLLECTION,
  );
  const userAccount = await userAccountsCol.findOne<AccountUserCollection>({
    _id: id,
  });
  if (!userAccount) {
    return null;
  }

  return toCamel<AccountUserCollection>(userAccount);
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
