import { body } from "express-validator";
import blogsService from "../../blogs/application/blogs.service";
import { commentContentValidation } from "../../comments/routes/comment-request.payload.validation-middlewares";
import { idValidation } from "../../../core/middlewares/validation/params-id.validation-middleware";

const postTitleInputValidator = body("title")
  .isString()
  .withMessage("Missing the title")
  .trim()
  .isLength({ min: 1, max: 30 })
  .withMessage("The title should be from 1 to 30 symbols");

const postShortDescriptionInputValidator = body("shortDescription")
  .isString()
  .withMessage("Missing the short description")
  .trim()
  .isLength({ min: 1, max: 100 })
  .withMessage("The short description should be from 1 to 100 symbols");

const postContentInputValidator = body("content")
  .isString()
  .withMessage("Missing the content")
  .trim()
  .isLength({ min: 1, max: 1000 })
  .withMessage("The content should be from 1 to 1000 symbols");

const postBlogIdInputValidator = body("blogId")
  .trim()
  .isLength({ min: 1 })
  .withMessage("The blogId should be from 1 to 1000 symbols")
  .custom(async (blogId, { req }) => {
    const blog = await blogsService.findByID(blogId);
    if (!blog) {
      throw new Error("There is no blog ID");
    }
    return true;
  });

export const postRequestPayloadValidationWithoutBlogID = [
  postTitleInputValidator,
  postShortDescriptionInputValidator,
  postContentInputValidator,
];

export const postRequestPayloadValidation = [
  ...postRequestPayloadValidationWithoutBlogID,
  postBlogIdInputValidator,
];

export const postCommentRequestPayloadValidation = [
  idValidation,
  commentContentValidation,
];
