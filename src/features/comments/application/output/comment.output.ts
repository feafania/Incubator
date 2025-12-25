import { CommentatorOutput } from "./commentator.output";
import { LikesInfoOutput } from "../../../likes/application/output/likes-info.output";

export type CommentOutput = {
  id: string;
  content: string;
  commentatorInfo: CommentatorOutput;
  createdAt: Date; // string($date-time)
  likesInfo?: LikesInfoOutput;
};
