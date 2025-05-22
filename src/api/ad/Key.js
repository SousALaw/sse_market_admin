import { keysOf } from "element-plus/es/utils/objects.mjs";
import { requestFunc } from "../req";

async function addKey(key) {
    try {
        const res = await requestFunc(
            `/addKey`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {
                    Key: key,
                    Used: false,
                },
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
export { addKey }