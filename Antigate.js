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
// tslint:disable max-line-length
const node_fetch_1 = require("node-fetch");
class Antigate {
    constructor(config) {
        this.config = config;
        if (!config.baseUrl) {
            config.baseUrl = "https://api.anti-captcha.com";
        }
    }
    createTask(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!params.clientKey) {
                params.clientKey = this.config.key;
            }
            if (params.task.type === "ImageToTextTask") {
                params.task.body = params.task.body.replace("data:image/jpeg;base64,", "");
            }
            const res = yield node_fetch_1.default(this.config.baseUrl + "/createTask", {
                method: "POST",
                body: JSON.stringify(params),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return res.json();
        });
    }
    getTaskResult(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield node_fetch_1.default(this.config.baseUrl + "/getTaskResult", {
                method: "POST",
                body: JSON.stringify({
                    clientKey: this.config.key,
                    taskId,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return res.json();
        });
    }
    getNoCaptcha(websiteURL, websiteKey) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.request({
                type: "NoCaptchaTaskProxyless",
                websiteKey,
                websiteURL,
            }, "en");
        });
    }
    getByBase64(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.request({
                type: "ImageToTextTask",
                body: data,
            }, "rn")).text;
        });
    }
    request(task, languagePool) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.createTask({
                languagePool,
                task,
            });
            if (response.errorId > 0) {
                throw new Error(response.errorCode + ":" + response.errorDescription);
            }
            do {
                const res = yield this.getTaskResult(response.taskId);
                if (res.errorId > 0) {
                    throw new Error(res.errorCode + ":" + res.errorDescription);
                }
                if (res.status === "ready") {
                    return res.solution;
                }
            } while (true);
        });
    }
}
exports.default = Antigate;
