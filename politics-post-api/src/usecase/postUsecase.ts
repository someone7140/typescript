import { generate as generateV7 } from "@std/uuid/v7";
import { Db } from "mongodb";
import { InputShapeFromFields } from "@pothos/core";

import { RegisterPostRequest } from "@/graphql/graphqlType";
import { registerPost } from "@/repository/postsRepository";

export const registerMyPost = async (
  db: Db,
  req: InputShapeFromFields<typeof RegisterPostRequest>,
  userAccountId: string,
) => {
  const newPost = {
    _id: generateV7(),
    title: req.title,
    userAccountId: userAccountId,
    contents: req.contents,
    status: req.status,
  };
  await registerPost(db, newPost);
};
