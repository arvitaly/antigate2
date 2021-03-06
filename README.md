# antigate2

Antigate client

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]
[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

# Install

    npm install antigate2 --save

# Usage

    import { Antigate } from "antigate2";

    const antigate = new Antigate({ key : "KEY" });
    
    async function getByImage(){
        const text = await antigate.getByBase64("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ....");
        console.log(text);
    }
    async function getNoCaptcha(){
        const solution = await antigate.getNoCaptcha("http://http.myjino.ru/recaptcha/test-get.php", "6Lc_aCMTAAAAABx7u2W0WPXnVbI_v6ZdbM6rYf16");
        console.log(solution.gRecaptchaResponse);
    }
    getByImage();
    getNoCaptcha();

# API

    public async getByBase64(data: string): Promise<string>
    public async getNoCaptcha(websiteURL: string, websiteKey: string) : INoCaptchaSolution;

    export interface INoCaptchaSolution {
        gRecaptchaResponse: string; // Хеш который необходимо подставить в форму с рекапчей в <textarea id="g-recaptcha-response" ..></textarea> . Имеет длину от 500 до 2190 байт.
        gRecaptchaResponseMD5: string; // Контрольная сумма gRecaptchaResponse в MD5. Передается только если добавить параметр isExtended со    значением true в методе getTaskResult. Сделано исключительно для отладки, чтобы разработчик мог убедиться что получает хэш целиком.
    }

# Test

    npm install
    npm test

[npm-image]: https://badge.fury.io/js/antigate2.svg
[npm-url]: https://npmjs.org/package/antigate2
[travis-image]: https://travis-ci.org/arvitaly/antigate2.svg?branch=master
[travis-url]: https://travis-ci.org/arvitaly/antigate2
[daviddm-image]: https://david-dm.org/arvitaly/antigate2.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/arvitaly/antigate2
[coveralls-image]: https://coveralls.io/repos/arvitaly/antigate2/badge.svg
[coveralls-url]: https://coveralls.io/r/arvitaly/antigate2