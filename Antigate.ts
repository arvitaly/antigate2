// tslint:disable max-line-length
import fetch from "node-fetch";
import constants from "./constants";
export interface IConfig {
    key: string;
    baseUrl?: string;
}
export interface IBaseTask {
    type: string;
}
export interface IImageToTextTask {
    type: "ImageToTextTask"; // Определяет тип объекта задачи
    body: string; // Содержимое файла капчи закодированное в base64.Убедитесь что шлете его без переносов строки.
    phrase?: boolean; // false - нет требований, true - работник должен ввести текст с одним или несколькими пробелами
    case?: boolean; // false - нет требований, true - работник увидит специальный сигнал что ответ необходимо вводить с учетом регистра
    numeric?: 0 | 1 | 2; // Integer	0 - нет требований, 1 - можно вводить только цифры, 2 - вводить можно любые символы кроме цифр
    math?: boolean; // false - нет требований, true - работник увидит специальный сигнал что на капче изображено математическое выражение и необходимо ввести на него ответ
    minLength?: number; // Integer	0..20, 0 - нет требований, > 1 - определяет минимальную длину ответа
    maxLength?: number; // Integer	0..20, 0 - нет требований, > 1 - определяет максимальную длину ответа
}
export interface INoCaptchaTaskProxyless {
    type: "NoCaptchaTaskProxyless";
    websiteURL: string; // Адрес страницы на которой решается капча
    websiteKey: string; // Ключ-индентификатор рекапчи на целевой странице. <div class="g-recaptcha" data-sitekey="ВОТ_ЭТОТ"></div>
    websiteSToken?: string; // Секретный токен для предыдущей версии рекапчи. В большинстве случаев сайты используют новую версию и этот токен не требуется.
}
export interface ICreateTaskResponse {
    errorId: number;
    errorCode: string;
    errorDescription: string;
    taskId: number;
}
export interface IGetTaskResultResponse {
    errorId: number; // Integer	Error identificator. 0 - no errors, the task has been successfully created, task ID located in taskId property, >1 - error identificator. Error code and short information transferred in errorCode and errorDescription properties
    errorCode: string; // Error code. Check out errors list.
    errorDescription: string; // Short information describing error
    status: "processing" | "ready"; // processing - task is not ready yet, ready - task complete, solution object can be found in solution property
    solution: IImageToTextSolution | INoCaptchaSolution; // Task result data
    cost: number; // Double.	Task cost in USD.
    ip: string; // IP from which the task was created.
    createTime: number; // Integer.	UNIX Timestamp of task creation.
    endTime: number; // Integer.	UNIX Timestamp of task completion.
    solveCount: number; // Integer. Number of workers who tried to complete your task
}
export interface IImageToTextSolution {
    text: string; // Captcha answer
    url: string; // Web address where captcha file can be downloaded. Available withing 48 hours after task creation.
}
export interface INoCaptchaSolution {
    gRecaptchaResponse: string; // Хеш который необходимо подставить в форму с рекапчей в <textarea id="g-recaptcha-response" ..></textarea> . Имеет длину от 500 до 2190 байт.
    gRecaptchaResponseMD5: string; // Контрольная сумма gRecaptchaResponse в MD5. Передается только если добавить параметр isExtended со значением true в методе getTaskResult. Сделано исключительно для отладки, чтобы разработчик мог убедиться что получает хэш целиком.
}
export interface ICreateTaskParams {
    clientKey?: string;
    task: IImageToTextTask | INoCaptchaTaskProxyless;
    softId?: number;
    languagePool: "en" | "rn";
}
class Antigate {
    constructor(protected config: IConfig) {
        if (!config.baseUrl) {
            config.baseUrl = "https://api.anti-captcha.com";
        }
    }
    public async createTask(params: ICreateTaskParams): Promise<ICreateTaskResponse> {
        if (!params.clientKey) {
            params.clientKey = this.config.key;
        }
        if (params.task.type === "ImageToTextTask") {
            params.task.body = params.task.body.replace("data:image/jpeg;base64,", "");
        }
        const res = await fetch(this.config.baseUrl + "/createTask", {
            method: "POST",
            body: JSON.stringify(params),
            headers: {
                "Content-Type": "application/json",
            },
        });
        return res.json();
    }
    public async getTaskResult(taskId: number): Promise<IGetTaskResultResponse> {
        const res = await fetch(this.config.baseUrl + "/getTaskResult", {
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
    }
    public async getNoCaptcha(websiteURL: string, websiteKey: string) {
        return (await this.request({
            type: "NoCaptchaTaskProxyless",
            websiteKey,
            websiteURL,
        } as INoCaptchaTaskProxyless, "en") as INoCaptchaSolution);
    }
    public async getByBase64(data: string): Promise<string> {
        return ((await this.request({
            type: "ImageToTextTask",
            body: data,
        }, "rn")) as IImageToTextSolution).text;
    }
    protected async request(task: IImageToTextTask | INoCaptchaTaskProxyless, languagePool: "en" | "rn"): Promise<INoCaptchaSolution | IImageToTextSolution> {
        const response = await this.createTask({
            languagePool,
            task,
        });
        if (response.errorId > 0) {
            throw new Error(response.errorCode + ":" + response.errorDescription);
        }
        do {
            const res = await this.getTaskResult(response.taskId);
            if (res.errorId > 0) {
                throw new Error(res.errorCode + ":" + res.errorDescription);
            }
            if (res.status === "ready") {
                return res.solution;
            }
        } while (true);
    }
}
export default Antigate;
