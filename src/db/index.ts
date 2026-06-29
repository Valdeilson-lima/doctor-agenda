import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { defineRelations } from "drizzle-orm/relations";
import * as schema from "./schema";

const relations = defineRelations(schema);

const db = drizzle(process.env.DATABASE_URL!, { relations });

export default db;
