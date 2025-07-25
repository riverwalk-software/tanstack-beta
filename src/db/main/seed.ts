import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { postsTable2 } from "./schema";

async function main() {
  try {
    const { getPlatformProxy } = await import("wrangler");
    const proxy = await getPlatformProxy();
    const { SCHOOL_DB } = proxy.env as unknown as CloudflareBindings;
    const db = drizzle(SCHOOL_DB);

    const seedData = {
      title: "Sample Post Title",
      content: "This is a sample post content",
    };

    const existingPost = await db
      .select()
      .from(postsTable2)
      .where(eq(postsTable2.title, seedData.title))
      .get();

    if (existingPost) {
      console.log("Post already exists, skipping creation");
    } else {
      await db.insert(postsTable2).values(seedData);
      console.log("New post created!");
    }

    const posts = await db.select().from(postsTable2);
    console.log("Getting all posts from the database:", posts);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

main();
