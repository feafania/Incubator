import {
  Collection,
  InsertManyResult,
  OptionalUnlessRequiredId,
} from "mongodb";
import { BlogDBType } from "../../src/features/blogs/domain/blogs";
import { PostDBType } from "../../src/features/posts/domain/posts";

export const blog1: BlogDBType = {
  id: Date.now() + Math.random(),
  name: "t" + Date.now() + Math.random(),
  description: "a" + Date.now() + Math.random(),
  websiteUrl: "https://t" + Date.now() + Math.random(),
  createdAt: new Date("2020-11-10T14:30:00Z"),
  isMembership: false,
};

export const blog2: BlogDBType = {
  id: Date.now() + Math.random(),
  name: "p" + Date.now() + Math.random(),
  description: "n" + Date.now() + Math.random(),
  websiteUrl: "https://t" + Date.now() + Math.random(),
  createdAt: new Date("2021-11-10T14:30:00Z"),
  isMembership: false,
};

export const blog3: BlogDBType = {
  id: Date.now() + Math.random(),
  name: "j" + Date.now() + Math.random(),
  description: "a" + Date.now() + Math.random(),
  websiteUrl: "https://t" + Date.now() + Math.random(),
  createdAt: new Date("2019-11-10T14:30:00Z"),
  isMembership: false,
};

export const blog4: BlogDBType = {
  id: Date.now() + Math.random(),
  name: "t" + Date.now() + Math.random(),
  description: "a" + Date.now() + Math.random(),
  websiteUrl: "https://t" + Date.now() + Math.random(),
  createdAt: new Date("2018-11-10T14:30:00Z"),
  isMembership: false,
};

export const blog5: BlogDBType = {
  id: Date.now() + Math.random(),
  name: "",
  description: "a" + Date.now() + Math.random(),
  websiteUrl: "https://t" + Date.now() + Math.random(),
  createdAt: new Date("2005-11-10T14:30:00Z"),
  isMembership: false,
};

export const blog6: BlogDBType = {
  id: Date.now() + Math.random(),
  name: "thjhhhhhhhgff ffghhg ghf",
  description: "a" + Date.now() + Math.random(),
  websiteUrl: "https://t" + Date.now() + Math.random(),
  createdAt: new Date("2014-11-10T14:30:00Z"),
  isMembership: false,
};

export const blog7: BlogDBType = {
  id: Date.now() + Math.random(),
  name: "t" + Date.now() + Math.random(),
  description: "",
  websiteUrl: "https://t" + Date.now() + Math.random(),
  createdAt: new Date("2021-05-10T14:30:00Z"),
  isMembership: false,
};

export const blog8: BlogDBType = {
  id: Date.now() + Math.random(),
  name: "t" + Date.now() + Math.random(),
  description: "a" + Date.now() + Math.random(),
  websiteUrl: "",
  createdAt: new Date("2021-06-10T14:30:00Z"),
  isMembership: false,
};

export const blog9: BlogDBType = {
  id: Date.now() + Math.random(),
  name: "t" + Date.now() + Math.random(),
  description: "a" + Date.now() + Math.random(),
  websiteUrl: "fgdggdf" + Date.now() + Math.random(),
  createdAt: new Date("2021-10-10T14:30:00Z"),
  isMembership: false,
};

export const datasetBlogValid: BlogDBType[] = [blog1, blog2, blog3, blog4];
export const datasetBlogNotValid1: BlogDBType[] = [blog5, blog6, blog7, blog8];
export const datasetBlogNotValid2: BlogDBType[] = [blog1, blog2, blog6, blog9];

export const post1: PostDBType = {
  id: Date.now() + Math.random(),
  title: "t" + Date.now(),
  shortDescription: "a" + Date.now() + Math.random(),
  content: "about " + Date.now() + Math.random(),
  blogId: blog1.id,
  createdAt: new Date("2023-10-10T14:30:00Z"),
};

export const post2: PostDBType = {
  id: Date.now() + Math.random(),
  title: "b" + Date.now(),
  shortDescription: "a" + Date.now() + Math.random(),
  content: "about " + Date.now() + Math.random(),
  blogId: blog1.id,
  createdAt: new Date("2023-08-10T14:30:00Z"),
};

