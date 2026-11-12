import { db } from "."

const dropAll = async()=>{
    await db.execute(`
        DO $$ DECLARE
        r RECORD;
        BEGIN
        -- Disable referential integrity
        EXECUTE 'SET session_replication_role = replica';

        -- Loop through all tables in the public schema
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
            EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
        END LOOP;

        -- Re-enable referential integrity
        EXECUTE 'SET session_replication_role = DEFAULT';
        END $$;
    `)
}

dropAll()