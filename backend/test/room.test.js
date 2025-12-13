// test/room.test.js
import { describe, it, expect, vi, beforeEach } from "vitest";


// 🔥 ต้อง mock ก่อน import usecase
vi.mock("../src/repo/room.js", () => ({
    default: {
        create: vi.fn(),
        listing: vi.fn(),
        edit: vi.fn(),
        remove: vi.fn()
    },
}));
import roomUsecase from "../src/usecase/room.js";
import roomRepo from "../src/repo/room.js";
import errExep from "../src/errExep.js";
beforeEach(() => {
    vi.clearAllMocks();
});

describe("roomUsecase", () => {

    it("create should return room_id if success", async () => {
        roomRepo.create.mockResolvedValue(123);

        const result = await roomUsecase.create("Room A");
        expect(result).toEqual({ room_id: 123 });
        expect(roomRepo.create).toHaveBeenCalledWith("Room A");
    });

    it("create should throw CREATE_FAIL if repo returns falsy", async () => {
        roomRepo.create.mockResolvedValue(0);

        await expect(roomUsecase.create("Room B")).rejects.toThrow(errExep.CREATE_FAIL);
    });

    it("edit should call repo.edit and return result", async () => {
        roomRepo.edit.mockResolvedValue(true);

        const result = await roomUsecase.edit(1, "New Name");
        expect(result).toBe(true);
        expect(roomRepo.edit).toHaveBeenCalledWith(1, "New Name");
    });

    it("listing should call repo.listing with pagination", async () => {
        const fakeList = [{ id: 1, name: "Room A" }];
        roomRepo.listing.mockResolvedValue(fakeList);

        const result = await roomUsecase.listing(1, 10);
        expect(result).toEqual(fakeList);
        expect(roomRepo.listing).toHaveBeenCalledWith(1, 10);
    });

    it("remove should call repo.remove with room_id", async () => {
        roomRepo.remove.mockResolvedValue(true);

        const result = await roomUsecase.remove(1);
        expect(result).toBe(true);
        expect(roomRepo.remove).toHaveBeenCalledWith(1);
    });

});
