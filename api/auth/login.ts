import {
  assertNotThrottled,
  clearFailures,
  clientIp,
  recordFailure,
  setSessionCookie,
  verifyPassword,
} from "../_lib/auth.js";
import { HttpError, noStore, route, send } from "../_lib/http.js";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default route({
  POST: async (req, res) => {
    noStore(res);
    const ip = clientIp(req);
    assertNotThrottled(ip);

    const body = (req.body ?? {}) as { password?: unknown };
    if (!verifyPassword(body.password)) {
      recordFailure(ip);
      await sleep(500); // slows down guessing even where the in-memory throttle resets
      throw new HttpError(401, "Incorrect password");
    }

    clearFailures(ip);
    setSessionCookie(res);
    send(res, 200, { ok: true });
  },
});
