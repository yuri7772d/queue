// test/file.test.js
import { describe, it, expect, vi, beforeEach } from "vitest";


// Mock repos และ fs
vi.mock("../src/repo/file.js", () => ({
  default: {
    create:vi.fn(),
    listing:vi.fn(),
    delete_by_id:vi.fn(),
    get_by_id:vi.fn()
  },
}));
vi.mock("../src/repo/queue.js", () => ({
  default: {
    create_by_id: vi.fn(),
    create: vi.fn(),
    get_by_username: vi.fn(),
    get_by_id: vi.fn(),
    listing: vi.fn(),
    remove_by_id: vi.fn(),
    update: vi.fn(),
  },
}));
vi.mock("../src/fs/file.system.js");

import fileUsecase from "../src/usecase/file.js";
import fileRepo from "../src/repo/file.js";
import queueRepo from "../src/repo/queue.js";
import fileSystem from "../src/fs/file.system.js";
import errExep from "../src/errExep.js";
beforeEach(() => {
  vi.clearAllMocks();
});

describe("fileUsecase", () => {

  it("upload should succeed when auth_id matches", async () => {
    queueRepo.get_by_id.mockResolvedValue([{ id: 1, auth_id: 5 }]);
    fileRepo.create.mockResolvedValue(101);

    const result = await fileUsecase.upload(5, 1, "test.png", "file.png", "image/png", 1024);
    expect(result).toEqual({
      file_id: 101,
      file_url: "files/file.png"
    });
  });

  it("upload should throw QUEUE_NOT_FOUND if queue not exists", async () => {
    queueRepo.get_by_id.mockResolvedValue([]);
    await expect(fileUsecase.upload(1, 99, "a", "b", "c", 0))
      .rejects.toThrow(errExep.QUEUE_NOT_FOUND);
  });

  it("upload should throw NO_PERMISSION_UPLOAD_FILE if auth_id mismatch", async () => {
    queueRepo.get_by_id.mockResolvedValue([{ id: 1, auth_id: 2 }]);
    await expect(fileUsecase.upload(5, 1, "a", "b", "c", 0))
      .rejects.toThrow(errExep.NO_PERMISSION_UPLOAD_FILE);
  });

  it("listing should return files from repo", async () => {
    fileRepo.listing.mockResolvedValue([{ id: 1 }]);
    const result = await fileUsecase.listing(1);
    expect(result).toEqual([{ id: 1 }]);
  });

  it("delete_by_id should succeed", async () => {
    queueRepo.get_by_id.mockResolvedValue([{ id: 1, auth_id: 5 }]);
    fileRepo.get_by_id.mockResolvedValue([{ file_name: "file.png" }]);
    fileRepo.delete_by_id.mockResolvedValue(true);

    await fileUsecase.delete_by_id(5, 1);
    expect(fileRepo.delete_by_id).toHaveBeenCalledWith(1);
    expect(fileSystem.unlink).toHaveBeenCalledWith("files/file.png");
  });

  it("delete_by_id should throw FILE_NOT_FOUND if file not exists", async () => {
    queueRepo.get_by_id.mockResolvedValue([{ id: 1, auth_id: 5 }]);
    fileRepo.get_by_id.mockResolvedValue([]);
    await expect(fileUsecase.delete_by_id(5, 1))
      .rejects.toThrow(errExep.FILE_NOT_FOUND);
  });

  it("get_by_id should return file info", async () => {
    fileRepo.get_by_id.mockResolvedValue([{ file_name: "file.png", original_name: "test.png", mime_type: "image/png" }]);
    const result = await fileUsecase.get_by_id(1);
    expect(result).toEqual({
      path: "files/file.png",
      original_name: "test.png",
      mime_type: "image/png"
    });
  });

  it("get_by_id should throw FILE_NOT_FOUND if no file", async () => {
    fileRepo.get_by_id.mockResolvedValue([]);
    await expect(fileUsecase.get_by_id(99)).rejects.toThrow(errExep.FILE_NOT_FOUND);
  });

});
