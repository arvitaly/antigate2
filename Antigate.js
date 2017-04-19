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
    }
    createTask(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!params.clientKey) {
                params.clientKey = this.config.key;
            }
            params.task.body = params.task.body.replace("data:image/jpeg;base64,", "");
            const res = yield node_fetch_1.default("https://api.anti-captcha.com/createTask", {
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
            const res = yield node_fetch_1.default("https://api.anti-captcha.com/getTaskResult", {
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
    getByBase64(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.createTask({
                languagePool: "rn",
                task: {
                    type: "ImageToTextTask",
                    body: data,
                },
            });
            if (response.errorId > 0) {
                throw new Error(response.errorCode + ":" + response.errorDescription);
            }
            let text = "";
            do {
                const res = yield this.getTaskResult(response.taskId);
                if (res.errorId > 0) {
                    throw new Error(res.errorCode + ":" + res.errorDescription);
                }
                if (res.status === "ready") {
                    text = res.solution.text;
                    break;
                }
            } while (text === "");
            return text;
        });
    }
}
exports.default = Antigate;
