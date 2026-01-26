import { PostsService } from "../../../src/features/posts/application/posts.service";
import { LikeStatus } from "../../../src/features/likes/domain/like-status-type";
import { SetLikeCommand } from "../../../src/features/likes/application/command-handlers/like-commands";
import { PostsRepository } from "../../../src/features/posts/repositories/posts.repository";
import { CommentsService } from "../../../src/features/comments/application/comments.service";
import { likesServiceMock } from "../../__mocks__/likes.service.mock";
import { Post } from "../../../src/features/posts/domain/posts";
import { LikesService } from "../../../src/features/likes/application/likes.service";

describe("PostsService - setLikeStatus", () => {
  let postsService: PostsService;

  const postsRepositoryMock: Partial<PostsRepository> = {
    findByIdOrFail: jest.fn(),
    save: jest.fn(),
  };

  const commentsServiceMock: Partial<CommentsService> = {
    deleteByPostId: jest.fn(),
  };

  const fakePost: Partial<Post> = {
    addToNewestLikes: jest.fn(),
    removeFromNewestLikes: jest.fn(),
    setLikeCount: jest.fn(),
  };

  beforeEach(() => {
    postsService = new PostsService(
      postsRepositoryMock as PostsRepository,
      likesServiceMock as LikesService,
      commentsServiceMock as CommentsService,
    );

    jest.clearAllMocks();
  });

  it("should add to newestLikes on LIKE if no previous like exists", async () => {
    (postsRepositoryMock.findByIdOrFail as jest.Mock).mockResolvedValue(
      fakePost,
    );
    (likesServiceMock.findByAuthorAndParent as jest.Mock).mockResolvedValue(
      null,
    );

    const command: SetLikeCommand = {
      status: LikeStatus.LIKE,
      userId: "user1",
      entityId: "post1",
    };

    await postsService.setLikeStatus(command);

    expect(fakePost.addToNewestLikes).toHaveBeenCalledWith("user1");
    expect(fakePost.setLikeCount).toHaveBeenCalledWith(
      LikeStatus.LIKE,
      LikeStatus.NONE,
    );
    expect(postsRepositoryMock.save).toHaveBeenCalledWith(fakePost);
    expect(likesServiceMock.create).toHaveBeenCalledWith({
      status: LikeStatus.LIKE,
      authorId: "user1",
      parentId: "post1",
    });
  });

  it("should remove from newestLikes when changing LIKE -> DISLIKE", async () => {
    (postsRepositoryMock.findByIdOrFail as jest.Mock).mockResolvedValue(
      fakePost,
    );
    (likesServiceMock.findByAuthorAndParent as jest.Mock).mockResolvedValue({
      _id: "like1",
      status: LikeStatus.LIKE,
    });

    const command: SetLikeCommand = {
      status: LikeStatus.DISLIKE,
      userId: "user1",
      entityId: "post1",
    };

    await postsService.setLikeStatus(command);

    expect(fakePost.removeFromNewestLikes).toHaveBeenCalledWith("user1");
    expect(fakePost.setLikeCount).toHaveBeenCalledWith(
      LikeStatus.DISLIKE,
      LikeStatus.LIKE,
    );
    expect(postsRepositoryMock.save).toHaveBeenCalledWith(fakePost);
    expect(likesServiceMock.update).toHaveBeenCalledWith({
      id: "like1",
      status: LikeStatus.DISLIKE,
    });
  });

  it("should add to newestLikes when changing DISLIKE to LIKE", async () => {
    (postsRepositoryMock.findByIdOrFail as jest.Mock).mockResolvedValue(
      fakePost,
    );
    (likesServiceMock.findByAuthorAndParent as jest.Mock).mockResolvedValue({
      _id: "like1",
      status: LikeStatus.DISLIKE,
    });

    const command: SetLikeCommand = {
      status: LikeStatus.LIKE,
      userId: "user1",
      entityId: "post1",
    };

    await postsService.setLikeStatus(command);

    expect(fakePost.addToNewestLikes).toHaveBeenCalledWith("user1");
    expect(fakePost.setLikeCount).toHaveBeenCalledWith(
      LikeStatus.LIKE,
      LikeStatus.DISLIKE,
    );
    expect(postsRepositoryMock.save).toHaveBeenCalledWith(fakePost);
    expect(likesServiceMock.update).toHaveBeenCalledWith({
      id: "like1",
      status: LikeStatus.LIKE,
    });
  });
});
