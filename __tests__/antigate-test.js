"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const __1 = require("./..");
const port = 34578;
const base64Data = "/9j/4AAQSkZJRgABAQAAAQABAAD";
let server;
let createTaskFn;
let getTaskResultFn;
beforeEach((done) => {
    const app = express();
    app.use(bodyParser.json());
    createTaskFn = jest.fn();
    getTaskResultFn = jest.fn();
    app.post("/createTask", (req, res) => {
        const result = createTaskFn(req.url, req.headers, req.body);
        res.send(JSON.stringify(result));
    });
    app.post("/getTaskResult", (req, res) => {
        const result = getTaskResultFn(req.url, req.headers, req.body);
        res.send(JSON.stringify(result));
    });
    server = app.listen(port, done);
});
it("when getByBase64, should call server with params", () => __awaiter(this, void 0, void 0, function* () {
    const key = "112";
    const antigate = new __1.Antigate({
        key,
        baseUrl: "http://127.0.0.1:" + port,
    });
    createTaskFn.mockImplementation((url, _, body) => {
        expect(url).toMatchSnapshot();
        expect(body).toMatchSnapshot();
        return {
            taskId: 111,
        };
    });
    let attemptCount = 0;
    getTaskResultFn.mockImplementation((url, _, body) => {
        expect(url).toMatchSnapshot();
        expect(body).toMatchSnapshot();
        return {
            status: attemptCount++ ? "ready" : "processing",
            solution: {
                text: "Hello",
            },
        };
    });
    const result = yield antigate.getByBase64("data:image/jpeg;base64," + base64Data);
    expect(result).toBe("Hello");
}));
it("when nocaptcha, should call server with params", () => __awaiter(this, void 0, void 0, function* () {
    const key = "112";
    const antigate = new __1.Antigate({
        key,
        baseUrl: "http://127.0.0.1:" + port,
    });
    createTaskFn.mockImplementation((url, _, body) => {
        expect(url).toMatchSnapshot();
        expect(body).toMatchSnapshot();
        return {
            taskId: 112,
        };
    });
    let attemptCount = 0;
    getTaskResultFn.mockImplementation((url, _, body) => {
        expect(url).toMatchSnapshot();
        expect(body).toMatchSnapshot();
        return {
            status: attemptCount++ ? "ready" : "processing",
            solution: {
                gRecaptchaResponse: "cpatchId",
            },
        };
    });
    const result = yield antigate.getNoCaptcha("test1", "test2");
    expect(result).toMatchSnapshot();
}));
afterEach((done) => {
    server.close(done);
});
