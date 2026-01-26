import { body } from "express-validator";
import { LikeStatus } from "../../likes/domain/like-status-type";

export const commentContentValidation = body("content")
  .isString()
  .withMessage("Content must be a string")
  .trim()
  .isLength({ min: 20, max: 300 })
  .withMessage("Content length must be between 20 and 300 characters");

export const likeStatusValidation = body("likeStatus")
  .isString()
  .withMessage("Like status must be a string")
  .trim()
  .isIn(Object.values(LikeStatus))
  .withMessage(
    `Like status must be one of: ${Object.values(LikeStatus).join(", ")}`,
  )
  .customSanitizer((value) => value as LikeStatus);

export const updateCommentRequestPayloadValidation = [commentContentValidation];
export const setCommentLikeStatusRequestPayloadValidation = [
  likeStatusValidation,
];
