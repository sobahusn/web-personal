import { clearSessionCookie } from "../_lib/auth.js";
import { noStore, route, send } from "../_lib/http.js";

export default route({
  POST: (_req, res) => {
    noStore(res);
    clearSessionCookie(res);
    send(res, 200, { ok: true });
  },
});
