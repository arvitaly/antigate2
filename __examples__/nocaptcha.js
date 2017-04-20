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
// tslint:disable no-console
const Antigate_1 = require("./../Antigate");
const antigate = new Antigate_1.default({
    key: process.argv[2],
});
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        // tslint:disable-next-line:max-line-length
        const solution = yield antigate.getNoCaptcha("http://http.myjino.ru/recaptcha/test-get.php", "6Lc_aCMTAAAAABx7u2W0WPXnVbI_v6ZdbM6rYf16");
        console.log("text = ", solution);
    });
}
start();
