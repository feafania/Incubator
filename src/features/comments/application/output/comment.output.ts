import { CommentatorOutput } from "./commentator.output";

export type CommentOutput = {
  id: string;
  content: string;
  commentatorInfo: CommentatorOutput;
  createdAt: Date; // string($date-time)
};
