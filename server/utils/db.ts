import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite'
import path from 'path';

let db: Database | null = null;

export async function getDb() {
    const config = useRuntimeConfig();
    

    if (!db) {
        db = await open({
            filename: path.resolve(config.dbPath),
            driver: sqlite3.Database
        });

        await db.run('PRAGMA foreign_keys = ON');
    }

    return db;
}


