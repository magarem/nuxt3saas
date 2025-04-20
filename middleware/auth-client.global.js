// middleware/auth-check.global.js
// import jwt from 'jsonwebtoken';

export default defineNuxtRouteMiddleware(async (to, from) => {

	console.log('Auth check middleware triggered');
	//    console.log('To route:', to);
	//    console.log('From route:', from);

	const allowedPaths = [
		'/auth/login',
		'/forbidden',
		'/dashboard',
		'/password',
		'/profile',
		'/register',
		'/verify-email',
		'/registerSuccess',
		'/forgotPasswordEmail',
		'/reset-password',
		'/api'
	];

	if (allowedPaths.some(path => to.path.includes(path))) {
		console.log('acesso a páginas base:', to);
		return;
	}

	//    console.log('acesso a página comum:', to);

	let a = to.path.split('/')
	if (a.length > 0) {
		console.log('domínio:', a[1]);
		let domain = a[1]
		let page = a[2] || ''
		if (page) {
			const response = await $fetch(`/api/${domain}/${page}`);
			console.log('response:', response);
			if (response.statusCode === 404) {
				console.log('acesso negado');
				return navigateTo(`/${domain}/forbidden`);
			}
			if (response.statusCode === 222) {
				console.log('acesso negado');
				return navigateTo(`/${domain}/auth/login`);
			}
		} else {
			console.log('dashboard');
		}

	}


});
