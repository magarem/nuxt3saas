// middleware/auth-check.global.js
// import jwt from 'jsonwebtoken';

export default defineNuxtRouteMiddleware(async (to, from) => {
	console.log("Auth check middleware triggered");
	console.log("To route:", to);
	console.log("From route:", from);

	const {data: ret} = await useFetch("/api/user");
	console.log("User data:", ret.value);
	if (ret.value.statusCode == "401") {
		console.log("User not authenticated, redirecting to login page");
		const domain = to.path.split("/")[1];
		console.log("Domain from URL:", domain);
		
	} else {
		const domainFromUrl = to.path.split("/")[1];
		const domainFromToken = ret.value.user.domain;

		const usernameFromUrl = to.path.split("/")[2];
		const usernameFromToken = ret.value.user.username;

		console.log("ret::::::", domainFromUrl === domainFromToken);
		// Check if the domain from the URL matches the domain from the token

		if (usernameFromUrl !== 'auth') {
			if (domainFromUrl !== domainFromToken || usernameFromUrl !== usernameFromToken) {
				console.log("Domain mismatch, redirecting to login page");
				return navigateTo(`/${domainFromUrl}/auth/login`);
			}
		}
	}


	const allowedPaths = [
		"/dashboard",
		"/auth/login",
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
		"/domain-not-exists"
	];

	if (allowedPaths.some(path => to.path.includes(path))) {
		console.log("acesso a páginas base:", to);
		return;
	}

	//    console.log('acesso a página comum:', to);

	let a = to.path.split("/");
	if (a.length > 0) {
		console.log("domínio:", a[1]);
		let domain = a[1];
    let user = a[2];
		let page = a[3] || "";
		if (page) {
      // if (page.includes("@")) {
      //   page = page.split("?")[0];
      // }

			const response = await $fetch(`/api/${domain}/${user}/${page}`);
			console.log("response:", response);
			if (response.statusCode === 404) {
				console.log("acesso negado");
				return navigateTo(`/${domain}/${user}/forbidden`);
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
