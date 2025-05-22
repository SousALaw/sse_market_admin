// import { getTokenWithExpiry } from "../auth";
import { requestFunc } from "../req";

/**
 * @description 获取用户的邮箱、身份、用户名、手机
 *              只有登录的时候使用
 *
 * @returns {Promise}
 */
async function getInfo() {
    try {
        const res = await requestFunc(`/admininfo`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }, true);
        const data = await res.json();
        return data.data.user;
    } catch (e) {
        alert(e)
        console.error(e);
    }
}

export { getInfo }