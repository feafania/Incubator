import { rateLimitCollection } from "../../../db/mongo.db";
import { RateLimit } from "../domain/rate-limit";
import { ObjectId } from "mongodb";
import { RepositoryNotFoundError } from "../../../core/errors/repository-not-found.error";
import { injectable } from "inversify";

@injectable()
export class RateLimitRepository {
  async add(request: RateLimit): Promise<RateLimit> {
    const insertResult = await rateLimitCollection.insertOne(request);
    request._id = insertResult.insertedId;

    return request;
  }

  async countRecent(ip: string, url: string, since: Date): Promise<number> {
    return rateLimitCollection.countDocuments({
      ip,
      url,
      createdAt: { $gte: since },
    });
  }

  async delete(id: string): Promise<void> {
    let objectId: ObjectId;

    try {
      objectId = new ObjectId(id);
    } catch {
      throw new RepositoryNotFoundError("Request not exist");
    }

    const deleteResult = await rateLimitCollection.deleteOne({
      _id: objectId,
    });

    if (deleteResult.deletedCount < 1) {
      console.log("No request for delete");
      throw new RepositoryNotFoundError("Request not exist");
    }

    return;
  }

  async deleteMany(): Promise<void> {
    await rateLimitCollection.deleteMany({});
  }
}
