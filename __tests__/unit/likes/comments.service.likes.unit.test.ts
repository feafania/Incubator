import { CommentsService } from "../../../src/features/comments/application/comments.service";
import { LikeStatus } from "../../../src/features/likes/domain/like-status-type";
import { SetLikeCommand } from "../../../src/features/likes/application/command-handlers/like-commands";
import { commentsRepositoryMock } from "../../__mocks__/comments.repository.mock";
import mongoose from "mongoose";
import { likesServiceMock } from "../../__mocks__/likes.service.mock";
import { LikesService } from "../../../src/features/likes/application/likes.service";

describe("CommentsService - setLikeStatus", () => {
  let commentsService: CommentsService;

  const fakeComment: any = {
    _id: new mongoose.Types.ObjectId(),
    setLikeCount: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(() => {
    commentsService = new CommentsService(
      commentsRepositoryMock,
      likesServiceMock as LikesService,
    );

    jest.clearAllMocks();
  });

  it("should create like if not exists", async () => {
    (commentsRepositoryMock.findByIdOrFail as jest.Mock).mockResolvedValue(
      fakeComment,
    );
    (likesServiceMock.findByAuthorAndParent as jest.Mock).mockResolvedValue(
      null,
    );

    const command: SetLikeCommand = {
      status: LikeStatus.LIKE,
      userId: "user1",
      entityId: "comment1",
    };

    await commentsService.setLikeStatus(command);

    expect(likesServiceMock.create).toHaveBeenCalledWith({
      status: LikeStatus.LIKE,
      authorId: "user1",
      parentId: "comment1",
    });

    expect(fakeComment.setLikeCount).toHaveBeenCalledWith(
      LikeStatus.LIKE,
      LikeStatus.NONE,
    );

    expect(commentsRepositoryMock.save).toHaveBeenCalledWith(fakeComment);
  });

  it("should update like if exists", async () => {
    (commentsRepositoryMock.findByIdOrFail as jest.Mock).mockResolvedValue(
      fakeComment,
    );
    (likesServiceMock.findByAuthorAndParent as jest.Mock).mockResolvedValue({
      _id: "like1",
      status: LikeStatus.LIKE,
    });

    const command: SetLikeCommand = {
      status: LikeStatus.DISLIKE,
      userId: "user1",
      entityId: "comment1",
    };

    await commentsService.setLikeStatus(command);

    expect(likesServiceMock.update).toHaveBeenCalledWith({
      id: "like1",
      status: LikeStatus.DISLIKE,
    });

    expect(fakeComment.setLikeCount).toHaveBeenCalledWith(
      LikeStatus.DISLIKE,
      LikeStatus.LIKE,
    );

    expect(commentsRepositoryMock.save).toHaveBeenCalledWith(fakeComment);
  });
});
