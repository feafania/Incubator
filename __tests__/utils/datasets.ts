import { PostDomainDto } from "../../src/features/posts/domain/post-domain.dto";
import { BlogDomainDto } from "../../src/features/blogs/domain/blog-domain.dto";
import mongoose, { Model } from "mongoose";

export const blog1 = {
  _id: new mongoose.Types.ObjectId(),
  name: "t" + Date.now() + Math.random(),
  description: "a" + Date.now() + Math.random(),
  websiteUrl: "https://t" + Date.now() + Math.random(),
  createdAt: new Date("2020-11-10T14:30:00Z"),
  isMembership: false,
  updatedAt: new Date("2023-10-10T14:30:00Z"),
  update(dto: BlogDomainDto) {},
};

export const blog2 = {
  _id: new mongoose.Types.ObjectId(),
  name: "p" + Date.now() + Math.random(),
  description: "n" + Date.now() + Math.random(),
  websiteUrl: "https://t" + Date.now() + Math.random(),
  createdAt: new Date("2021-11-10T14:30:00Z"),
  isMembership: false,
  updatedAt: new Date("2023-10-10T14:30:00Z"),
  update(dto: BlogDomainDto) {},
};

export const blog3 = {
  _id: new mongoose.Types.ObjectId(),
  name: "j" + Date.now() + Math.random(),
  description: "a" + Date.now() + Math.random(),
  websiteUrl: "https://t" + Date.now() + Math.random(),
  createdAt: new Date("2019-11-10T14:30:00Z"),
  isMembership: false,
  updatedAt: new Date("2023-10-10T14:30:00Z"),
  update(dto: BlogDomainDto) {},
};

export const blog4 = {
  _id: new mongoose.Types.ObjectId(),
  name: "t" + Date.now() + Math.random(),
  description: "a" + Date.now() + Math.random(),
  websiteUrl: "https://t" + Date.now() + Math.random(),
  createdAt: new Date("2018-11-10T14:30:00Z"),
  isMembership: false,
  updatedAt: new Date("2023-10-10T14:30:00Z"),
  update(dto: BlogDomainDto) {},
};

export const blog5 = {
  _id: new mongoose.Types.ObjectId(),
  name: "",
  description: "a" + Date.now() + Math.random(),
  websiteUrl: "https://t" + Date.now() + Math.random(),
  createdAt: new Date("2005-11-10T14:30:00Z"),
  isMembership: false,
  updatedAt: new Date("2023-10-10T14:30:00Z"),
  update(dto: BlogDomainDto) {},
};

export const blog6 = {
  _id: new mongoose.Types.ObjectId(),
  name: "thjhhhhhhhgff ffghhg ghf",
  description: "a" + Date.now() + Math.random(),
  websiteUrl: "https://t" + Date.now() + Math.random(),
  createdAt: new Date("2014-11-10T14:30:00Z"),
  isMembership: false,
  updatedAt: new Date("2023-10-10T14:30:00Z"),
  update(dto: BlogDomainDto) {},
};

export const blog7 = {
  _id: new mongoose.Types.ObjectId(),
  name: "t" + Date.now() + Math.random(),
  description: "",
  websiteUrl: "https://t" + Date.now() + Math.random(),
  createdAt: new Date("2021-05-10T14:30:00Z"),
  isMembership: false,
  updatedAt: new Date("2023-10-10T14:30:00Z"),
  update(dto: BlogDomainDto) {},
};

export const blog8 = {
  _id: new mongoose.Types.ObjectId(),
  name: "t" + Date.now() + Math.random(),
  description: "a" + Date.now() + Math.random(),
  websiteUrl: "",
  createdAt: new Date("2021-06-10T14:30:00Z"),
  isMembership: false,
  updatedAt: new Date("2023-10-10T14:30:00Z"),
  update(dto: BlogDomainDto) {},
};

export const blog9 = {
  _id: new mongoose.Types.ObjectId(),
  name: "t" + Date.now() + Math.random(),
  description: "a" + Date.now() + Math.random(),
  websiteUrl: "fgdggdf" + Date.now() + Math.random(),
  createdAt: new Date("2021-10-10T14:30:00Z"),
  isMembership: false,
  updatedAt: new Date("2023-10-10T14:30:00Z"),
  update(dto: BlogDomainDto) {},
};

export const datasetBlogValid = [blog1, blog2, blog3, blog4];
export const datasetBlogNotValid1 = [blog5, blog6, blog7, blog8];
export const datasetBlogNotValid2 = [blog1, blog2, blog6, blog9];

