// db/schema.ts
import * as SQLite from 'expo-sqlite';
import routesData from './tables/routes.json';

export async function setupSchema(db: SQLite.SQLiteDatabase) {
    await db.execAsync('PRAGMA foreign_keys = ON;');

    // Create tables
    await db.execAsync(`
    CREATE TABLE IF NOT EXISTS routes (
      office_id INTEGER NOT NULL,
      route_num INTEGER NOT NULL,
      map TEXT,
      PRIMARY KEY (office_id, route_num)
    );
  `);

    // Seed routes — compile once, execute many
    const stmt = await db.prepareAsync(
        `INSERT OR IGNORE INTO routes (office_id, route_num, map) VALUES ($office_id, $route_num, $map)`,
    );

    try {
        for (const route of routesData.routes) {
            await stmt.executeAsync({
                $office_id: route.office_id,
                $route_num: route.route_num,
                $map: route.map,
            });
        }
    } finally {
        await stmt.finalizeAsync(); // always finalize, even if loop throws
    }
}
