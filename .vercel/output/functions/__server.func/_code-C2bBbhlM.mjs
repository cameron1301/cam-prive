import { o as __toESM } from "./_runtime.mjs";
import { S as useNavigate, Z as require_react, w as require_jsx_runtime } from "./_libs/@tanstack/react-router+[...].mjs";
import { o as Route$1, s as useYacht } from "./_ssr/router-Cvl9sDSc.mjs";
import { n as GuestLayout, r as PageIntro } from "./_ssr/chrome-MSEpz-VB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_code-C2bBbhlM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function InviteOpen() {
	const { code } = Route$1.useParams();
	const { ready, openInvitation } = useYacht();
	const navigate = useNavigate();
	const [missing, setMissing] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!ready) return;
		let live = true;
		openInvitation(code).then((dest) => {
			if (!live) return;
			if (dest) navigate({
				to: dest,
				replace: true
			});
			else setMissing(true);
		});
		return () => {
			live = false;
		};
	}, [
		ready,
		code,
		openInvitation,
		navigate
	]);
	if (!missing) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuestLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", { className: "px-5 py-16" }) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuestLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "mx-auto max-w-xl px-5 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
			kicker: "CAM Privé",
			title: "This invitation isn't available",
			body: "Please use the link exactly as it was sent."
		})
	}) });
}
//#endregion
export { InviteOpen as component };
