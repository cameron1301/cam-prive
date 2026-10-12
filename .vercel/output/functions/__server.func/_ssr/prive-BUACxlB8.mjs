import { o as __toESM } from "../_runtime.mjs";
import { Z as require_react, b as Link, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as Menu, t as X } from "../_libs/lucide-react.mjs";
import { n as GuestLayout, t as BrandMark } from "./chrome-MSEpz-VB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/prive-BUACxlB8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var HERO = "/yacht/approved/01_HERO_EXTERIOR_APPROVED.png?v=3";
var BRIDGE = "/yacht/approved/02_COMMAND_BRIDGE_APPROVED.png";
var COCKPIT = "/yacht/approved/03_COCKPIT_APPROVED.png";
var EXTERIOR = "/yacht/approved/04_EXTERIOR_GALLERY_APPROVED.png";
var GALLEY = "/yacht/approved/05_GALLEY_KITCHEN_APPROVED.png";
var SALON = "/yacht/approved/06_DINING_SALON_APPROVED.png";
var pill = "inline-flex h-12 items-center justify-center gap-2 rounded-[2px] px-6 text-[12px] font-semibold tracking-[0.08em] uppercase no-underline transition-opacity duration-200 hover:opacity-90 lg:text-[13px]";
function PriveHome() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-white text-[#07141d]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeHero, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeIntro, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeFeature, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeEscape, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeStay, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomePlan, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeClose, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Welcome, {})
		]
	});
}
function HomeHeader() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const link = "text-[12px] font-medium tracking-[0.08em] uppercase no-underline";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-40 border-b border-[#ded9d0]/80 bg-white",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex h-[72px] max-w-[1280px] items-center justify-between px-5 lg:h-[84px] lg:px-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "no-underline",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandMark, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "hidden items-center gap-7 lg:flex",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/escape",
							className: link,
							children: "Experiences"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/profile",
							className: link,
							children: "My Invitation"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/stay",
							className: link,
							children: "My Stay"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "grid size-11 place-items-center lg:hidden",
					"aria-label": open ? "Close menu" : "Open menu",
					onClick: () => setOpen((v) => !v),
					children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 22 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { size: 22 })
				})
			]
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-t border-[#ded9d0] bg-white px-5 py-2 lg:hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/escape",
					className: "block py-3 text-[13px] tracking-[0.08em] uppercase no-underline",
					onClick: () => setOpen(false),
					children: "Experiences"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/profile",
					className: "block py-3 text-[13px] tracking-[0.08em] uppercase no-underline",
					onClick: () => setOpen(false),
					children: "My Invitation"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/stay",
					className: "block py-3 text-[13px] tracking-[0.08em] uppercase no-underline",
					onClick: () => setOpen(false),
					children: "My Stay"
				})
			]
		}) : null]
	});
}
function HomeHero() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative h-[74vh] min-h-[620px] max-h-[820px] overflow-hidden bg-[#07141d] lg:h-[78vh] lg:min-h-[650px]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/yacht/hero-frame.jpg?v=3",
				alt: "The Bay Escape at Sierra Point Harbor",
				className: "absolute inset-0 h-full w-full object-cover object-center"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07141d]/55 via-[#07141d]/10 via-40% to-transparent" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute right-5 bottom-[38px] left-5 max-w-[600px] text-white lg:right-auto lg:bottom-16 lg:left-12",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-semibold tracking-[0.14em] uppercase",
						children: "CAM Privé"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-[11px] font-semibold tracking-[0.14em] uppercase",
						children: "The Bay Escape"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "mt-3 text-[42px] leading-[0.98] text-white lg:text-[66px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block",
							children: "Your Weekend"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block",
							children: "on the Bay"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 max-w-[480px] text-[15px] leading-[1.55] text-white/90 lg:text-[16px] lg:leading-[1.65]",
						children: "A private dockside retreat at Sierra Point Harbor, thoughtfully created for our invited guests."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-wrap items-center gap-x-6 gap-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/escape",
							className: "text-[12px] font-semibold tracking-[0.08em] text-white uppercase no-underline",
							children: "Discover the experience"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/book",
							className: "inline-flex h-[46px] items-center rounded-[2px] bg-white px-6 text-[12px] font-semibold tracking-[0.08em] text-[#07141d] uppercase no-underline",
							children: "Check availability"
						})]
					})
				]
			})
		]
	});
}
function HomeIntro() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "about",
		className: "bg-[#f7f4ee] px-5 py-14 lg:px-12 lg:py-[90px]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[1280px]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-semibold tracking-[0.14em] text-[#6d6a64] uppercase",
					children: "CAM Privé"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "mt-4 max-w-xl text-[32px] leading-[1.05] lg:text-[48px]",
					children: ["A different kind", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block",
						children: "of invitation."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 max-w-[560px] text-[15px] leading-[1.6] text-[#6d6a64] lg:text-[16px] lg:leading-[1.65]",
					children: "CAM Privé brings together thoughtfully curated experiences for the people we value. From quiet waterfront escapes to memorable occasions, each invitation is an opportunity to enjoy something special. Our first experience is The Bay Escape."
				})
			]
		})
	});
}
function HomeFeature() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "experiences",
		className: "bg-white px-5 pt-14 lg:px-12 lg:pt-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			id: "bay",
			className: "mx-auto max-w-[1280px]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-semibold tracking-[0.14em] text-[#6d6a64] uppercase",
					children: "The first experience"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-[32px] leading-[1.05] lg:text-[48px]",
					children: "The Bay Escape"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-[560px] text-[16px] leading-[1.65] text-[#6d6a64]",
					children: "Your private waterfront retreat."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 grid grid-cols-2 gap-2 lg:mt-10 lg:grid-cols-12 lg:gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeShot, {
							src: BRIDGE,
							title: "Command bridge",
							className: "col-span-2 lg:col-span-5",
							imageClass: "h-[240px] lg:h-[320px]"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeShot, {
							src: COCKPIT,
							title: "Cockpit",
							className: "lg:col-span-4",
							imageClass: "h-[168px] lg:h-[320px]"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeShot, {
							src: EXTERIOR,
							title: "Exterior",
							video: true,
							className: "lg:col-span-3",
							imageClass: "h-[168px] lg:h-[320px]"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeShot, {
							src: GALLEY,
							title: "Galley",
							className: "order-5 col-span-2 lg:order-none lg:col-span-6",
							imageClass: "h-[220px] lg:h-[380px]"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeShot, {
							src: SALON,
							title: "Salon",
							className: "order-4 col-span-2 lg:order-none lg:col-span-6",
							imageClass: "h-[260px] lg:h-[380px]"
						})
					]
				})
			]
		})
	});
}
function HomeShot({ src, title, video = false, className = "", imageClass = "" }) {
	const [playing, setPlaying] = (0, import_react.useState)(false);
	const img = "h-full w-full object-cover";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
		className,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `relative overflow-hidden ${imageClass}`,
			children: video && playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
				src: "/yacht/exterior.mp4?v=3",
				poster: src,
				className: img,
				controls: true,
				autoPlay: true,
				playsInline: true
			}) : video ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "block h-full w-full",
				"aria-label": "Play exterior view",
				onClick: () => setPlaying(true),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src,
					alt: "",
					className: img
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src,
				alt: title,
				className: img
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
			className: "mt-2 text-[11px] font-semibold tracking-[0.14em] text-[#6d6a64] uppercase",
			children: title
		})]
	});
}
function HomeEscape() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "mt-14 bg-[#07141d] px-5 py-16 text-[#f7f4ee] lg:mt-20 lg:px-12 lg:py-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[1280px]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-semibold tracking-[0.14em] text-[#b6a27a] uppercase",
					children: "The Bay Escape"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 max-w-xl text-[32px] leading-[1.05] text-[#f7f4ee] lg:text-[48px]",
					children: "Make it your escape."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 max-w-xl font-display text-[26px] leading-[1.15] text-[#f7f4ee] lg:text-[32px]",
					children: "Stay for a night. Linger a little longer."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 max-w-[560px] text-[16px] leading-[1.65] text-white/75",
					children: "Come aboard for a quiet evening by the water, turn it into a weekend away, or settle in for a little longer."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-[560px] text-[16px] leading-[1.65] text-white/75",
					children: "The Bay Escape is available for stays of up to three consecutive nights, subject to availability and your Privé invitation."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/book",
					className: "mt-10 inline-flex h-[46px] items-center rounded-[2px] bg-white px-6 text-[12px] font-semibold tracking-[0.08em] text-[#07141d] uppercase no-underline",
					children: "Check availability"
				})
			]
		})
	});
}
function HomeStay() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "bg-white px-5 py-16 lg:px-12 lg:py-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[1280px]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-semibold tracking-[0.14em] text-[#6d6a64] uppercase",
					children: "Your stay"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 max-w-3xl text-[32px] leading-[1.05] lg:text-[48px]",
					children: "Everything you need for a relaxing stay."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
					className: "mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3",
					children: [
						["Recommended", "2 adults"],
						["Maximum stay", "Up to 3 nights"],
						["Location", "Sierra Point Harbor, Brisbane, California"],
						["Experience", "Private dockside stay"],
						["Check-in", "3:00 PM"],
						["Checkout", "11:00 AM"]
					].map(([title, body]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-t border-[#ded9d0] pt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-[12px] font-semibold tracking-[0.12em] text-[#6d6a64] uppercase",
							children: title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "mt-2 text-[22px] leading-tight lg:text-[26px]",
							children: body
						})]
					}, title))
				})
			]
		})
	});
}
function HomePlan() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "bg-[#f7f4ee] px-5 py-16 lg:px-12 lg:py-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[1280px]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-semibold tracking-[0.14em] text-[#6d6a64] uppercase",
					children: "Availability"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-[32px] leading-[1.05] lg:text-[48px]",
					children: "Plan your escape"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 max-w-[460px] text-[15px] leading-[1.6] text-[#6d6a64] lg:text-[16px]",
					children: "Choose the dates that work best for you. We'll take care of the details."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/book",
					className: "mt-8 inline-flex h-[46px] items-center rounded-[2px] bg-[#07141d] px-6 text-[12px] font-semibold tracking-[0.08em] text-white uppercase no-underline",
					children: "Check availability"
				})
			]
		})
	});
}
function HomeClose() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative h-[500px] overflow-hidden bg-[#07141d] lg:h-[600px]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/yacht/hero-frame.jpg?v=3",
				alt: "",
				className: "absolute inset-0 h-full w-full object-cover object-[center_40%]"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-[#07141d]/70 via-[#07141d]/15 to-transparent" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute right-5 bottom-10 left-5 max-w-[600px] text-white lg:bottom-16 lg:left-12",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-semibold tracking-[0.14em] uppercase",
						children: "The Bay Escape"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 text-[32px] leading-[1.05] text-white lg:text-[48px]",
						children: "Your weekend is waiting."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/book",
						className: "mt-6 inline-flex h-[46px] items-center rounded-[2px] border border-white px-6 text-[12px] font-semibold tracking-[0.08em] text-white uppercase no-underline",
						children: "Check availability"
					})
				]
			})
		]
	});
}
function EscapePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GuestLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhotoHero, {
			eyebrow: "The Bay Escape",
			title: "Your Private\nWaterfront Retreat",
			body: "Step aboard The Bay Escape, a peaceful dockside retreat overlooking Sierra Point Harbor. Unwind by the water, enjoy the marina atmosphere, and spend time with someone special. The yacht remains securely docked throughout your visit.",
			cta: {
				href: "#gallery",
				label: "View the yacht"
			}
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gallery, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Yacht, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rooms, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YourStay, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Weekend, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Itinerary, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rules, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Closing, {})
	] });
}
function PhotoHero({ eyebrow, title, body, cta }) {
	const lines = title.split("\n");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative h-[70vh] min-h-[520px] max-h-[760px] overflow-hidden bg-[#07141d]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/yacht/hero-frame.jpg?v=3",
				alt: "The Bay Escape at Sierra Point Harbor",
				className: "absolute inset-0 h-full w-full object-cover object-center"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07141d]/60 via-[#07141d]/10 via-45% to-transparent" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute right-5 bottom-10 left-5 max-w-[640px] text-white lg:bottom-16 lg:left-12",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-semibold tracking-[0.14em] uppercase",
						children: eyebrow
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 text-[42px] leading-[0.98] text-white lg:text-[64px]",
						children: lines.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block",
							children: line
						}, line))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 max-w-[480px] text-[16px] leading-[1.65] text-white/90",
						children: body
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: cta.href,
						className: "mt-6 inline-flex h-[46px] items-center rounded-[2px] bg-white px-6 text-[12px] font-semibold tracking-[0.08em] text-[#07141d] uppercase no-underline",
						children: cta.label
					})
				]
			})
		]
	});
}
function Gallery() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "gallery",
		className: "bg-white px-5 py-14 lg:px-12 lg:py-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[1280px]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-semibold tracking-[0.14em] text-[#6d6a64] uppercase",
					children: "Aboard"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-[32px] leading-[1.05] lg:text-[48px]",
					children: "The yacht"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 grid grid-cols-2 gap-2 lg:mt-10 lg:grid-cols-12 lg:gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shot, {
							src: BRIDGE,
							title: "Command bridge",
							className: "col-span-2 lg:col-span-5",
							imageClass: "h-[240px] lg:h-[320px]"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shot, {
							src: COCKPIT,
							title: "Cockpit",
							className: "lg:col-span-4",
							imageClass: "h-[168px] lg:h-[320px]"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shot, {
							src: EXTERIOR,
							title: "Exterior",
							video: true,
							className: "lg:col-span-3",
							imageClass: "h-[168px] lg:h-[320px]"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shot, {
							src: GALLEY,
							title: "Galley",
							className: "col-span-2 lg:col-span-6",
							imageClass: "h-[220px] lg:h-[380px]"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shot, {
							src: SALON,
							title: "Salon",
							className: "col-span-2 lg:col-span-6",
							imageClass: "h-[260px] lg:h-[380px]"
						})
					]
				})
			]
		})
	});
}
function Shot({ src, title, video = false, className = "", imageClass = "" }) {
	const [playing, setPlaying] = (0, import_react.useState)(false);
	const img = "h-full w-full object-cover";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
		className,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `relative overflow-hidden ${imageClass}`,
			children: video && playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
				src: "/yacht/exterior.mp4?v=3",
				poster: src,
				className: img,
				controls: true,
				autoPlay: true,
				playsInline: true
			}) : video ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "block h-full w-full",
				"aria-label": "Play exterior view",
				onClick: () => setPlaying(true),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src,
					alt: "",
					className: img
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src,
				alt: title,
				className: img
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
			className: "mt-2 text-[11px] font-semibold tracking-[0.14em] text-[#6d6a64] uppercase",
			children: title
		})]
	});
}
function Yacht() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "yacht",
		className: "bg-[#f7f4ee] px-5 py-16 lg:px-12 lg:py-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-[1280px] items-center gap-10 lg:grid-cols-2 lg:gap-16",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-semibold tracking-[0.14em] text-[#6d6a64] uppercase",
					children: "Where she lives"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-[32px] leading-[1.05] lg:text-[48px]",
					children: "Sierra Point Harbor"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 max-w-[520px] text-[16px] leading-[1.65] text-[#6d6a64]",
					children: "Dock 5, Slip 36, Brisbane. The yacht remains securely docked throughout your visit. Engines stay off, and she never leaves the slip."
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: HERO,
				alt: "",
				className: "aspect-[16/10] w-full object-cover object-[80%_center]"
			})]
		})
	});
}
function Rooms() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "space-y-16 bg-white px-5 py-16 lg:space-y-24 lg:px-12 lg:py-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto max-w-[1280px] space-y-16 lg:space-y-24",
			children: [
				[
					BRIDGE,
					"Command bridge",
					"The upper deck, with the original helm and wraparound seating. The best seat for sunset."
				],
				[
					SALON,
					"Salon",
					"An L-shaped seat, a table, and the forward berth just beyond. Two adults sleep comfortably."
				],
				[
					GALLEY,
					"Galley",
					"A sink, a refrigerator, a microwave, and coffee. Meals are brought aboard or enjoyed ashore."
				],
				[
					COCKPIT,
					"Cockpit",
					"Outdoor chairs at the stern, beside the door into the cabin and the ladder to the bridge."
				]
			].map(([src, title, body], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "grid items-center gap-6 lg:grid-cols-2 lg:gap-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src,
					alt: "",
					className: `aspect-[16/10] w-full object-cover ${i % 2 ? "lg:order-2" : ""}`
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-[32px] lg:text-[42px]",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-[480px] text-[16px] leading-[1.65] text-[#6d6a64]",
					children: body
				})] })]
			}, title))
		})
	});
}
function YourStay() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "stay",
		className: "bg-white px-5 py-16 lg:px-12 lg:py-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[1280px]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-semibold tracking-[0.14em] text-[#6d6a64] uppercase",
					children: "Your stay"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-[32px] leading-[1.05] lg:text-[48px]",
					children: "Everything you need for a relaxing stay"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
					className: "mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3",
					children: [
						["Recommended", "2 adults"],
						["Maximum stay", "Up to 3 nights"],
						["Location", "Sierra Point Harbor, Brisbane, California"],
						["Experience", "Private dockside stay"],
						["Check-in", "3:00 PM"],
						["Checkout", "11:00 AM"]
					].map(([title, body]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-t border-[#ded9d0] pt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-[12px] font-semibold tracking-[0.12em] text-[#6d6a64] uppercase",
							children: title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "mt-2 text-[22px] leading-tight lg:text-[26px]",
							children: body
						})]
					}, title))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/book",
					className: `${pill} mt-10 bg-[#07141d] text-white`,
					children: "Check availability"
				})
			]
		})
	});
}
function Weekend() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "bg-[#07141d] px-5 py-16 text-[#f7f4ee] lg:px-12 lg:py-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[1280px]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-semibold tracking-[0.14em] text-[#b6a27a] uppercase",
					children: "Your weekend"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-[32px] leading-[1.05] text-[#f7f4ee] lg:text-[48px]",
					children: "How the time is spent"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-8 grid gap-3 sm:grid-cols-2",
					children: [
						"Sunset on the command bridge",
						"A quiet afternoon by the water",
						"Waterfront walks",
						"Coffee aboard, overlooking the marina",
						"Dinner ashore, or a meal you bring aboard",
						"Another evening at the same slip"
					].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "border-t border-white/15 pt-3 text-[16px]",
						children: item
					}, item))
				})
			]
		})
	});
}
function Itinerary() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "bg-[#f7f4ee] px-5 py-16 lg:px-12 lg:py-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[760px]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-semibold tracking-[0.14em] text-[#6d6a64] uppercase",
					children: "The Bay Escape"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-[32px] leading-[1.05] lg:text-[48px]",
					children: "Make it your escape."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 font-display text-[26px] leading-[1.15] lg:text-[32px]",
					children: "Stay for a night. Linger a little longer."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 max-w-[560px] text-[16px] leading-[1.7] text-[#6d6a64]",
					children: "Come aboard for a quiet evening by the water, turn it into a weekend away, or settle in for a little longer."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-[560px] text-[16px] leading-[1.7] text-[#6d6a64]",
					children: "The Bay Escape is available for stays of up to three consecutive nights, subject to availability and your Privé invitation."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/book",
					className: `${pill} mt-8 bg-[#07141d] text-white`,
					children: "Check availability"
				})
			]
		})
	});
}
function Rules() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "before",
		className: "bg-white px-5 py-16 lg:px-12 lg:py-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[1280px]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-semibold tracking-[0.14em] text-[#6d6a64] uppercase",
					children: "Stay guide"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 max-w-xl text-[32px] leading-[1.05] lg:text-[48px]",
					children: "A few things to know."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 max-w-xl text-[16px] leading-[1.7] text-[#6d6a64]",
					children: "The Bay Escape is simple, relaxing, and easy to enjoy. A short guide covers arrival, life aboard, the marina, and the morning you leave."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/guide",
					className: `${pill} mt-8 bg-[#07141d] text-white`,
					children: "Read the stay guide"
				})
			]
		})
	});
}
function Closing() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative min-h-[28rem]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/yacht/hero-frame.jpg?v=3",
				alt: "",
				className: "absolute inset-0 h-full w-full object-cover object-center"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[#07141d]/40" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex min-h-[28rem] flex-col justify-end px-5 py-12 lg:px-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "max-w-xl text-[35px] text-white lg:text-[48px]",
					children: "Your weekend is waiting."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/book",
					className: "mt-6 inline-flex h-[46px] w-fit items-center rounded-[2px] border border-white px-6 text-[12px] font-semibold tracking-[0.08em] text-white uppercase no-underline",
					children: "Check availability"
				})]
			})
		]
	});
}
function Welcome() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "bg-[#07141d] px-5 py-12 text-[#f7f4ee] lg:px-12 lg:py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[720px]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-semibold tracking-[0.14em] text-[#b6a27a] uppercase",
					children: "CAM Privé"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-3 text-[32px] leading-[1.05] lg:text-[44px]",
					children: "An invitation"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 max-w-md text-[16px] leading-[1.6] text-white/80",
					children: "Benefits and reservations are private. Open the link we sent you. Names are never listed here."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/profile",
					className: "mt-6 inline-flex h-12 items-center rounded-[2px] border border-white px-6 text-[12px] font-semibold tracking-[0.08em] text-white uppercase no-underline",
					children: "Open your invitation"
				})
			]
		})
	});
}
//#endregion
export { PriveHome as n, EscapePage as t };
