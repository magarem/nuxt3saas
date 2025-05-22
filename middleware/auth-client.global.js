// middleware/auth-check.global.js
// import jwt from 'jsonwebtoken';
const {getUser} = useUser();

export default defineNuxtRouteMiddleware(async (to, from) => {

	const { domain, user: userFromUrl, page } = useNuxtApp().$urlContext
	console.log("domain----------------:", domain);
	console.log("userFromUrl----------------:", userFromUrl);

	console.log("Auth check middleware triggered");
	console.log("To route:", to);
	console.log("From route:", from);

	console.log("page:", page);

	if (domain) {
	// if (!domain && to.path !== "/") {
	// 	console.log("Domain or user not found in URL context");
	// 	return navigateTo("/", {external: true});
	// }

	
	console.log("Domain and user found in URL context");

	// Buscar usuário atual
	const {data: user, error} = await getUser();
	console.log("User data:", user.value);

	console.log("user.value.user?.username:", user.value.user?.username);
	if (user.value.user?.username) {
		const domainFromUrl = to.path.split("/")[1];
		const domainFromToken = user.value.user?.domain;

		const usernameFromUrl = to.path.split("/")[2];
		const usernameFromToken = user.value.user?.username;


		console.log("domainFromUrl:", domainFromUrl);
		console.log("domainFromToken:", domainFromToken);
		console.log("usernameFromUrl:", usernameFromUrl);
		console.log("usernameFromToken:", usernameFromToken);
		
		// verifica se o domínio e o usuário do token são iguais aos da URL
		if (usernameFromUrl !== 'auth') {
			if (domainFromUrl !== domainFromToken || usernameFromUrl !== usernameFromToken) {
				console.log("Domain mismatch, redirecting to login page");
				return navigateTo(`/${domainFromUrl}/auth/login`, {external: true});
			}
		}
	}

	const allowedPaths = [
		"/dashboard",
		"login",
		"/forbidden",
		"/password",
		"/profile",
		"/register",
		"/verify-email",
		"/registerSuccess",
		"/forgotPasswordEmail",
		"/reset-password",
		"/api",
		"/messages",
		"/domain-not-exists",
		"/websocket-test"
	];

	if (allowedPaths.some(path => to.path.includes(path))) {
		console.log("acesso a páginas base:", to);
		return;
	}

	if (page) {
		console.log("`/api/${domain}/${userFromUrl}/${page}`:", `/api/${domain}/${userFromUrl}/${page}`);
		
		const response = await $fetch(`/api/${domain}/${userFromUrl}/${page}`);
		console.log("response:", response);
		if (response.statusCode === 404) {
			console.log("acesso negado");
			return navigateTo(`/${domain}/${userFromUrl}/forbidden`);
		}
		if (response.statusCode === 222) {
			console.log("acesso negado");
			return navigateTo(`/${domain}/auth/login`);
		}
	} else {
		console.log("dashboard");
	}
}
});
