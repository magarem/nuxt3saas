import {H3Event} from "h3";
import { getDatabase } from '~/server/utils/db';

export default defineEventHandler(async (event : H3Event) => {
  const domain = event.context.params.domain;
	const db = getDatabase(domain);
  return db.prepare('SELECT id, name FROM financial_categories ORDER BY name').all()
})
