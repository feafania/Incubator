import { UpdateCommentDomainDto } from "../../../src/features/comments/domain/update-comment-domain.dto";
import { randomUUID } from "node:crypto";

export function createCommentDto(): UpdateCommentDomainDto {
  const unique = randomUUID().slice(0, 8); // кароткі унікальны ідэнтыфікатар

  return {
    content: `This is a test comment with unique id ${unique}. It is long enough to pass validation.`,
  };
}
