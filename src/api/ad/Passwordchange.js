import { requestFunc } from "../req";
import { setPassword } from "../LoginAndRegister/utils";
async function passwordChange(account, old_password, new_password) {
    try {
        const res = await requestFunc(
            `/changePassword`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {
                    Account: account,
                    Password1: setPassword(old_password, '16bit secret key'),
                    Password2: setPassword(new_password, '16bit secret key')
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

export { passwordChange }