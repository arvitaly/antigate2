import { Server } from "http";
import express = require("express");
import bodyParser = require("body-parser");
import { Antigate } from "./..";
const port = 34578;
const base64Data = "/9j/4AAQSkZJRgABAQAAAQABAAD";
let server: Server;
let createTaskFn: jest.Mock<any>;
let getTaskResultFn: jest.Mock<any>;
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
it("when getByBase64, should call server with params", async () => {
    const key = "112";
    const antigate = new Antigate({
        key,
        baseUrl: "http://127.0.0.1:" + port,
    });
    createTaskFn.mockImplementation((url: string, _: any, body: any) => {
        expect(url).toMatchSnapshot();
        expect(body).toMatchSnapshot();
        return {
            taskId: 111,
        };
    });
    let attemptCount = 0;
    getTaskResultFn.mockImplementation((url: string, _: any, body: any) => {
        expect(url).toMatchSnapshot();
        expect(body).toMatchSnapshot();
        return {
            status: attemptCount++ ? "ready" : "processing",
            solution: {
                text: "Hello",
            },
        };
    });
    const result = await antigate.getByBase64("data:image/jpeg;base64," + base64Data);
    expect(result).toBe("Hello");
});

it("when nocaptcha, should call server with params", async () => {
    const key = "112";
    const antigate = new Antigate({
        key,
        baseUrl: "http://127.0.0.1:" + port,
    });
    createTaskFn.mockImplementation((url: string, _: any, body: any) => {
        expect(url).toMatchSnapshot();
        expect(body).toMatchSnapshot();
        return {
            taskId: 112,
        };
    });
    let attemptCount = 0;
    getTaskResultFn.mockImplementation((url: string, _: any, body: any) => {
        expect(url).toMatchSnapshot();
        expect(body).toMatchSnapshot();
        return {
            status: attemptCount++ ? "ready" : "processing",
            solution: {
                gRecaptchaResponse: "cpatchId",
            },
        };
    });
    const result = await antigate.getNoCaptcha("test1", "test2");
    expect(result).toMatchSnapshot();
});

afterEach((done) => {
    server.close(done);
});
