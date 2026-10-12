import { o as __toESM } from "../_runtime.mjs";
import { Z as require_react, b as Link, p as useRouterState, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as Menu, t as X } from "../_libs/lucide-react.mjs";
import { s as useYacht } from "./router-Cvl9sDSc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chrome-MSEpz-VB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function BrandMark() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: "/brand/cam-prive-official.png?v=hr3",
		alt: "CAM Privé — Exclusive experiences by CAM",
		className: "h-auto w-[160px] lg:w-[190px]"
	});
}
var LINKS = [
	{
		to: "/escape",
		label: "Experiences"
	},
	{
		to: "/profile",
		label: "My Invitation"
	},
	{
		to: "/stay",
		label: "My Stay"
	}
];
function GuestHeader() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const path = useRouterState({ select: (s) => s.location.pathname });
	const link = "text-[12px] font-medium tracking-[0.08em] uppercase no-underline";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-40 border-b border-[#ded9d0]/80 bg-white",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex h-[72px] max-w-[1280px] items-center justify-between px-5 lg:h-[84px] lg:px-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "no-underline",
					"aria-label": "CAM Privé home",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandMark, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "hidden items-center gap-7 lg:flex",
					children: LINKS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: item.to,
						className: `${link} ${path === item.to ? "text-[#07141d]" : "text-[#6d6a64]"}`,
						children: item.label
					}, item.to))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "grid size-11 place-items-center lg:hidden",
					"aria-label": open ? "Close menu" : "Open menu",
					onClick: () => setOpen((v) => !v),
					children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 22 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { size: 22 })
				})
			]
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-[#ded9d0] bg-white px-5 py-2 lg:hidden",
			children: LINKS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: item.to,
				className: "block py-3 text-[13px] tracking-[0.08em] uppercase no-underline",
				onClick: () => setOpen(false),
				children: item.label
			}, item.to))
		}) : null]
	});
}
function GuestFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "bg-[#07141d] px-5 py-8 text-[#f7f4ee] lg:px-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mx-auto max-w-[1280px] text-[12px] tracking-[0.14em] text-white/75 uppercase",
			children: "CAM Privé · Exclusive experiences by CAM"
		})
	});
}
function GuestLayout({ children }) {
	const { me } = useYacht();
	if (me.role === "owner" || me.role === "admin" || me.role === "cleaner") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-[#07141d]",
		children
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-white text-[#07141d]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuestHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", { children }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuestFooter, {})
		]
	});
}
function PageIntro({ kicker, title, body }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "max-w-2xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-semibold tracking-[0.14em] text-[#6d6a64] uppercase",
				children: kicker
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 text-[36px] leading-[1.02] lg:text-[52px]",
				children: title
			}),
			body ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 max-w-xl text-[16px] leading-[1.65] text-[#6d6a64]",
				children: body
			}) : null
		]
	});
}
//#endregion
export { GuestLayout as n, PageIntro as r, BrandMark as t };
