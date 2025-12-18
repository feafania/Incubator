import { RateLimitDocument, RateLimitModel } from "../domain/rate-limit";
import { RepositoryNotFoundError } from "../../../core/errors/repository-not-found.error";
import { injectable } from "inversify";
import mongoose from "mongoose";

@injectable()
export class RateLimitRepository {
  async add(request: RateLimitDocument): Promise<RateLimitDocument> {
    return await request.save();
  }

  async countRecent(ip: string, url: string, since: Date): Promise<number> {
    return RateLimitModel.countDocuments({
      ip,
      url,
      createdAt: { $gte: since },
    });
  }

  async delete(id: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new RepositoryNotFoundError("Request not exist");
    }

    const deleteResult = await RateLimitModel.deleteOne({
      _id: new mongoose.Types.ObjectId(id),
    });

    if (deleteResult.deletedCount < 1) {
      console.log("No request for delete");
      throw new RepositoryNotFoundError("Request not exist");
    }

    return;
  }

  async deleteMany(): Promise<void> {
    await RateLimitModel.deleteMany({});
  }
}
