import { requestFunc } from "../req";
async function deletePost(id) {
    try {
        const res = await requestFunc(
            `/adminDeletePost`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {
                    PostID: id,
                }
            },
            true
        );
        return
    } catch (e) {
        console.error(e);
        return null
    }
}

async function isHighQuality(id) {
    try {
        const res = await requestFunc(
            `/markHQPost`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {
                    PostID: id,
                },
            },
            true
        );
        return
    } catch (e) {
        console.error(e)
        return false;
    }
}
async function removeHighQuality(userid) {
    try {
        const res = await requestFunc(
            `/removeHQPost`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {
                    PostID: userid,
                },
            },
            true
        );
        return
    } catch (e) {
        console.error(e)
        return false;
    }
}
async function muteUser(params) {
    try {
        const res = await requestFunc(
            `/muteUser`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {},
            },
            true
        );
        return
    } catch (e) {
        console.error(e)
        return false;
    }
}
async function releaseUser(params) {
    try {
        const res = await requestFunc(
            `/release`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {},
            },
            true
        );
        return
    } catch (e) {
        console.error(e)
        return false;
    }
}

export { deletePost, isHighQuality, removeHighQuality, muteUser, releaseUser }