import { describe, it, expect, vi, beforeEach } from "vitest";


vi.mock("../src/jwt/jwt.has.js")

vi.mock("../src/config.load.js", () => ({
    default: {
        root: { username: "root", password: "rootpass" },
        jwt: { secret: "secret" },
    },
}));

import jwtHas from "../src/jwt/jwt.has";
//import configEnv from "../src/config.load.js";
import permit from "../src/handle/middlewere/permit";
import errExep from "../src/errExep";


describe("authMiddleware", () => {
    const next = vi.fn();
    let req, res;

    beforeEach(() => {
        req = { cookies: {} };
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };
        next.mockClear();
        res.status.mockClear();
        res.json.mockClear();
    });

    it("should return 401 if token is missing", () => {
        const middleware = permit([0, 1]);
        middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ msg: errExep.TOKEN_INVALID });
        expect(next).not.toHaveBeenCalled();
    });

    it("should return 401 if token is invalid", () => {
        req.cookies.token = "bad-token";
        jwtHas.verify.mockImplementation(() => { throw new Error("invalid"); });

        const middleware = permit([0, 1]);
        middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ msg: errExep.TOKEN_INVALID });
        expect(next).not.toHaveBeenCalled();
    });

    it("should return 401 if role is not allowed", () => {
        req.cookies.token = "valid-token";
        jwtHas.verify.mockReturnValue({ role: 2 });

        const middleware = permit([0, 1]);
        middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ msg: errExep.TOKEN_INVALID });
        expect(next).not.toHaveBeenCalled();
    });

    it("should call next if token is valid and role allowed", () => {
        req.cookies.token = "valid-token";
        const payload = { id: 1, role: 1, username: "user" };
        jwtHas.verify.mockReturnValue(payload);

        const middleware = permit([1, 2]);
        middleware(req, res, next);

        expect(req.payload).toEqual(payload);
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });
});
