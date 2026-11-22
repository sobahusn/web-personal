import { isAdmin } from "../_lib/auth.js";
import { noStore, route, send } from "../_lib/http.js";

export default route({
  GET: (req, res) => {
    noStore(res);
    send(res, 200, { authenticated: isAdmin(req) });
  },
});
