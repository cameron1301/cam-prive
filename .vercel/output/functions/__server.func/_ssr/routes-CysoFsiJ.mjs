import { w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as useYacht } from "./router-Cvl9sDSc.mjs";
import { n as CleanScreen, o as OwnerHome } from "./owner-DEV3ksk5.mjs";
import { n as PriveHome } from "./prive-BUACxlB8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CysoFsiJ.js
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const { me } = useYacht();
	if (me.role === "owner" || me.role === "admin") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OwnerHome, {});
	if (me.role === "cleaner") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CleanScreen, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriveHome, {});
}
//#endregion
export { Home as component };
