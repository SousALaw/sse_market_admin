// import { setPassword } from './utils';
// import { requestFunc } from '../req';

// async function userRegister(
// 	email,
// 	name,
// 	password1,
// 	password2,
// 	// valiCode
// 	phone,
// ) {
// 	try {
// 		const res = await requestFunc(
// 			`/user/register`,
// 			{
// 				method: 'POST',
// 				headers: {
// 					'Content-Type': 'application/json',
// 				},
// 				body: {
// 					email: email,
// 					name: name,
// 					password: setPassword(password1, '16bit secret key'),
// 					password2: setPassword(password2, '16bit secret key'),
// 					phone: '',
// 					//valiCode: valiCode,
// 					phone: phone,
// 				},
// 			},
// 			false
// 		);
// 		const data = await res.json();
// 		return data;
// 	} catch (e) {
// 		alert(e);
// 		return null;
// 	}
// }

// export { userRegister };
