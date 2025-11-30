import { RateLimitRepository } from "../repositories/rate-limit.repository";

import { RegisterRequestCommand } from "./command-handlers/register-request-commands";
import { RateLimit } from "../domain/rate-limit";
import { RateLimitDomainDto } from "../domain/rate-limit-domain.dto.ts";
import { inject, injectable } from "inversify";

@injectable()
export class RateLimitService {
  private RATE_LIMIT_TIME = 10; //sec
  private RATE_LIMIT_COUNT = 5;
  constructor(
    @inject(RateLimitRepository)
    private rateLimitRepository: RateLimitRepository,
  ) {}

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
    await this.rateLimitRepository.delete(id);
  }

  async deleteMany(): Promise<void> {
    await this.rateLimitRepository.deleteMany();
  }
}
