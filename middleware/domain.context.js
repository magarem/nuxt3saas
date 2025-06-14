// middleware/domain.context.js
import { setCurrentDomain } from '~/server/utils/db';

export default defineNuxtRouteMiddleware((to) => {
  // Extract domain from URL pattern: example.com/domain/...
  const domain = to.params.domain;
  
  if (!domain) {
    return navigateTo('/error?message=Missing+domain');
  }

  // Set domain for all subsequent DB operations
  setCurrentDomain(domain);
  
  // Optional: Verify DB exists
  const db = getDatabase();
  if (!db) {
    return navigateTo('/error?message=Invalid+domain');
  }
});