import { v4 as uuidv4 } from "uuid";
import { UpdateCommentDomainDto } from "../../../src/features/comments/domain/update-comment-domain.dto";

export function createCommentDto(): UpdateCommentDomainDto {
  const unique = uuidv4().slice(0, 8); // кароткі унікальны ідэнтыфікатар

  return {
    content: `This is a test comment with unique id ${unique}. It is long enough to pass validation.`,
  };
}
