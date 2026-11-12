import { sql } from "drizzle-orm";
import { db } from "."


const getTablesList = async ()=>{
    const query = sql<string>`SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE';
    `;

    const tables = (await db.execute(query) as any).rows as {table_name:string}[]
    return tables.map(t=>t.table_name).filter(name=>!name.includes("drizzle"))
}

const truncateAll = async () => {
    try {
        await db.execute(
            sql.raw(`
            TRUNCATE TABLE
                ${(await getTablesList()).join(", ")}
            RESTART IDENTITY CASCADE;
            `)
        )
        console.log("✅ All tables truncated.")
    } catch (err) {
        console.error("❌ Failed to truncate tables:", err)
    }
}


truncateAll()