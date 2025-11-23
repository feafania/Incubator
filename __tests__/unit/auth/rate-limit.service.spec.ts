import { RateLimitService } from "../../../src/features/rate-limit/application/rate-limit.service";
import { RateLimitRepository } from "../../../src/features/rate-limit/repositories/rate-limit.repository";
import { RateLimit } from "../../../src/features/rate-limit/domain/rate-limit";

describe("RateLimitService Unit Tests", () => {
  let service: RateLimitService;
  let repository: jest.Mocked<RateLimitRepository>;
  const command = {
    ip: "127.0.0.1",
    url: "my url",
  };

  beforeEach(() => {
    repository = {
      add: jest.fn(),
      delete: jest.fn(),
      countRecent: jest.fn(),
      deleteMany: jest.fn(),
    } as unknown as jest.Mocked<RateLimitRepository>;

    service = new RateLimitService(repository);
  });

  // ---------------------------------------------------------------------
  // ✔ register()
  // ---------------------------------------------------------------------

  it("should register a new request event", async () => {
    await service.register(command);
    expect(repository.add).toHaveBeenCalledTimes(1);
    // mock.calls -гэта масіў усіх выклікаў мок-функцыі.
    // Кожны элемент — гэта масіў аргументаў аднаго выкліку.
    const arg = repository.add.mock.calls[0][0];
    expect(arg).toBeInstanceOf(RateLimit);
    expect(arg.ip).toBe(command.ip);
    expect(arg.url).toBe(command.url);
  });

  // ---------------------------------------------------------------------
  // ✔ isLimited()
  // ---------------------------------------------------------------------

  it("should return false if request count is below limit", async () => {
    repository.countRecent.mockResolvedValue(3);

    const result = await service.isLimited(command.ip, command.url);

    expect(result).toBe(false);
    expect(repository.countRecent).toHaveBeenCalled();
  });

  it("should return true if request count exceeds limit", async () => {
    repository.countRecent.mockResolvedValue(6);

    const result = await service.isLimited(command.ip, command.url);

    expect(result).toBe(true);
  });

  // ---------------------------------------------------------------------
  // ✔ delete()
  // ---------------------------------------------------------------------

  it("should delete record successfully", async () => {
    const id = "my id";
    await service.delete(id);

    expect(repository.delete).toHaveBeenCalledWith(id);
  });

  it("should throw error if ID is invalid", async () => {
    repository.delete.mockRejectedValue(new Error("my error"));
    await expect(service.delete("not-valid-id")).rejects.toThrow("my error");
  });

  // ---------------------------------------------------------------------
  // ✔ deleteMany()
  // ---------------------------------------------------------------------

  it("should delete many records", async () => {
    await service.deleteMany();

    expect(repository.deleteMany).toHaveBeenCalledTimes(1);
  });
});
