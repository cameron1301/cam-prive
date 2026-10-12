import { o as __toESM } from "../_runtime.mjs";
import { S as useNavigate, Z as require_react, b as Link, p as useRouterState, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as nightsLeft, E as nightsBetween, M as priceStay, O as normalizePerson, P as turnoverDate, R as ymOf, S as money, _ as fileToDataUrl, c as benefitHeadline, d as calendarCells, f as canCheckIn, j as pretty, m as checkoutDate, o as activeStay, p as canStart, s as asNightCount, w as monthLabel } from "./seed-DCl7Zp1f.mjs";
import { c as Luggage, f as Droplets, g as BookOpen, l as LifeBuoy, m as Car, n as Utensils, p as Compass, s as MapPin, u as KeyRound } from "../_libs/lucide-react.mjs";
import { s as useYacht } from "./router-Cvl9sDSc.mjs";
import { n as GuestLayout, r as PageIntro } from "./chrome-MSEpz-VB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hospitality-lFLxN2QQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var btn = "inline-flex h-12 items-center justify-center rounded-[2px] bg-[#07141d] px-6 text-[12px] font-semibold tracking-[0.08em] text-white uppercase no-underline";
var btnQuiet = "inline-flex h-12 items-center justify-center rounded-[2px] border border-[#07141d] px-6 text-[12px] font-semibold tracking-[0.08em] uppercase";
function shiftMonth(ym, delta) {
	const [y, m] = ym.split("-").map(Number);
	return new Date(Date.UTC(y, m - 1 + delta, 1)).toISOString().slice(0, 7);
}
function AccessGate() {
	const { openInvitation } = useYacht();
	const [code, setCode] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuestLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-xl px-5 py-16 lg:py-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
				kicker: "CAM Privé",
				title: "Your invitation",
				body: "Enter the private code from your invitation. Benefits stay private until we know it's you."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-8",
				onSubmit: (e) => {
					e.preventDefault();
					openInvitation(code).then((dest) => {
						if (!dest) {
							setError("That code isn't recognized. Please check the invitation and try again.");
							return;
						}
						setError(null);
					});
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block text-[13px] text-[#6d6a64]",
					children: ["Invitation code", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field mt-2",
						value: code,
						autoComplete: "off",
						onChange: (e) => setCode(e.target.value)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					className: `${btn} mt-6`,
					children: "Continue"
				})]
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-[15px] text-[#6d6a64]",
				children: error
			}) : null
		]
	}) });
}
function BookScreen() {
	const { data, me, today, book } = useYacht();
	const navigate = useNavigate();
	const profile = normalizePerson(me);
	const cap = Math.min(data.config.maxNights, profile.maxStay);
	const [cursor, setCursor] = (0, import_react.useState)(ymOf(today));
	const [checkIn, setCheckIn] = (0, import_react.useState)(null);
	const [checkOut, setCheckOut] = (0, import_react.useState)(null);
	const [adults, setAdults] = (0, import_react.useState)(2);
	const [accepted, setAccepted] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const nights = checkIn && checkOut ? asNightCount(nightsBetween(checkIn, checkOut), cap) : null;
	const priced = nights ? priceStay(me, nights, data.config.nightlyRate) : null;
	const cells = calendarCells(cursor);
	const existing = me.role === "manager" ? activeStay(data, me.id, today) : void 0;
	const turnover = checkIn && nights ? turnoverDate(data, checkIn, nights) : null;
	const pick = (iso) => {
		if (!checkIn || checkOut) {
			const reason = canCheckIn(data, iso, today);
			if (reason) {
				setError(reason);
				return;
			}
			setError(null);
			setCheckIn(iso);
			setCheckOut(null);
			return;
		}
		if (iso <= checkIn) {
			const reason = canCheckIn(data, iso, today);
			if (reason) {
				setError(reason);
				return;
			}
			setError(null);
			setCheckIn(iso);
			setCheckOut(null);
			return;
		}
		const count = asNightCount(nightsBetween(checkIn, iso), cap);
		if (!count) {
			setError(`Let's try different dates. This invitation can reserve up to ${cap} consecutive night${cap === 1 ? "" : "s"}.`);
			return;
		}
		const reason = canStart(data, checkIn, count, today);
		if (reason) {
			setError(reason);
			return;
		}
		setError(null);
		setCheckOut(iso);
	};
	if (!me.id) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccessGate, {});
	if (me.role !== "manager" || !profile.eligible) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuestLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "mx-auto max-w-3xl px-5 py-16 lg:px-12 lg:py-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
			kicker: "The Bay Escape",
			title: "You're invited",
			body: "Your invitation includes The Bay Escape. If dates aren't showing, your CAM Privé host can help."
		})
	}) });
	if (existing) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuestLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-3xl px-5 py-16 lg:px-12 lg:py-24",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
			kicker: "The Bay Escape",
			title: "Your Bay Escape awaits",
			body: "You already have a weekend with us. Everything for the visit is on My Stay."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/stay",
			className: `${btn} mt-8`,
			children: "View your stay"
		})]
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuestLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid max-w-[1280px] gap-14 px-5 py-12 lg:grid-cols-12 lg:px-12 lg:py-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "lg:col-span-7",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
					kicker: "The Bay Escape",
					title: "Plan your escape",
					body: "Choose the dates that work best for you. We'll take care of the details."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-10 grid grid-cols-2 gap-8 border-b border-[#ded9d0] pb-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-semibold tracking-[0.14em] text-[#6d6a64] uppercase",
						children: "Check-in"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-display text-[26px] leading-tight lg:text-[32px]",
						children: checkIn ? pretty(checkIn, false) : "Select"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-semibold tracking-[0.14em] text-[#6d6a64] uppercase",
						children: "Checkout"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-display text-[26px] leading-tight lg:text-[32px]",
						children: checkOut ? pretty(checkOut, false) : "Select"
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4 flex items-center justify-between",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "text-[13px] tracking-[0.08em] uppercase",
									onClick: () => setCursor(shiftMonth(cursor, -1)),
									children: "Previous"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-[26px]",
									children: monthLabel(cursor)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "text-[13px] tracking-[0.08em] uppercase",
									onClick: () => setCursor(shiftMonth(cursor, 1)),
									children: "Next"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-7 text-center text-[11px] font-semibold tracking-[0.14em] text-[#6d6a64] uppercase",
							children: [
								"Sun",
								"Mon",
								"Tue",
								"Wed",
								"Thu",
								"Fri",
								"Sat"
							].map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "py-2",
								children: d
							}, d))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-7",
							children: cells.map((cell) => {
								const day = Number(cell.iso.slice(-2));
								const taken = data.reservations.some((r) => (r.status === "confirmed" || r.status === "pending_approval") && cell.iso >= r.checkIn && cell.iso < checkoutDate(r.checkIn, r.nights));
								const role = !checkIn ? null : cell.iso === checkIn ? "in" : checkOut && cell.iso === checkOut ? "out" : checkOut && cell.iso > checkIn && cell.iso < checkOut ? "mid" : null;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									disabled: !cell.inMonth,
									onClick: () => pick(cell.iso),
									className: "relative h-12",
									children: [
										role === "in" && checkOut ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-y-1 right-0 left-1/2 bg-[#efeae0]" }) : null,
										role === "out" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-y-1 right-1/2 left-0 bg-[#efeae0]" }) : null,
										role === "mid" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-y-1 inset-x-0 bg-[#efeae0]" }) : null,
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `relative z-10 mx-auto grid size-10 place-items-center rounded-full text-[16px] ${!cell.inMonth ? "text-transparent" : role === "in" || role === "out" ? "bg-[#07141d] text-white" : taken ? "text-[#b0aaa2] line-through" : "text-[#07141d]"}`,
											children: day
										})
									]
								}, cell.iso);
							})
						})
					]
				}),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-[15px] text-[#6d6a64]",
					children: error
				}) : null
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
			className: "lg:col-span-5 lg:pt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-t border-[#ded9d0] pt-8 lg:border lg:border-[#ded9d0] lg:p-8 lg:pt-8",
				children: checkIn && checkOut && nights && priced ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-semibold tracking-[0.14em] text-[#6d6a64] uppercase",
						children: "Your Bay Escape"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-6 space-y-3 text-[15px]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between gap-4 border-t border-[#ded9d0] pt-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-[#6d6a64]",
									children: "Arrival"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "text-right",
									children: pretty(checkIn)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between gap-4 border-t border-[#ded9d0] pt-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-[#6d6a64]",
									children: "Departure"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "text-right",
									children: pretty(checkOut)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between gap-4 border-t border-[#ded9d0] pt-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-[#6d6a64]",
									children: "Number of nights"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "text-right",
									children: nights
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between gap-4 border-t border-[#ded9d0] pt-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-[#6d6a64]",
									children: "Hours aboard"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: "3:00 PM – 11:00 AM" })]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Benefit, { priced }),
					turnover ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-[14px] leading-relaxed text-[#6d6a64]",
						children: "Another guest departs that morning. We'll have the yacht ready before your 3:00 PM arrival."
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[13px] text-[#6d6a64]",
								children: "Adults aboard"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 flex gap-2",
								children: [
									1,
									2,
									3,
									4
								].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: `grid size-11 place-items-center rounded-[2px] border ${adults === n ? "border-[#07141d] bg-[#07141d] text-white" : "border-[#ded9d0]"}`,
									onClick: () => setAdults(n),
									children: n
								}, n))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-[13px] text-[#6d6a64]",
								children: "Two is comfortable. Four is the most the cabin allows."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mt-6 flex gap-3 text-[15px] leading-relaxed",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							className: "mt-1 size-4",
							checked: accepted,
							onChange: (e) => setAccepted(e.target.checked)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "I'll be aboard for the stay. The Bay Escape is dockside, quiet, and prepared for me." })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: `${btn} mt-6 w-full`,
						onClick: () => {
							(async () => {
								const result = await book({
									checkIn,
									nights,
									adults,
									accepted
								});
								if (!result.ok) {
									setError(result.error);
									return;
								}
								sessionStorage.setItem("cam-reserved", "1");
								navigate({ to: "/stay" });
							})();
						},
						children: "Reserve your stay"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "mt-4 text-[13px] tracking-[0.06em] uppercase",
						onClick: () => {
							setCheckIn(null);
							setCheckOut(null);
						},
						children: "Change dates"
					})
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-semibold tracking-[0.14em] text-[#6d6a64] uppercase",
						children: "Your Privé benefit"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-[22px] leading-tight",
						children: benefitHeadline(profile)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-[16px] leading-[1.65] text-[#6d6a64]",
						children: "Select your arrival, then your departure. The stay is the nights between those mornings."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-6 space-y-3 text-[15px]",
						children: [
							1,
							2,
							3
						].filter((n) => n <= cap).map((n) => {
							const row = priceStay(me, n, data.config.nightlyRate);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex justify-between border-t border-[#ded9d0] pt-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									n,
									" night",
									n === 1 ? "" : "s"
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: money(row.amount) })]
							}, n);
						})
					})
				] })
			})
		})]
	}) });
}
function Benefit({ priced }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[11px] font-semibold tracking-[0.14em] text-[#6d6a64] uppercase",
			children: "Your Privé benefit"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
			className: "mt-3 space-y-3 text-[15px]",
			children: [
				priced.complimentaryNights > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between gap-4 border-t border-[#ded9d0] pt-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Privé benefit" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: priced.complimentaryNights === 1 ? "One Complimentary Night" : `${priced.complimentaryNights} Complimentary Nights` })]
				}) : null,
				priced.paidNights > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between gap-4 border-t border-[#ded9d0] pt-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dt", { children: ["Additional night", priced.paidNights === 1 ? "" : "s"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: priced.paidNights === 1 ? money(priced.nightly) : `${priced.paidNights} × ${money(priced.nightly)}` })]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-end justify-between gap-4 border-t border-[#ded9d0] pt-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "tracking-[0.08em] uppercase",
						children: "Total"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "font-display text-[36px] leading-none",
						children: money(priced.amount)
					})]
				})
			]
		})]
	});
}
function StayScreen() {
	const { data, me, today, cancelStay, changeStay, submitCheckout } = useYacht();
	const href = useRouterState({ select: (s) => s.location.href });
	const [welcome, setWelcome] = (0, import_react.useState)(() => {
		if (typeof sessionStorage === "undefined") return false;
		const flag = sessionStorage.getItem("cam-reserved") === "1";
		if (flag) sessionStorage.removeItem("cam-reserved");
		return flag;
	});
	const [panel, setPanel] = (0, import_react.useState)(href.includes("panel=checkout") ? "checkout" : "stay");
	const [tab, setTab] = (0, import_react.useState)("upcoming");
	const [note, setNote] = (0, import_react.useState)(null);
	const stay = data.reservations.find((r) => r.managerId === me.id && (r.status === "confirmed" || r.status === "pending_approval" || r.status === "checked_out"));
	if (!me.id) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccessGate, {});
	if (me.role !== "manager") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuestLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "mx-auto max-w-3xl px-5 py-16 lg:px-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
			kicker: "My Stay",
			title: "Your Bay Escape",
			body: "Open this page from your invitation."
		})
	}) });
	const latest = data.reservations.find((r) => r.managerId === me.id);
	const show = stay ?? latest;
	const past = !!show && (show.status === "checked_out" || show.status === "cancelled" || show.status === "declined");
	const visible = tab === "past" ? past ? show : void 0 : past ? void 0 : show;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuestLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-[430px] px-5 py-8 lg:max-w-5xl lg:px-8 lg:py-12",
		children: [
			panel === "bring" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bring, { onBack: () => setPanel("stay") }) : null,
			panel === "checkout" && visible && visible.status === "confirmed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckoutFlow, {
				onDone: (message) => {
					setNote(message);
					setPanel(message ? "checkout" : "done");
				},
				submit: (input) => submitCheckout(visible.id, input)
			}) : null,
			panel === "done" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
					kicker: "The Bay Escape",
					title: "Thank you for joining us",
					body: "We hope to welcome you back to CAM Privé soon."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: `${btnQuiet} mt-8`,
					onClick: () => setPanel("stay"),
					children: "View your stay"
				})]
			}) : null,
			panel === "stay" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [show && past ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex gap-6 text-[12px] font-semibold tracking-[0.12em] uppercase",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: tab === "upcoming" ? "border-b border-[#07141d] pb-1" : "pb-1 text-[#6d6a64]",
					onClick: () => setTab("upcoming"),
					children: "Upcoming"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: tab === "past" ? "border-b border-[#07141d] pb-1" : "pb-1 text-[#6d6a64]",
					onClick: () => setTab("past"),
					children: "Past"
				})]
			}) : null, !visible ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
					kicker: "My Stay",
					title: tab === "past" ? "No past stays" : "No upcoming stays",
					body: "When you're ready for your next escape, we'll be here."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/yacht/hero-frame.jpg?v=3",
					alt: "The Bay Escape",
					className: "mt-8 aspect-[16/10] w-full object-cover"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/book",
					className: `${btn} mt-8`,
					children: "Check availability"
				})
			] }) : welcome && tab === "upcoming" && visible.status !== "checked_out" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reserved, {
				stay: visible,
				onView: () => setWelcome(false)
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StayHub, {
				stay: visible,
				guest: me.name,
				today,
				note,
				parking: data.config.parking,
				access: data.config.access,
				bring: data.guide.bring,
				activities: data.guide.activities,
				help: data.config.emergency,
				onCancel: () => {
					cancelStay(visible.id).then(setNote);
				},
				onChange: async (input) => {
					const result = await changeStay({
						id: visible.id,
						...input
					});
					if (!result.ok) return result.error;
					setNote(null);
					return null;
				},
				onBring: () => setPanel("bring"),
				onCheckout: () => setPanel("checkout")
			})] }) : null
		]
	}) });
}
function calendarFile(stay) {
	const start = stay.checkIn.replaceAll("-", "");
	const end = checkoutDate(stay.checkIn, stay.nights).replaceAll("-", "");
	const body = [
		"BEGIN:VCALENDAR",
		"VERSION:2.0",
		"BEGIN:VEVENT",
		`DTSTART;VALUE=DATE:${start}`,
		`DTEND;VALUE=DATE:${end}`,
		"SUMMARY:The Bay Escape",
		"LOCATION:Sierra Point Harbor\\, Dock 5\\, Slip 36\\, Brisbane",
		"END:VEVENT",
		"END:VCALENDAR"
	].join("\r\n");
	return `data:text/calendar;charset=utf-8,${encodeURIComponent(body)}`;
}
function Reserved({ stay, onView }) {
	const out = checkoutDate(stay.checkIn, stay.nights);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
				kicker: "The Bay Escape",
				title: stay.payment === "pending" ? "Payment is still required" : "Your Bay Escape is reserved",
				body: stay.payment === "pending" ? "This request is not confirmed. Payment is not set up yet, so the stay will not be held as a confirmed reservation until payment succeeds." : "We look forward to welcoming you aboard. Your reservation details and arrival information are ready below."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
				className: "mt-10 grid gap-6 sm:grid-cols-2",
				children: [
					["Dates", `${pretty(stay.checkIn, false)} — ${pretty(out, false)}`],
					["Arrival", "3:00 PM"],
					["Departure", "11:00 AM"],
					["Marina", "Sierra Point Harbor"],
					["Guests", `${stay.adults} adult${stay.adults === 1 ? "" : "s"}`]
				].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-t border-[#ded9d0] pt-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-[11px] font-semibold tracking-[0.14em] text-[#6d6a64] uppercase",
						children: k
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "mt-1 text-[16px]",
						children: v
					})]
				}, k))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: `${btn} mt-10`,
				onClick: onView,
				children: "View your stay"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					className: btnQuiet,
					href: "https://maps.google.com/?q=Sierra+Point+Harbor+Brisbane+California",
					target: "_blank",
					rel: "noreferrer",
					children: "Get directions"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					className: btnQuiet,
					href: calendarFile(stay),
					children: "Add to calendar"
				})]
			})
		]
	});
}
function configured(value) {
	if (!value || value.includes("ADMIN CONFIGURATION REQUIRED")) return null;
	return value.trim() || null;
}
function refCode(id) {
	return id.replace(/\W/g, "").slice(-8).toUpperCase();
}
function stageOf(stay, today) {
	if (stay.status === "checked_out" || stay.status === "cancelled" || stay.status === "declined") return "complete";
	const out = checkoutDate(stay.checkIn, stay.nights);
	if (today < stay.checkIn) return "before";
	if (today === stay.checkIn) return "arrival";
	if (today < out) return "during";
	return "checkout";
}
var STAGE_LABEL = {
	before: "View arrival details",
	arrival: "Arrival details",
	during: "View stay details",
	checkout: "Complete checkout",
	complete: "Stay completed"
};
function StayHub({ stay, guest, today, note, parking, access, bring, activities, help, onCancel, onChange, onBring, onCheckout }) {
	const [view, setView] = (0, import_react.useState)("hub");
	const out = checkoutDate(stay.checkIn, stay.nights);
	const stage = stageOf(stay, today);
	const open = stay.status === "confirmed" || stay.status === "pending_approval";
	const parkingNote = configured(parking);
	const accessNote = configured(access);
	const helpNote = configured(help);
	const dining = activities.filter((a) => a.verified && /\b(dining|dinner|restaurant|food)\b/i.test(`${a.title} ${a.body}`));
	const around = activities.filter((a) => a.verified && !dining.includes(a));
	const benefit = stay.complimentaryApplied ? stay.complimentaryApplied === 1 ? "One Complimentary Night" : `${stay.complimentaryApplied} Complimentary Nights` : "Invitation rate";
	const amount = stay.amount === 0 ? "Included with your invitation" : stay.payment === "paid" ? money(stay.amount) : `${money(stay.amount)} — not collected here`;
	if (view === "arrival") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "text-[12px] tracking-[0.1em] uppercase",
				onClick: () => setView("hub"),
				children: "Back"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
				kicker: "Arriving",
				title: "Arrival details",
				body: "Check-in is from 3:00 PM. Checkout is by 11:00 AM."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
				className: "mt-8",
				children: [
					["Experience", "The Bay Escape"],
					["Marina", "Sierra Point Harbor, Brisbane, California"],
					["Location", "Dock 5 · Slip 36"],
					["Parking", parkingNote ?? "Parking details will be shared with your invitation before you arrive."],
					["Marina access", accessNote ?? "The way to the slip will be shared with your invitation before you arrive."]
				].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-t border-[#ded9d0] py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-[11px] font-semibold tracking-[0.14em] text-[#6d6a64] uppercase",
						children: k
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "mt-1 text-[16px] leading-relaxed",
						children: v
					})]
				}, k))
			})
		]
	});
	if (view === "summary") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "text-[12px] tracking-[0.1em] uppercase",
				onClick: () => setView("hub"),
				children: "Back"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
				kicker: "My Stay",
				title: "Stay summary"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
				className: "mt-8",
				children: [
					["Guest", guest],
					["Reservation", refCode(stay.id)],
					["Check-in", `${pretty(stay.checkIn, false)}, 3:00 PM`],
					["Checkout", `${pretty(out, false)}, 11:00 AM`],
					["Nights", String(stay.nights)],
					["Guests", String(stay.adults)],
					["Privé benefit", benefit],
					["Amount", amount],
					["Location", "Sierra Point Harbor, Dock 5, Slip 36"],
					["Status", stay.payment === "pending" ? "Payment required — not confirmed" : stay.status === "confirmed" ? "Reserved" : stay.status === "checked_out" ? "Stay completed" : "Awaiting a note from us"]
				].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between gap-6 border-t border-[#ded9d0] py-3 text-[15px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-[#6d6a64]",
						children: k
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "text-right",
						children: v
					})]
				}, k))
			})
		]
	});
	if (view === "modify" && open) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModifyStay, {
		stay,
		onBack: () => setView("hub"),
		onChange: async (input) => {
			const error = await onChange(input);
			if (!error) setView("hub");
			return error;
		},
		onCancel: () => {
			onCancel();
			setView("hub");
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "lg:grid lg:grid-cols-12 lg:items-start lg:gap-14",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "lg:col-span-5 lg:sticky lg:top-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-semibold tracking-[0.14em] text-[#6d6a64] uppercase",
					children: "My Stay"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/yacht/hero-frame.jpg?v=3",
					alt: "The Bay Escape at Sierra Point Harbor",
					className: "mt-4 aspect-[16/10] w-full object-cover"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex items-baseline justify-between gap-4 border-b border-[#ded9d0] pb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[14px] text-[#6d6a64]",
						children: "Reservation"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[16px] font-semibold tracking-wide",
						children: refCode(stay.id)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 text-[15px]",
					children: [
						pretty(stay.checkIn, false),
						" — ",
						pretty(out, false)
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-[12px] font-semibold tracking-[0.12em] text-[#b6a27a] uppercase",
					children: stay.payment === "pending" ? "Payment required — not confirmed" : stay.status === "pending_approval" ? "Awaiting a note from us" : stage === "before" ? "Reserved" : stage === "arrival" ? "Arrival day" : stage === "during" ? "During your stay" : stage === "checkout" ? "Checkout day" : "Stay completed"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 text-[32px] leading-tight",
					children: "The Bay Escape"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-[15px] text-[#6d6a64]",
					children: [
						"Sierra Point Harbor",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"Brisbane, California"
					]
				}),
				open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: `${btnQuiet} mt-5 w-full`,
					onClick: () => setView("modify"),
					children: "Modify / cancel reservation"
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 grid grid-cols-2 border-t border-[#ded9d0]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-r border-[#ded9d0] py-4 pr-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[12px] text-[#6d6a64]",
							children: "Location"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-[20px] leading-tight",
							children: "Dock 5 · Slip 36"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "py-4 pl-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[12px] text-[#6d6a64]",
							children: "Guests"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-[20px] leading-tight",
							children: stay.adults
						})]
					})]
				}),
				stage === "complete" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 text-center text-[13px] font-semibold tracking-[0.1em] uppercase",
					children: "Stay completed"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: `${btn} mt-5 w-full`,
					onClick: () => {
						if (stage === "checkout") onCheckout();
						else if (stage === "during") document.getElementById("stay-details")?.scrollIntoView({ behavior: "smooth" });
						else setView("arrival");
					},
					children: STAGE_LABEL[stage]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "mt-4 w-full text-center text-[13px] tracking-[0.08em] uppercase underline underline-offset-4",
					onClick: () => setView("summary"),
					children: "View stay summary"
				}),
				note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-[15px] text-[#6d6a64]",
					children: note
				}) : null
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			id: "stay-details",
			className: "mt-10 lg:col-span-7 lg:mt-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { size: 18 }),
					title: "Getting here",
					body: "Sierra Point Harbor, Brisbane, California.",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						className: "mt-2 inline-block text-[14px] underline underline-offset-4",
						href: "https://maps.google.com/?q=Sierra+Point+Harbor+Brisbane+California",
						target: "_blank",
						rel: "noreferrer",
						children: "Get directions"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Car, { size: 18 }),
					title: "Parking",
					body: parkingNote ?? "Parking details have not been added yet. They will be shared with your invitation before you arrive."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { size: 18 }),
					title: "Marina access",
					body: accessNote ?? "Instructions for reaching Dock 5, Slip 36 will be shared with your invitation before you arrive."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Droplets, { size: 18 }),
					title: "Restrooms and showers",
					body: "The onboard bathroom is not available. Please use the marina restrooms and showers ashore. Hours and the way in are confirmed with your invitation."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { size: 18 }),
					title: "Stay guide",
					body: "A few things to know before and during your time aboard.",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						className: "mt-2 inline-block text-[14px] underline underline-offset-4",
						href: "/guide",
						children: "View stay guide"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Luggage, { size: 18 }),
					title: "What to bring",
					body: bring.slice(0, 3).join(" · ") || "Comfortable layers, toiletries for the shore shower, and anything you'd like to eat ashore.",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "mt-2 text-[14px] underline underline-offset-4",
						onClick: onBring,
						children: "View the list"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Utensils, { size: 18 }),
					title: "Nearby dining",
					body: dining.length ? dining.map((a) => a.title).join(" · ") : "Your host has not added dining notes yet."
				}),
				around.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, { size: 18 }),
					title: "Make the most of your escape",
					body: around.map((a) => a.title).join(" · ")
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LifeBuoy, { size: 18 }),
					title: "Need help?",
					body: helpNote ?? "A contact will be shared with your invitation. Private numbers are not listed here."
				})
			]
		})]
	}) });
}
function InfoRow({ icon, title, body, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex gap-4 border-t border-[#ded9d0] py-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mt-0.5 text-[#b6a27a]",
			children: icon
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-[18px]",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-xl text-[15px] leading-relaxed text-[#6d6a64]",
				children: body
			}),
			action
		] })]
	});
}
function ModifyStay({ stay, onBack, onChange, onCancel }) {
	const { data, me, today } = useYacht();
	const profile = normalizePerson(me);
	const cap = Math.min(data.config.maxNights, profile.maxStay);
	const [cursor, setCursor] = (0, import_react.useState)(ymOf(stay.checkIn));
	const [checkIn, setCheckIn] = (0, import_react.useState)(stay.checkIn);
	const [checkOut, setCheckOut] = (0, import_react.useState)(checkoutDate(stay.checkIn, stay.nights));
	const [adults, setAdults] = (0, import_react.useState)(stay.adults);
	const [error, setError] = (0, import_react.useState)(null);
	const [plans, setPlans] = (0, import_react.useState)(false);
	const nights = checkIn && checkOut ? asNightCount(nightsBetween(checkIn, checkOut), cap) : null;
	const applied = stay.complimentaryApplied ?? 0;
	const previewPerson = normalizePerson({
		...profile,
		complimentaryUsed: Math.max(0, profile.complimentaryUsed - applied)
	});
	const priced = nights ? priceStay(previewPerson, nights, data.config.nightlyRate) : null;
	const cells = calendarCells(cursor);
	const pick = (iso) => {
		if (!checkIn || checkOut) {
			const reason = canCheckIn(data, iso, today, stay.id);
			if (reason) return setError(reason);
			setError(null);
			setCheckIn(iso);
			setCheckOut(null);
			return;
		}
		if (iso <= checkIn) {
			const reason = canCheckIn(data, iso, today, stay.id);
			if (reason) return setError(reason);
			setError(null);
			setCheckIn(iso);
			setCheckOut(null);
			return;
		}
		const count = asNightCount(nightsBetween(checkIn, iso), cap);
		if (!count) return setError(`This invitation can reserve up to ${cap} consecutive night${cap === 1 ? "" : "s"}.`);
		const reason = canStart(data, checkIn, count, today, stay.id);
		if (reason) return setError(reason);
		setError(null);
		setCheckOut(iso);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "text-[12px] tracking-[0.1em] uppercase",
				onClick: onBack,
				children: "Back"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
				kicker: "Plans change",
				title: "Adjust your stay",
				body: "Choose new dates. We'll check availability and update your Privé benefit."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid grid-cols-2 gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-semibold tracking-[0.14em] text-[#6d6a64] uppercase",
					children: "Check-in"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-[22px]",
					children: checkIn ? pretty(checkIn, false) : "Select"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-semibold tracking-[0.14em] text-[#6d6a64] uppercase",
					children: "Checkout"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-[22px]",
					children: checkOut ? pretty(checkOut, false) : "Select"
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-center justify-between",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "text-[12px] tracking-[0.08em] uppercase",
								onClick: () => setCursor(shiftMonth(cursor, -1)),
								children: "Previous"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[18px]",
								children: monthLabel(cursor)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "text-[12px] tracking-[0.08em] uppercase",
								onClick: () => setCursor(shiftMonth(cursor, 1)),
								children: "Next"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-7 text-center text-[11px] font-semibold tracking-[0.12em] text-[#6d6a64]",
						children: [
							"S",
							"M",
							"T",
							"W",
							"T",
							"F",
							"S"
						].map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "py-2",
							children: d
						}, `${d}${i}`))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-7",
						children: cells.map((cell) => {
							const day = Number(cell.iso.slice(-2));
							const taken = data.reservations.some((r) => r.id !== stay.id && (r.status === "confirmed" || r.status === "pending_approval") && cell.iso >= r.checkIn && cell.iso < checkoutDate(r.checkIn, r.nights));
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: !cell.inMonth,
								onClick: () => pick(cell.iso),
								className: "h-11",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `mx-auto grid size-9 place-items-center rounded-full text-[15px] ${!cell.inMonth ? "text-transparent" : taken ? "text-[#b0aaa2] line-through" : "text-[#07141d]"}`,
									children: day
								})
							}, cell.iso);
						})
					})
				]
			}),
			nights && priced ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-[15px] text-[#6d6a64]",
				children: [
					nights,
					" night",
					nights === 1 ? "" : "s",
					" · ",
					priced.complimentaryNights > 0 ? priced.complimentaryNights === 1 ? "One Complimentary Night" : `${priced.complimentaryNights} Complimentary Nights` : "Invitation rate",
					" · ",
					money(priced.amount)
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-[13px] text-[#6d6a64]",
				children: "Guests"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 flex gap-2",
				children: [
					1,
					2,
					3,
					4
				].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: `grid size-11 place-items-center border ${adults === n ? "border-[#07141d] bg-[#07141d] text-white" : "border-[#ded9d0]"}`,
					onClick: () => setAdults(n),
					children: n
				}, n))
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-[15px] text-[#6d6a64]",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: `${btn} mt-6 w-full`,
				disabled: !checkIn || !nights,
				onClick: () => {
					if (!checkIn || !nights) return;
					onChange({
						checkIn,
						nights,
						adults
					}).then((error) => setError(error));
				},
				children: "Update reservation"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 border-t border-[#ded9d0] pt-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-[24px]",
						children: "Plans change"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-[15px] leading-relaxed text-[#6d6a64]",
						children: "If you need to adjust your stay, please let us know at least 48 hours before arrival whenever possible. With that notice, a complimentary night is restored. Inside 48 hours, it stays with the visit. Payment is not collected here, so no refund is promised."
					}),
					plans ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: `${btnQuiet} mt-5`,
						onClick: onCancel,
						children: "Cancel this reservation"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "mt-5 text-[13px] tracking-[0.08em] uppercase",
						onClick: () => setPlans(true),
						children: "Cancel this reservation"
					})
				]
			})
		]
	});
}
function Bring({ onBack }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "text-[12px] tracking-[0.1em] uppercase",
			onClick: onBack,
			children: "Back"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
			kicker: "What to bring",
			title: "Pack light",
			body: "We've taken care of the essentials."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-10 grid gap-12 sm:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-[28px]",
				children: "You may want to bring"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 space-y-3 text-[16px]",
				children: [
					"Comfortable layers",
					"Personal toiletries",
					"A phone charger",
					"Favorite food and beverages"
				].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "border-t border-[#ded9d0] pt-3",
					children: item
				}, item))
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-[28px]",
				children: "Waiting for you"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 space-y-3 text-[16px]",
				children: [
					"Fresh bedding",
					"Towels",
					"Basic onboard essentials"
				].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "border-t border-[#ded9d0] pt-3",
					children: item
				}, item))
			})] })]
		})
	] });
}
var SHOTS = [
	{
		id: "cabin",
		title: "Interior photo",
		body: "The cabin and salon as you leave them."
	},
	{
		id: "cockpit",
		title: "Cockpit photo",
		body: "The cockpit, ready for the next guest."
	},
	{
		id: "overall",
		title: "Exterior photo",
		body: "A look along the yacht as you step ashore."
	}
];
function CheckoutFlow({ submit, onDone }) {
	const [step, setStep] = (0, import_react.useState)(0);
	const [photos, setPhotos] = (0, import_react.useState)({
		cabin: null,
		cockpit: null,
		bridge: null,
		overall: null
	});
	const [notes, setNotes] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const shot = SHOTS[step];
	const finish = () => {
		const next = {
			...photos,
			bridge: photos.cockpit
		};
		submit({
			notes,
			damage: "",
			photos: next
		}).then((err) => {
			if (err) {
				setError(err);
				return;
			}
			onDone(null);
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
			kicker: "Before you go",
			title: "Before you go",
			body: "We hope you enjoyed your time aboard. A few quick photos before you leave help us prepare beautifully for our next guest."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-6 text-[13px] tracking-[0.12em] text-[#6d6a64] uppercase",
			children: [step + 1, " of 3"]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-3 text-[32px]",
			children: shot.title
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-[16px] text-[#6d6a64]",
			children: shot.body
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "mt-6 block cursor-pointer",
			children: [photos[shot.id] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: photos[shot.id] ?? "",
				alt: "",
				className: "h-56 w-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "flex h-56 w-full items-center justify-center border border-[#ded9d0] text-[15px] text-[#6d6a64]",
				children: "Add a photo"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "sr-only",
				type: "file",
				accept: "image/*",
				onChange: async (e) => {
					const file = e.target.files?.[0];
					e.target.value = "";
					if (!file) return;
					const url = await fileToDataUrl(file);
					setPhotos((p) => ({
						...p,
						[shot.id]: url
					}));
				}
			})]
		}),
		step === 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "mt-6 block",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[13px] text-[#6d6a64]",
				children: "A note for us, if you like"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				className: "field mt-2 min-h-24",
				value: notes,
				onChange: (e) => setNotes(e.target.value)
			})]
		}) : null,
		error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-[15px]",
			children: error
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 flex gap-3",
			children: [step > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: btnQuiet,
				onClick: () => setStep((s) => s - 1),
				children: "Back"
			}) : null, step < 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: btn,
				disabled: !photos[shot.id],
				onClick: () => setStep((s) => s + 1),
				children: "Continue"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: btn,
				disabled: !photos.cabin || !photos.overall || !photos.cockpit,
				onClick: finish,
				children: "Complete checkout"
			})]
		})
	] });
}
function GuideScreen() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuestLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "mx-auto max-w-3xl px-5 py-14 lg:px-8 lg:py-20",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
				kicker: "Stay guide",
				title: "A few things to know",
				body: "Everything you need for an easy weekend on the Bay."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 max-w-xl text-[16px] leading-[1.7] text-[#6d6a64]",
				children: "The Bay Escape is designed to be simple, relaxing, and easy to enjoy. A few thoughtful guidelines help us keep the yacht beautiful and ready for every CAM Privé guest."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-14 space-y-14",
				children: [
					{
						kicker: "Arriving",
						title: "Welcome aboard",
						body: "Check-in is from 3:00 PM. Checkout is by 11:00 AM. Parking, the marina entrance, and access are shared with your invitation once they are confirmed. They are not listed here until then."
					},
					{
						kicker: "Aboard",
						title: "Your time aboard",
						body: "The Bay Escape is a private dockside stay. The yacht cannot be operated or moved, and it never leaves the slip.",
						lines: [
							"Please leave the engines, helm, lines, and mooring equipment untouched.",
							"The onboard bathroom is not available. Please use the marina restrooms and showers ashore.",
							"No cooking or open flames aboard. Meals are brought aboard or enjoyed ashore.",
							"The yacht is smoke-free, including vaping.",
							"This is a quiet private stay, not a party or an event.",
							"The Bay Escape is reserved for adult guests.",
							"We're unable to welcome pets aboard.",
							"Alcohol may be enjoyed responsibly while docked, subject to marina rules."
						]
					},
					{
						kicker: "Marina facilities",
						title: "Ashore, for your comfort",
						body: "Restrooms and showers are available ashore. During your stay, we kindly ask that you use the marina facilities rather than the onboard bathroom systems."
					},
					{
						kicker: "Before you go",
						title: "A few quiet minutes",
						body: "A few quick photos before you leave help us prepare beautifully for our next guest. Take your belongings with you. We'll look after the rest."
					}
				].map((section) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "border-t border-[#ded9d0] pt-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] font-semibold tracking-[0.14em] text-[#6d6a64] uppercase",
							children: section.kicker
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-3 text-[32px]",
							children: section.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 max-w-xl text-[16px] leading-[1.7] text-[#6d6a64]",
							children: section.body
						}),
						section.lines ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-4 max-w-xl space-y-3 text-[16px] leading-[1.6] text-[#07141d]",
							children: section.lines.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: line }, line))
						}) : null
					]
				}, section.title))
			})
		]
	}) });
}
function ExploreScreen() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuestLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "mx-auto max-w-3xl px-5 py-14 lg:px-8 lg:py-20",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
				kicker: "The Bay Escape",
				title: "Getting here",
				body: "Sierra Point Harbor, Brisbane. The yacht stays at her slip for the whole of your visit."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/yacht/approved/04_EXTERIOR_GALLERY_APPROVED.png?v=3",
				alt: "The yacht at Sierra Point Harbor",
				className: "mt-8 aspect-[16/10] w-full object-cover"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
				className: "mt-10",
				children: [
					["Marina", "Sierra Point Harbor, Brisbane, California"],
					["Dock", "Dock 5"],
					["Slip", "Slip 36"],
					["Parking", "ADMIN CONFIGURATION REQUIRED"],
					["Marina entrance", "ADMIN CONFIGURATION REQUIRED"],
					["Access", "ADMIN CONFIGURATION REQUIRED"]
				].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-1 border-t border-[#ded9d0] py-4 sm:grid-cols-[180px_1fr] sm:gap-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-[11px] font-semibold tracking-[0.14em] text-[#6d6a64] uppercase",
						children: k
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "text-[16px]",
						children: v
					})]
				}, k))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				className: `${btn} mt-8`,
				href: "https://maps.google.com/?q=Sierra+Point+Harbor+Brisbane+California",
				target: "_blank",
				rel: "noreferrer",
				children: "Get directions"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "facilities",
				className: "mt-16 border-t border-[#ded9d0] pt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-[32px]",
					children: "Marina facilities"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-xl text-[16px] leading-[1.7] text-[#6d6a64]",
					children: "Restrooms and showers are available ashore for your comfort. During your stay, we kindly ask that you use the marina facilities. A coin laundry and barbecue are on the yacht club grounds. Hours and the way in are confirmed with your invitation."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-14 border-t border-[#ded9d0] pt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-[32px]",
					children: "Evenings on the Bay"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-xl text-[16px] leading-[1.7] text-[#6d6a64]",
					children: "Bring what you'd like to eat, or walk the waterfront. The galley offers a refrigerator, a microwave, and coffee. Cooking stays ashore."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-14 border-t border-[#ded9d0] pt-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-semibold tracking-[0.14em] text-[#6d6a64] uppercase",
						children: "The Bay Escape"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 text-[32px]",
						children: "Make it your escape"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 font-display text-[24px] leading-tight",
						children: "Stay for a night. Linger a little longer."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 max-w-xl text-[16px] leading-[1.7] text-[#6d6a64]",
						children: "Come aboard for a quiet evening by the water, turn it into a weekend away, or settle in for a little longer. The Bay Escape is available for stays of up to three consecutive nights, subject to availability and your Privé invitation."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/book",
						className: `${btn} mt-8`,
						children: "Check availability"
					})
				]
			})
		]
	}) });
}
function ProfileScreen() {
	const { me } = useYacht();
	const profile = normalizePerson(me);
	if (!me.id) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccessGate, {});
	if (me.role !== "manager") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuestLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "mx-auto max-w-3xl px-5 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
			kicker: "CAM Privé",
			title: "Your invitation"
		})
	}) });
	const first = me.name.split(" ")[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuestLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "mx-auto max-w-3xl px-5 py-14 lg:px-8 lg:py-20",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
				kicker: "You're invited",
				title: `Welcome to CAM Privé, ${first}.`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 max-w-xl text-[16px] leading-[1.7] text-[#6d6a64]",
				children: "We're delighted to extend a personal invitation to experience The Bay Escape. Your invitation includes access to a private waterfront retreat at Sierra Point Harbor."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-14 text-[11px] font-semibold tracking-[0.14em] text-[#6d6a64] uppercase",
				children: "Your Privé benefit"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-[36px] leading-[1.05]",
				children: benefitHeadline(profile)
			}),
			profile.preferredRate > 0 && nightsLeft(profile) > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 max-w-lg text-[16px] leading-[1.7] text-[#6d6a64]",
				children: [
					"Additional nights on this invitation are ",
					money(profile.preferredRate),
					". A stay may be up to ",
					profile.maxStay,
					" night",
					profile.maxStay === 1 ? "" : "s",
					"."
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/book",
				className: `${btn} mt-10`,
				children: "Plan your escape"
			})
		]
	}) });
}
//#endregion
export { StayScreen as a, ProfileScreen as i, ExploreScreen as n, GuideScreen as r, BookScreen as t };
