import { requestFunc } from "../req";

/**
 *
 * @param {number} limit 返回多少个帖子
 * @param {number} offset 返回帖子的偏移量，0为最新的limit个帖子
 * @param {string} partition 分区
 * @param {string} searchsort home/save/history
 * @param {string} searchinfo 搜索信息
 * @param {string} userTelephone 手机号
 * @param {string} tag 老师名字
 * @returns
 */

async function getPosts() {
    try {
        const res = await requestFunc(
            `/adminBrowse`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {},
            },
            true
        );
        if (!res) {
            console.error('Request failed');
            return null;
        }
        const data = await res.json();
        return data;
    } catch (e) {
        console.error(e);
        return null
    }
}

/***
 * @description 获取当前分区和搜索条件下的帖子数量，课程专区无论是否有tag都只返回所有数量
 * @param {string} partition 分区
 * @param {string} searchsort home/save/history
 * @param {string} userTelephone
 * @returns {number} 返回帖子数量
 */

async function getPostsNum() {
    try {
        const res = await requestFunc(
            `/adminBrowseNum`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {},
            },
            true
        );
        const data = await res.json();
        return data;
    } catch (e) {
        console.error(e);
        return null
    }
}

async function getKeys() {
    try {
        const res = await requestFunc(
            `/getKey`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {},
            },
            true
        );
        const data = await res.json();
        return data;
    } catch (e) {
        console.error(e);
        return null
    }
}
export { getPosts, getPostsNum, getKeys };