export const post1 = {
  _id: new mongoose.Types.ObjectId(),
  title: "t" + Date.now(),
  shortDescription: "a" + Date.now() + Math.random(),
  content: "about " + Date.now() + Math.random(),
  blogId: blog1._id.toString(),
  createdAt: new Date("2023-10-10T14:30:00Z"),
  updatedAt: new Date("2023-10-10T14:30:00Z"),
  update(dto: PostDomainDto) {},
};

export const post2 = {
  _id: new mongoose.Types.ObjectId(),
  title: "b" + Date.now(),
  shortDescription: "a" + Date.now() + Math.random(),
  content: "about " + Date.now() + Math.random(),
  blogId: blog1._id.toString(),
  createdAt: new Date("2023-08-10T14:30:00Z"),
  updatedAt: new Date("2023-08-10T14:30:00Z"),
  update(dto: PostDomainDto) {},
};

export const post3 = {
  _id: new mongoose.Types.ObjectId(),
  title: "c" + Date.now(),
  shortDescription: "a" + Date.now() + Math.random(),
  content: "about " + Date.now() + Math.random(),
  blogId: blog1._id.toString(),
  createdAt: new Date("2024-11-10T14:30:00Z"),
  updatedAt: new Date("2024-11-10T14:30:00Z"),
  update(dto: PostDomainDto) {},
};

export const post4 = {
  _id: new mongoose.Types.ObjectId(),
  title: "f" + Date.now(),
  shortDescription: "a" + Date.now() + Math.random(),
  content: "about " + Date.now() + Math.random(),
  blogId: blog1._id.toString(),
  createdAt: new Date("2023-12-10T14:30:00Z"),
  updatedAt: new Date("2023-12-10T14:30:00Z"),
  update(dto: PostDomainDto) {},
};

export const post5 = {
  _id: new mongoose.Types.ObjectId(),
  title: "",
  shortDescription: "a" + Date.now() + Math.random(),
  content: "about " + Date.now() + Math.random(),
  blogId: blog1._id.toString(),
  createdAt: new Date("2021-12-10T14:30:00Z"),
  updatedAt: new Date("2021-12-10T14:30:00Z"),
  update(dto: PostDomainDto) {},
};

export const post6 = {
  _id: new mongoose.Types.ObjectId(),
  title: "t" + Date.now(),
  shortDescription: "",
  content: "about " + Date.now() + Math.random(),
  blogId: blog1._id.toString(),
  createdAt: new Date("2024-01-10T14:30:00Z"),
  updatedAt: new Date("2024-01-10T14:30:00Z"),
  update(dto: PostDomainDto) {},
};

export const post7 = {
  _id: new mongoose.Types.ObjectId(),
  title: "a".repeat(40),
  shortDescription: "a".repeat(40),
  content: "about " + Date.now() + Math.random(),
  blogId: blog1._id.toString(),
  createdAt: new Date("2024-02-10T14:30:00Z"),
  updatedAt: new Date("2024-02-10T14:30:00Z"),
  update(dto: PostDomainDto) {},
};

export const post8 = {
  _id: new mongoose.Types.ObjectId(),
  title: "t" + Date.now(),
  shortDescription: "a".repeat(150),
  content: "about " + Date.now() + Math.random(),
  blogId: blog1._id.toString(),
  createdAt: new Date("2023-12-31T14:30:00Z"),
  updatedAt: new Date("2023-12-31T14:30:00Z"),
  update(dto: PostDomainDto) {},
};

export const post9 = {
  _id: new mongoose.Types.ObjectId(),
  title: "t" + Date.now(),
  shortDescription: "a" + Date.now() + Math.random(),
  content: "a".repeat(1150),
  blogId: blog1._id.toString(),
  createdAt: new Date("2022-11-20T14:30:00Z"),
  updatedAt: new Date("2022-11-20T14:30:00Z"),
  update(dto: PostDomainDto) {},
};

export const datasetPostValid = [post1, post2, post3, post4];
export const datasetPostNotValid1 = [post5, post6, post7, post8];
export const datasetPostNotValid2 = [post1, post2, post6, post9];

export async function setMongoDB<T>(model: Model<T>, dataset: T[]) {
  try {
    // Калі мадэль мае калекцыю і яна не пустая — скідваем
    const count = await model.countDocuments();
    if (count > 0) {
      await model.collection.drop();
    }

    if (dataset.length > 0) {
      return await model.insertMany(dataset);
    }

    return null;
  } catch (error) {
    console.error("Error initializing collection:", error);
    return null;
  }
}
