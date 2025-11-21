import { RateLimitRepository } from "../repositories/rate-limit.repository";
import { ObjectId } from "mongodb";
import { RepositoryNotFoundError } from "../../../core/errors/repository-not-found.error";
import { rateLimitCollection } from "../../../db/mongo.db";

import { RegisterRequestCommand } from "./command-handlers/register-request-commands";
import { RateLimit } from "../domain/rate-limit";
import { RateLimitDomainDto } from "../domain/rate-limit-domain.dto.ts";

export class RateLimitService {
  private rateLimitRepository: RateLimitRepository;
  private RATE_LIMIT_TIME = 10; //sec
  private RATE_LIMIT_COUNT = 5;
  constructor(rateLimitRepository?: RateLimitRepository) {
    this.rateLimitRepository = rateLimitRepository ?? new RateLimitRepository();
  }

  async register(command: RegisterRequestCommand): Promise<void> {
    const newRequestCommand: RateLimitDomainDto = {
      ...command,
    };

    const newRequest = RateLimit.create(newRequestCommand);

    await this.rateLimitRepository.add(newRequest);
  }

  async isLimited(ip: string, url: string): Promise<boolean> {
    const rateLimitAgo = new Date(Date.now() - this.RATE_LIMIT_TIME * 1000);

    const count = await this.rateLimitRepository.countRecent(
      ip,
      url,
      rateLimitAgo,
    );

    return count >= this.RATE_LIMIT_COUNT;
  }

  async delete(id: string): Promise<void> {
    let objectId: ObjectId;

    try {
      objectId = new ObjectId(id);
    } catch {
      throw new RepositoryNotFoundError("User not exist");
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
    await this.rateLimitRepository.deleteMany();
  }
}

const rateLimitService = new RateLimitService();

export default rateLimitService;
