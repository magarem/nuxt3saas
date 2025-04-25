// server/api/check-domain/[domain].js
import { checkDomainExists } from '../../utils/db';

export default defineEventHandler(async (event) => {
  const domain = event.context.params?.domain;

  if (!domain) {
    return { exists: false };
  }

  const exists = await databaseExists(domain);

  return { exists: exists };
});