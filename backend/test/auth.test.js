import { describe, it, expect, vi, beforeEach } from "vitest";

// 🔥 Mock module ก่อน import service
vi.mock("../src/repo/auth.js", () => ({
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

vi.mock("../src/jwt/jwt.has.js")

vi.mock("../src/config.load.js", () => ({
  default: {
    root: { username: "root", password: "rootpass" },
    jwt: { secret: "secret" },
  },
}));


import authRepo from "../src/repo/auth.js";
import jwthas from "../src/jwt/jwt.has.js";
import authUsecase from "./src/usecase/auth.js";
import errExep from "../src/errExep.js";
import configEnv from "../src/config.load.js";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("authUsecase", () => {

  it("create_root should call create_by_id", async () => {
    authRepo.create_by_id.mockResolvedValue(1);

    await authUsecase.create_root();

    expect(authRepo.create_by_id).toHaveBeenCalledWith(
      -1,
      configEnv.root.username,
      configEnv.root.password,
      0
    );
  });

  it("create should throw error if role invalid", async () => {
    await expect(authUsecase.create("user1", "pass", 3)).rejects.toThrow(errExep.ROLE_INVALID);
  });

  it("create should throw error if username used", async () => {
    authRepo.get_by_username.mockResolvedValue([{ id: 1 }]);

    await expect(authUsecase.create("user1", "pass", 1)).rejects.toThrow(errExep.USER_USED);
  });

  it("create should call authRepo.create and return id", async () => {
    authRepo.get_by_username.mockResolvedValue([]);
    authRepo.create.mockResolvedValue(42);

    const result = await authUsecase.create("user1", "pass", 1);

    expect(authRepo.create).toHaveBeenCalledWith("user1", "pass", 1);
    expect(result).toEqual({ id: 42, username: "user1", role: 1 });
  });

  it("login should throw USER_NOT_FOUND if no user", async () => {
    authRepo.get_by_username.mockResolvedValue([]);

    await expect(authUsecase.login("user1", "pass")).rejects.toThrow(errExep.USER_NOT_FOUND);
  });

  it("login should throw PASSWORD_INVALID if wrong password", async () => {
    authRepo.get_by_username.mockResolvedValue([{ id: 1, username: "user1", password: "123", role: 1 }]);

    await expect(authUsecase.login("user1", "wrong")).rejects.toThrow(errExep.PASSWORD_INVALID);
  });

  it("login should return payload and token", async () => {

    const payload = { id: 1, username: "user1", role: 1 };
    const token = "fake-token";

    authRepo.get_by_username.mockResolvedValue([{ id: 1, username: "user1", password: "123", role: 1 }]);
    await jwthas.sign.mockReturnValue(token)

    const result = await authUsecase.login("user1", "123");

    expect(result.token).toEqual(token)
    expect(result.payload).toEqual(payload);

  });

  it("me should throw TOKEN_INVALID if jwt.verify fails", async () => {
    jwthas.verify.mockImplementation(() => {
      throw new Error("jwt malformed");
    });
    await expect(authUsecase.me("badtoken")).rejects.toThrow(errExep.TOKEN_INVALID);
  });

  it("me should throw USER_NOT_FOUND if decoded user not found", async () => {
    jwthas.verify.mockReturnValue({ id: 2, username: "user2" });
    authRepo.get_by_id.mockReturnValue([]);

    await expect(authUsecase.me("token")).rejects.toThrow(errExep.USER_NOT_FOUND);
  });

  it("me should return decode if root user", async () => {
    jwthas.verify.mockReturnValue({ id: -1, username: "root" });

    const result = await authUsecase.me("token");
    expect(result).toEqual({ id: -1, username: "root" });
  });

});