export const post3: PostDBType = {
  id: Date.now() + Math.random(),
  title: "c" + Date.now(),
  shortDescription: "a" + Date.now() + Math.random(),
  content: "about " + Date.now() + Math.random(),
  blogId: blog1.id,
  createdAt: new Date("2024-11-10T14:30:00Z"),
};

export const post4: PostDBType = {
  id: Date.now() + Math.random(),
  title: "f" + Date.now(),
  shortDescription: "a" + Date.now() + Math.random(),
  content: "about " + Date.now() + Math.random(),
  blogId: blog1.id,
  createdAt: new Date("2023-12-10T14:30:00Z"),
};

export const post5: PostDBType = {
  id: Date.now() + Math.random(),
  title: "",
  shortDescription: "a" + Date.now() + Math.random(),
  content: "about " + Date.now() + Math.random(),
  blogId: blog1.id,
  createdAt: new Date("2021-12-10T14:30:00Z"),
};

export const post6: PostDBType = {
  id: Date.now() + Math.random(),
  title: "t" + Date.now(),
  shortDescription: "",
  content: "about " + Date.now() + Math.random(),
  blogId: blog1.id,
  createdAt: new Date("2024-01-10T14:30:00Z"),
};

export const post7: PostDBType = {
  id: Date.now() + Math.random(),
  title: "a".repeat(40),
  shortDescription: "a".repeat(40),
  content: "about " + Date.now() + Math.random(),
  blogId: blog1.id,
  createdAt: new Date("2024-02-10T14:30:00Z"),
};

export const post8: PostDBType = {
  id: Date.now() + Math.random(),
  title: "t" + Date.now(),
  shortDescription: "a".repeat(150),
  content: "about " + Date.now() + Math.random(),
  blogId: blog1.id,
  createdAt: new Date("2023-12-31T14:30:00Z"),
};

export const post9: PostDBType = {
  id: Date.now() + Math.random(),
  title: "t" + Date.now(),
  shortDescription: "a" + Date.now() + Math.random(),
  content: "a".repeat(1150),
  blogId: blog1.id,
  createdAt: new Date("2022-11-20T14:30:00Z"),
};

export const datasetPostValid: PostDBType[] = [post1, post2, post3, post4];
export const datasetPostNotValid1: PostDBType[] = [post5, post6, post7, post8];
export const datasetPostNotValid2: PostDBType[] = [post1, post2, post6, post9];

// export async function setMongoDB(
//   collection: Collection<BlogDBType> | Collection<PostDBType>,
//   dataset: OptionalUnlessRequiredId<BlogDBType | PostDBType>[],
// ): Promise<InsertManyResult<BlogDBType | PostDBType> | null> {
//   //     collection.insertMany(dataset):
//   //      returns object:
//   //      	acknowledged — подтверждение успешной операции.
//   // 	        insertedCount — количество вставленных документов.
//   // 	        insertedIds — объект с ключами индексов вставленных элементов и их _id.
//
//   try {
//     if ((await collection.countDocuments()) > 0) {
//       await collection.drop();
//     }
//     if (dataset.length > 0) {
//       // @ts-ignore
//       return collection.insertMany(dataset);
//     }
//     return null;
//   } catch (error) {
//     console.error(
//       "An error occurred while initializing the collection:",
//       error,
//     );
//     return null;
//   }
// }

export async function setMongoDB<T extends object>(
  collection: Collection<T>,
  dataset: OptionalUnlessRequiredId<T>[],
): Promise<InsertManyResult<T> | null> {
  //     collection.insertMany(dataset):
  //      returns object:
  //      	acknowledged — подтверждение успешной операции.
  // 	        insertedCount — количество вставленных документов.
  // 	        insertedIds — объект с ключами индексов вставленных элементов и их _id.

  try {
    if ((await collection.countDocuments()) > 0) {
      await collection.drop();
    }
    if (dataset.length > 0) {
      return await collection.insertMany(dataset); //_id не обязателен, если оно не указано.
    }
    return null;
  } catch (error) {
    console.error(
      "An error occurred while initializing the collection:",
      error,
    );
    return null;
  }
}
