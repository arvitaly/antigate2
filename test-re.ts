// tslint:disable no-console
import Antigate from "./Antigate";

const antigate = new Antigate({
    key: process.argv[2],
});
async function start() {
    // tslint:disable-next-line:max-line-length
    const solution = await antigate.getRecaptcha("http://http.myjino.ru/recaptcha/test-get.php", "6Lc_aCMTAAAAABx7u2W0WPXnVbI_v6ZdbM6rYf16");
    console.log("text = ", solution);

}
start();
