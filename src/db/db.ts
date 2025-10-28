import { DBType } from "./types";
import { connectToMongoDB } from "./mongo-db";

export const db: DBType = {
  // создаём базу данных (пока это просто переменная)

  blogs: [
    {
      id: 1,
      name: "Good things",
      description: "Something about good things",
      websiteUrl: "https://fdgdlgk.bu",
      createdAt: new Date("2024-11-10T14:30:00Z"),
      isMembership: false,
    },
    {
      id: 2,
      name: "Follow me",
      description: "Blog about my working day",
      websiteUrl: "https://fdgdlgfsdfk.bu",
      createdAt: new Date("2024-10-10T14:30:00Z"),
      isMembership: false,
    },
    {
      id: 3,
      name: "Food and drinks",
      description: "My experience in food",
      websiteUrl: "https://sssssdflgk.bu",
      createdAt: new Date("2023-09-10T14:30:00Z"),
      isMembership: false,
    },
    {
      id: 4,
      name: "Sports",
      description: "Doing some sports",
      websiteUrl: "https://bbbbbb.bu",
      createdAt: new Date("2020-12-10T14:30:00Z"),
      isMembership: false,
    },
    {
      id: 5,
      name: "London",
      description: "Life in London",
      websiteUrl: "https://sssssss.bu",
      createdAt: new Date("2024-05-10T14:30:00Z"),
      isMembership: false,
    },
  ],
  posts: [
    {
      id: 1,
      title: "Volleyball",
      shortDescription: "Rules of volleyball",
      content: "about volleyball",
      blogId: 4,
      createdAt: new Date("2021-04-10T14:30:00Z"),
    },
    {
      id: 2,
      title: "Thames",
      shortDescription: "Swimming in Thames",
      content: "about Thames",
      blogId: 5,
      createdAt: new Date("2024-07-10T14:30:00Z"),
    },
    {
      id: 3,
      title: "Mango",
      shortDescription: "How can we use mango",
      content: "about mango",
      blogId: 3,
      createdAt: new Date("2024-01-10T14:30:00Z"),
    },
    {
      id: 4,
      title: "British museum",
      shortDescription: "Seeing Egyptian mummies",
      content: "about Seeing Egyptian mummies",
      blogId: 5,
      createdAt: new Date("2024-05-10T14:30:00Z"),
    },
    {
      id: 5,
      title: "Football",
      shortDescription: "Rules of football",
      content: "about Football",
      blogId: 4,
      createdAt: new Date("2022-08-10T14:30:00Z"),
    },
    {
      id: 6,
      title: "London eye",
      shortDescription: "Visiting london eye",
      content: "about London eye",
      blogId: 5,
      createdAt: new Date("2024-09-10T14:30:00Z"),
    },
  ],
};

export async function runDB(): Promise<boolean> {
  return await connectToMongoDB();
}
