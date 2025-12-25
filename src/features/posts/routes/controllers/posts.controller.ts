import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import CreatePostRequestPayload from "../request-payloads/create-post-request.payload";
import { PostsService } from "../../application/posts.service";
import { PostQueryService } from "../../application/post.query.service";
import { HTTP_STATUSES } from "../../../../core/types/http-statuses";
import { errorsHandler } from "../../../../core/errors/errors.handler";
import { CreateCommentRequestPayload } from "../../../comments/routes/request-payloads/create-comment-request.payload";
import PostOutput from "../../application/output/post.output";
import { CommentListRequestPayload } from "../../../comments/routes/request-payloads/comment-list-request.payload";
import { setDefaultSortAndPaginationIfNotExist } from "../../../../core/helpers/set-default-sort-and-pagination";
import { PostListRequestPayload } from "../request-payloads/post-list-request.payload";
import UpdatePostRequestPayload from "../request-payloads/update-post-request.payload";
import { AuthQueryService } from "../../../auth/application/auth.query.service";
import { CommentsService } from "../../../comments/application/comments.service";
import { CommentQueryService } from "../../../comments/application/comment.query.service";

@injectable()
export class PostsController {
  constructor(
    @inject(PostsService) private postsService: PostsService,
    @inject(PostQueryService) private postQueryService: PostQueryService,
    @inject(AuthQueryService) private authQueryService: AuthQueryService,
    @inject(CommentsService) private commentsService: CommentsService,
    @inject(CommentQueryService)
    private commentQueryService: CommentQueryService,
  ) {}
  async createPostHandler(
    req: Request<{}, {}, CreatePostRequestPayload>,
    res: Response,
  ) {
    try {
      const createdPostId = await this.postsService.create(req.body);
      const post = await this.postQueryService.findByIdOrFail(createdPostId);

      res.status(HTTP_STATUSES.CREATE_201).send(post);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async createPostCommentHandler(
    req: Request<{ id: string }, {}, CreateCommentRequestPayload>,
    res: Response,
  ) {
    try {
      const foundPost = await this.postsService.findByIdOrFail(req.params.id);
      if (!foundPost) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
      }
      const userId = req.userId;

      if (!userId) {
        res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401);
        return;
      }
      const commentator = await this.authQueryService.findByIdOrFail(userId);
      const inputWithPost = {
        ...req.body,
        postId: req.params.id,
        commentatorInfo: {
          userId: commentator.userId,
          userLogin: commentator.login,
        },
      };
      const createdCommentId = await this.commentsService.create(inputWithPost);

      const commentOutput =
        await this.commentQueryService.findByIdOrFail(createdCommentId);

      res.status(HTTP_STATUSES.CREATE_201).send(commentOutput);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async deleteAllPostsHandler(req: Request, res: Response): Promise<void> {
    try {
      await this.postsService.deleteMany();
      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async deletePostHandler(
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<void> {
    try {
      const postIndex = await this.postsService.findIndex(req.params.id);
      if (!postIndex) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
      }
      await this.postsService.delete(req.params.id);
      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
      return;
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async findPostHandler(
    req: Request<{ id: string }>,
    res: Response<PostOutput>,
  ): Promise<void> {
    try {
      const foundPost = await this.postQueryService.findByIdOrFail(
        req.params.id,
      );
      res.status(HTTP_STATUSES.OK_200).json(foundPost);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async getPostCommentListHandler(
    req: Request<{ id: string }, {}, {}, CommentListRequestPayload>,
    res: Response,
  ) {
    try {
      const foundPost = await this.postsService.findByIdOrFail(req.params.id);

      const queryInput = setDefaultSortAndPaginationIfNotExist(req.query);
      const commentsListOutput =
        await this.commentQueryService.findCommentsByPost(
          queryInput,
          foundPost._id.toString(),
          req.userId ?? undefined,
        );
      res.send(commentsListOutput); //200 па змоўчаньні і ў json фармаце для аб'екта
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async getPostListHandler(
    req: Request<{}, {}, {}, PostListRequestPayload>,
    res: Response,
  ): Promise<void> {
    try {
      const queryInput = setDefaultSortAndPaginationIfNotExist(
        req.query,
      ) as PostListRequestPayload;
      const postsListOutput = await this.postQueryService.findMany(queryInput);
      res.send(postsListOutput);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async updatePostHandler(
    req: Request<{ id: string }, {}, UpdatePostRequestPayload>,
    res: Response<PostOutput>,
  ) {
    try {
      const id = req.params.id;
      const postIndex = await this.postsService.findIndex(id);
      if (!postIndex) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
      }

      await this.postsService.update({ id, ...req.body });

      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
      return;
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }
}
