// test/queue.test.js
import { describe, it, expect, vi, beforeEach } from "vitest";


// 🔥 mock repo ก่อน import usecase
vi.mock("../src/repo/queue.js", () => ({
  default: {
    create:vi.fn(),
  listing:vi.fn(),
  get_by_date:vi.fn(),
  update_status:vi.fn(),
  update_title_detail:vi.fn(),
  get_by_id:vi.fn()
  },
}));

import queueUsecase from "../src/usecase/queue.js";
import queueRepo from "../src/repo/queue.js";
import errExep from "../src/errExep.js";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("queueUsecase", () => {

  it("booking should call repo.create and return queue info", async () => {
    queueRepo.create.mockResolvedValue(101);
    const result = await queueUsecase.booking("title", "detail", 1, 2, new Date("2025-12-15"));
    expect(result).toEqual({
      id: 101,
      title: "title",
      detail: "detail",
      room: 2,
      date: new Date("2025-12-15")
    });
    expect(queueRepo.create).toHaveBeenCalledWith("title", "detail", 1, 2, 0, new Date("2025-12-15"));
  });

  it("listing should return grouped dates with status", async () => {
    const date1 = new Date("2025-12-15");
    const date2 = new Date("2025-12-16");
    const fakeQueues = [
      { id: 1, date: date1, status: 0 },
      { id: 2, date: date1, status: 1 },
      { id: 3, date: date2, status: 0 },
    ];
    queueRepo.listing.mockResolvedValue(fakeQueues);

    const result = await queueUsecase.listing(0, 1, 2025, 12);
    expect(result).toEqual({
      room: 1,
      result: [
        { date: date1, status: 1 },
        { date: date2, status: 0 }
      ]
    });
  });

  it("get_by_date should call repo.get_by_date with correct params", async () => {
    const date = new Date("2025-12-15");
    queueRepo.get_by_date.mockResolvedValue([{ id: 1 }]);
    const result = await queueUsecase.get_by_date(0, 1, date);
    expect(result).toEqual([{ id: 1 }]);
    expect(queueRepo.get_by_date).toHaveBeenCalledWith(date, 1, [0, 1]);
  });

  it("approve should update statuses correctly", async () => {
    const date = new Date("2025-12-15");
    const room = 1;
    const queues = [
      { id: 1 },
      { id: 2 },
    ];
    queueRepo.get_by_date.mockResolvedValue(queues);
    queueRepo.update_status.mockResolvedValue(true);

    await queueUsecase.approve(1, date, room);

    expect(queueRepo.update_status).toHaveBeenCalledTimes(2);
    expect(queueRepo.update_status).toHaveBeenCalledWith(1, 1);
    expect(queueRepo.update_status).toHaveBeenCalledWith(2, 2);
  });

  it("approve should throw APPROVE_FAIL if queue not found", async () => {
    queueRepo.get_by_date.mockResolvedValue([]);
    await expect(queueUsecase.approve(1, new Date(), 1)).rejects.toThrow(errExep.APPROVE_FAIL);
  });

  it("cancal should reset statuses", async () => {
    const date = new Date("2025-12-15");
    const room = 1;
    const queues = [{ id: 1 }];
    queueRepo.get_by_date.mockResolvedValue(queues);
    queueRepo.update_status.mockResolvedValue(true);

    await queueUsecase.cancal(1, date, room);
    expect(queueRepo.update_status).toHaveBeenCalledWith(1, 0);
  });

  it("edit should update title and detail if auth_id matches", async () => {
    queueRepo.get_by_id.mockResolvedValue([{ id: 1, auth_id: 5 }]);
    queueRepo.update_title_detail.mockResolvedValue(true);

    await queueUsecase.edit(5, 1, "new title", "new detail");
    expect(queueRepo.update_title_detail).toHaveBeenCalledWith(1, "new title", "new detail");
  });

  it("edit should throw QUEUE_NOT_FOUND if no queue", async () => {
    queueRepo.get_by_id.mockResolvedValue([]);
    await expect(queueUsecase.edit(1, 99, "title", "detail")).rejects.toThrow(errExep.QUEUE_NOT_FOUND);
  });

  it("edit should throw NO_PERMISSION_UPDATE_QUEUE if auth_id mismatch", async () => {
    queueRepo.get_by_id.mockResolvedValue([{ id: 1, auth_id: 2 }]);
    await expect(queueUsecase.edit(5, 1, "title", "detail")).rejects.toThrow(errExep.NO_PERMISSION_UPDATE_QUEUE);
  });

});
