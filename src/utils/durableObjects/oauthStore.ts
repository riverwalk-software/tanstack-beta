import { DurableObject } from "cloudflare:workers";
import ms from "ms";

export class OauthStore extends DurableObject {
  constructor(ctx: DurableObjectState, env: CloudflareBindings) {
    super(ctx, env);
    this.ctx.blockConcurrencyWhile(async () => {
      const currentAlarm = await this.ctx.storage.getAlarm();
      if (currentAlarm === null)
        await this.ctx.storage.setAlarm(Date.now() + ms("5m"));
    });
  }

  async set(sessionId: string): Promise<void> {
    const key = this.ctx.id.toString();
    await this.ctx.storage.put(key, sessionId);
  }

  async getSessionId(): Promise<string | undefined> {
    const key = this.ctx.id.toString();
    const sessionId = await this.ctx.storage.get<string>(key);
    if (sessionId !== undefined) this.ctx.storage.deleteAll(); // Prevents replay attacks
    return sessionId;
  }

  async alarm() {
    await this.ctx.storage.deleteAll();
  }
}
