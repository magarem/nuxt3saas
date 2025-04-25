// middleware/auth-check.global.js
// import jwt from 'jsonwebtoken';

export default defineNuxtRouteMiddleware(async (to, from) => {
  console.log("Auth check middleware triggered");
  console.log("To route:", to);
  console.log("From route:", from);

  const {data: ret} = await useFetch("/api/user");
  console.log("User data:", ret.value.statusCode);
  if (ret.value.statusCode == "401") {
    console.log("User not authenticated, redirecting to login page");
    // Redirect to the login page of the domain in the URL
    const domain = to.path.split("/")[1];
    console.log("Domain from URL:", domain);
    if (!to.path.endsWith("login")) {
		// location.href = `/${domain}/auth/login`;
    //   return navigateTo(`/${domain}/auth/login`);
    }
  }
else{
const domainFromUrl = to.path.split("/")[1];
  const domainFromToken = ret.value.user.domain;

  console.log("ret::::::", domainFromUrl === domainFromToken);
  //Check if the domain from the URL matches the domain from the token
  if (!to.path.endsWith("forbidden") && domainFromUrl !== domainFromToken) {
    console.log("Domain mismatch, redirecting to forbidden page");
    // return navigateTo(`/${domainFromUrl}/forbidden`);
  }

}
  

  const allowedPaths = [
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
    let page = a[2] || "";
    if (page) {
      const response = await $fetch(`/api/${domain}/${page}`);
      console.log("response:", response);
      if (response.statusCode === 404) {
        console.log("acesso negado");
        return navigateTo(`/${domain}/forbidden`);
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
