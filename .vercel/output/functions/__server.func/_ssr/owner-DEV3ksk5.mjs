import { o as __toESM } from "../_runtime.mjs";
import { Z as require_react, b as Link, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as personName, C as monthBounds, D as nightsLeft, I as upcomingTurnoverDates, L as yachtStatus, N as statsBetween, O as normalizePerson, S as money, T as nextReservation, _ as fileToDataUrl, a as STATUS_LABEL, j as pretty, k as ownerExceptions, m as checkoutDate, n as GUEST_LABEL, r as PHOTO_SLOTS, t as CLEAN_STEPS } from "./seed-DCl7Zp1f.mjs";
import { s as useYacht } from "./router-Cvl9sDSc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/owner-DEV3ksk5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PhotoPick({ label, value, onPick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "card block overflow-hidden",
		children: [
			value ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: value,
				alt: "",
				className: "aspect-[4/3] w-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "flex aspect-[4/3] items-center justify-center bg-tide-soft px-4 text-center text-tide",
				children: "Tap to add"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex items-center justify-between gap-3 px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm text-tide",
					children: "Photo"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "sr-only",
				type: "file",
				accept: "image/*",
				capture: "environment",
				onChange: async (e) => {
					const file = e.target.files?.[0];
					e.target.value = "";
					if (!file) return;
					onPick(await fileToDataUrl(file));
				}
			})
		]
	});
}
function OwnerHome() {
	const { data, today, decide, resolveIncident } = useYacht();
	const status = yachtStatus(data, today);
	const next = nextReservation(data, today);
	const exceptions = ownerExceptions(data, today);
	const bounds = monthBounds(today.slice(0, 7));
	const month = statsBetween(data, bounds.from, bounds.to, 1);
	const lastClean = data.jobs.find((j) => j.status === "complete");
	const wash = data.maintenance.find((m) => m.kind === "exterior" && !m.completedAt);
	const pending = data.reservations.filter((r) => r.status === "pending_approval");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "overflow-hidden rounded-3xl bg-tide text-foam",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-4 p-6 sm:p-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold tracking-[0.18em] text-foam/70",
							children: "YACHT STATUS"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "mt-2 flex items-center gap-3 text-5xl text-foam",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `size-3 rounded-full ${status === "ready" ? "bg-ready" : "bg-brass"}` }), STATUS_LABEL[status]]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 max-w-md text-foam/80",
							children: exceptions.length ? "Only exceptions reach you. Everything else is already running." : "Ready for the next guest. Stays, checkout, and Maria’s cleaning run without you."
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/yacht/hero.jpg?v=3",
						alt: "",
						className: "h-28 w-48 rounded-2xl object-cover"
					})]
				})
			}),
			exceptions.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "card p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "kicker",
					children: "Needs a decision"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 space-y-2",
					children: exceptions.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: item }, item))
				})]
			}) : null,
			pending.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "kicker",
						children: "Additional booking"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 text-3xl",
						children: personName(data, r.managerId)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						pretty(r.checkIn, false),
						" → ",
						pretty(checkoutDate(r.checkIn, r.nights), false),
						" · ",
						r.nights,
						" nights · ",
						money(r.amount)
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [r.adults, " adults. Payment is marked pending until you connect a processor. Approving does not charge anyone."]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "btn btn-tide",
							onClick: () => decide(r.id, true),
							children: "Approve"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "btn btn-quiet",
							onClick: () => decide(r.id, false),
							children: "Decline"
						})]
					})
				]
			}, r.id)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Next reservation",
						value: next ? `${personName(data, next.managerId)} · ${pretty(next.checkIn, false)}` : "None"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Next check-in",
						value: next ? `3:00 PM · ${pretty(next.checkIn, false)}` : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Next checkout",
						value: next ? `11:00 AM · ${pretty(checkoutDate(next.checkIn, next.nights), false)}` : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Last cleaning",
						value: lastClean?.completedAt ? pretty(lastClean.completedAt.slice(0, 10), false) : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Next exterior wash",
						value: wash ? pretty(wash.due, false) : "Scheduled"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Open problem",
						value: exceptions[0] ?? "None"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3 lg:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "card p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "kicker",
							children: "This month"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-3 space-y-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Nights occupied" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: month.occupied })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Complimentary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: month.complimentary })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Paid nights" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: month.paidNights })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Paid-stay revenue" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: money(month.revenue) })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Cleaning" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: money(month.cleaning) })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Maintenance" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: money(month.maintenance) })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Slip fee" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: money(month.slip) })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex justify-between font-semibold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Net yacht cost" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: money(month.net) })]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Utilization, {
						today,
						occupied: yearOccupied(data, today)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "card p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "kicker",
								children: "Guests"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 font-display text-5xl",
								children: [data.people.filter((p) => p.role === "manager" && p.entitlement === "used").length, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-2xl text-muted",
									children: [" / ", data.people.filter((p) => p.role === "manager").length]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted",
								children: "Have used a complimentary night."
							})
						]
					})
				]
			}),
			data.incidents.filter((i) => !i.resolved).map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "kicker",
						children: i.severity
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2",
						children: i.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn btn-quiet mt-3",
						onClick: () => resolveIncident(i.id),
						children: "Mark resolved"
					})
				]
			}, i.id))
		]
	});
}
function Fact({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "card p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-lg",
			children: value
		})]
	});
}
function yearOccupied(data, today) {
	const year = today.slice(0, 4);
	return statsBetween(data, `${year}-01-01`, today, Number(today.slice(5, 7))).occupied;
}
function Utilization({ today, occupied }) {
	const year = Number(today.slice(0, 4));
	const start = Date.UTC(year, 0, 1);
	const [y, m, d] = today.split("-").map(Number);
	const elapsed = Math.round((Date.UTC(y, m - 1, d) - start) / 864e5) + 1;
	const pct = Math.round(occupied / Math.max(1, elapsed) * 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "card grid place-items-center p-5 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "kicker",
				children: "Annual utilization"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 grid size-28 place-items-center rounded-full border-8 border-tide font-display text-3xl",
				children: [pct, "%"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-sm text-muted",
				children: [
					occupied,
					" occupied nights so far in ",
					year,
					"."
				]
			})
		]
	});
}
function Financials() {
	const { data, today } = useYacht();
	const year = Number(today.slice(0, 4));
	const monthIndex = Number(today.slice(5, 7));
	const annual = statsBetween(data, `${year}-01-01`, today, monthIndex);
	const blackoutNights = data.blackouts.filter((b) => b.date >= `${year}-01-01` && b.date <= today).length;
	const dayOfYear = nightsBetweenYearStart(today);
	const available = Math.max(1, dayOfYear - blackoutNights);
	const used = data.people.filter((p) => p.role === "manager" && p.entitlement === "used");
	const unused = data.people.filter((p) => p.role === "manager" && p.eligible && p.entitlement === "available");
	const operating = annual.cleaning + annual.maintenance + annual.slip;
	const perNight = annual.occupied ? operating / annual.occupied : null;
	const pct = available ? Math.round(annual.occupied / available * 100) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "kicker",
					children: year
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 text-5xl",
					children: "Is the yacht earning its keep?"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 max-w-xl text-lg",
					children: "The slip fee is spent either way. Guest nights put the yacht to use. Paid nights are the money that comes back."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Utilization"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-display text-6xl",
						children: [pct, "%"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 h-2 overflow-hidden rounded-full bg-tide-soft",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full bg-tide",
							style: { width: `${Math.min(100, pct)}%` }
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted",
						children: [
							annual.occupied,
							" occupied nights of ",
							available,
							" available."
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Guests who have used a complimentary night",
						value: String(used.length)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Guests with complimentary nights left",
						value: String(unused.length)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Complimentary nights",
						value: String(annual.complimentary)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Paid nights",
						value: String(annual.paidNights)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Paid-stay revenue",
						value: money(annual.revenue)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Cleaning",
						value: money(annual.cleaning)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Slip, year to date",
						value: money(annual.slip)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Maintenance",
						value: money(annual.maintenance)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Operating cost",
						value: money(operating)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Cost recovered",
						value: money(annual.revenue)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Net owner cost",
						value: money(annual.net)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Cost per utilized night",
						value: perNight === null ? "—" : money(Math.round(perNight))
					})
				]
			})
		]
	});
}
function nightsBetweenYearStart(today) {
	const year = Number(today.slice(0, 4));
	const start = Date.UTC(year, 0, 1);
	const [y, m, d] = today.split("-").map(Number);
	const now = Date.UTC(y, m - 1, d);
	return Math.round((now - start) / 864e5) + 1;
}
function AdminBookings() {
	const { data, today, decide, cancelStay } = useYacht();
	const rows = [...data.reservations].sort((a, b) => a.checkIn < b.checkIn ? 1 : -1);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "kicker",
					children: "Bookings"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 text-4xl",
					children: "The book"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted",
					children: "Names stay on this side of the door. The guest calendar never shows them."
				})
			] }),
			rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "kicker",
						children: r.status.replaceAll("_", " ")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-1 text-2xl",
						children: personName(data, r.managerId)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						pretty(r.checkIn, false),
						" → ",
						pretty(checkoutDate(r.checkIn, r.nights), false),
						" · ",
						r.adults,
						" adults · ",
						r.kind,
						" · ",
						money(r.amount)
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							"Rules ",
							r.rulesVersion ?? "—",
							" ",
							r.rulesAcceptedAt ? `accepted ${r.rulesAcceptedAt.slice(0, 16).replace("T", " ")}` : ""
						]
					}),
					r.checkout ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm",
						children: [
							"Checkout notes: ",
							r.checkout.notes || "None.",
							" ",
							r.checkout.damage ? `Damage: ${r.checkout.damage}` : ""
						]
					}) : null,
					r.checkout ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 grid grid-cols-2 gap-2",
						children: PHOTO_SLOTS.map((slot) => r.checkout?.photos[slot.id] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: r.checkout.photos[slot.id] ?? "",
							alt: slot.label,
							className: "aspect-video w-full rounded-2xl object-cover"
						}, slot.id) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "rounded-2xl bg-tide-soft px-3 py-6 text-center text-sm text-tide",
							children: [slot.label, " not uploaded"]
						}, slot.id))
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [r.status === "pending_approval" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "btn btn-tide",
							onClick: () => decide(r.id, true),
							children: "Approve"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "btn btn-quiet",
							onClick: () => decide(r.id, false),
							children: "Decline"
						})] }) : null, r.status === "confirmed" || r.status === "pending_approval" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "btn btn-quiet",
							onClick: () => cancelStay(r.id),
							children: "Cancel"
						}) : null]
					})
				]
			}, r.id)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: [
					"Today is ",
					pretty(today),
					". A night is taken from check-in until the morning of checkout."
				]
			})
		]
	});
}
var GUEST_TYPES = [
	"manager",
	"team",
	"client",
	"district",
	"partner",
	"friend",
	"vip",
	"guest"
];
function GuestEditor({ person }) {
	const { data, today, updateGuest, setView } = useYacht();
	const p = normalizePerson(person);
	const [form, setForm] = (0, import_react.useState)({
		name: p.name,
		email: p.email,
		phone: p.phone,
		guestType: p.guestType,
		eligible: p.eligible,
		complimentaryPerYear: String(p.complimentaryPerYear),
		complimentaryUsed: String(p.complimentaryUsed),
		preferredRate: String(p.preferredRate),
		maxStay: String(p.maxStay),
		benefitExpires: p.benefitExpires,
		benefitStarts: p.benefitStarts,
		specialBenefit: p.specialBenefit,
		notes: p.notes
	});
	(0, import_react.useEffect)(() => {
		const n = normalizePerson(person);
		setForm({
			name: n.name,
			email: n.email,
			phone: n.phone,
			guestType: n.guestType,
			eligible: n.eligible,
			complimentaryPerYear: String(n.complimentaryPerYear),
			complimentaryUsed: String(n.complimentaryUsed),
			preferredRate: String(n.preferredRate),
			maxStay: String(n.maxStay),
			benefitExpires: n.benefitExpires,
			benefitStarts: n.benefitStarts,
			specialBenefit: n.specialBenefit,
			notes: n.notes
		});
	}, [person]);
	const upcoming = data.reservations.find((r) => r.managerId === p.id && (r.status === "confirmed" || r.status === "pending_approval") && checkoutDate(r.checkIn, r.nights) >= today);
	const last = data.reservations.find((r) => r.managerId === p.id && r.status === "checked_out");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "card p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl",
					children: p.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [
						GUEST_LABEL[p.guestType],
						" · ",
						nightsLeft(p),
						" complimentary night",
						nightsLeft(p) === 1 ? "" : "s",
						" left"
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "btn btn-quiet",
					onClick: () => setView(p.id),
					children: "Open their invitation"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-3 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						children: ["Name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "field mt-1",
							value: form.name,
							onChange: (e) => setForm({
								...form,
								name: e.target.value
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						children: ["Guest type", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: "field mt-1",
							value: form.guestType,
							onChange: (e) => setForm({
								...form,
								guestType: e.target.value
							}),
							children: GUEST_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: t,
								children: GUEST_LABEL[t]
							}, t))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						children: ["Email", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "field mt-1",
							value: form.email,
							onChange: (e) => setForm({
								...form,
								email: e.target.value
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						children: ["Phone", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "field mt-1",
							value: form.phone,
							onChange: (e) => setForm({
								...form,
								phone: e.target.value
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						children: ["Complimentary nights / year", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "field mt-1",
							inputMode: "numeric",
							value: form.complimentaryPerYear,
							onChange: (e) => setForm({
								...form,
								complimentaryPerYear: e.target.value
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						children: ["Complimentary nights used", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "field mt-1",
							inputMode: "numeric",
							value: form.complimentaryUsed,
							onChange: (e) => setForm({
								...form,
								complimentaryUsed: e.target.value
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						children: ["Preferred nightly rate", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "field mt-1",
							inputMode: "numeric",
							value: form.preferredRate,
							onChange: (e) => setForm({
								...form,
								preferredRate: e.target.value
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						children: ["Maximum stay", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "field mt-1",
							inputMode: "numeric",
							value: form.maxStay,
							onChange: (e) => setForm({
								...form,
								maxStay: e.target.value
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						children: ["Invitation opens", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "field mt-1",
							type: "date",
							value: form.benefitStarts,
							onChange: (e) => setForm({
								...form,
								benefitStarts: e.target.value
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						children: ["Invitation expires", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "field mt-1",
							type: "date",
							value: form.benefitExpires,
							onChange: (e) => setForm({
								...form,
								benefitExpires: e.target.value
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm sm:col-span-2",
						children: ["Special benefit", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "field mt-1",
							value: form.specialBenefit,
							onChange: (e) => setForm({
								...form,
								specialBenefit: e.target.value
							}),
							placeholder: "Shown instead of the standard benefit, if set"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-sm sm:mt-7",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: form.eligible,
							onChange: (e) => setForm({
								...form,
								eligible: e.target.checked
							})
						}), "Booking enabled"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm sm:col-span-2",
						children: ["Notes", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							className: "field mt-1 min-h-20",
							value: form.notes,
							onChange: (e) => setForm({
								...form,
								notes: e.target.value
							})
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-sm",
				children: ["Private invitation: /i/", p.inviteCode]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-muted",
				children: [upcoming ? `Upcoming ${pretty(upcoming.checkIn, false)}` : "No upcoming stay", last ? ` · Last stay ${pretty(last.checkIn, false)}` : ""]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "btn btn-tide mt-4",
				onClick: () => updateGuest(p.id, {
					name: form.name.trim() || p.name,
					email: form.email.trim(),
					phone: form.phone.trim(),
					guestType: form.guestType,
					eligible: form.eligible,
					complimentaryPerYear: Number(form.complimentaryPerYear) || 0,
					complimentaryUsed: Number(form.complimentaryUsed) || 0,
					preferredRate: Number(form.preferredRate) || 0,
					maxStay: Math.min(3, Math.max(1, Number(form.maxStay) || 1)),
					benefitExpires: form.benefitExpires,
					benefitStarts: form.benefitStarts,
					specialBenefit: form.specialBenefit,
					notes: form.notes
				}),
				children: "Save invitation"
			})
		]
	});
}
function OperationsScreen() {
	const { data, today } = useYacht();
	const status = yachtStatus(data, today);
	const next = nextReservation(data, today);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "kicker",
				children: "Operations"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 text-4xl",
				children: "The Bay Escape"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-muted",
				children: [
					"Yacht status: ",
					STATUS_LABEL[status],
					". Guests never see this desk."
				]
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 sm:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/clean",
				className: "card p-5 no-underline",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "kicker",
						children: "Cleaning"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-2xl",
						children: "Maria"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: next ? `Next arrival ${pretty(next.checkIn, false)} at 3:00 PM` : "No upcoming arrival"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/maintenance",
				className: "card p-5 no-underline",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "kicker",
						children: "Maintenance"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-2xl",
						children: "Holds and exterior"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "Bird droppings, blackout dates, and the monthly wash."
					})
				]
			})]
		})]
	});
}
function PeopleScreen() {
	const { data } = useYacht();
	const guests = data.people.filter((p) => p.role === "manager");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "kicker",
				children: "CAM Privé"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 text-4xl",
				children: "Guests"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-xl text-muted",
				children: "Each invitation has its own complimentary nights, rate, and maximum stay. Guests only see “Your Privé benefit.”"
			})
		] }), guests.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuestEditor, { person: p }, p.id))]
	});
}
function CleanScreen() {
	const { data, today, startCleaning, toggleCheck, finishCleaning, reportProblem } = useYacht();
	const job = data.jobs.find((j) => j.status !== "complete");
	const [notes, setNotes] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [problem, setProblem] = (0, import_react.useState)("");
	const [severity, setSeverity] = (0, import_react.useState)("minor");
	const [photo, setPhoto] = (0, import_react.useState)(null);
	const [shots, setShots] = (0, import_react.useState)({});
	const stay = job ? data.reservations.find((r) => r.id === job.reservationId) : void 0;
	const sms = data.sms[0];
	const turnovers = upcomingTurnoverDates(data, today);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-lg space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-3xl bg-ready p-5 text-foam",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-2xl font-semibold",
					children: "Maria"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-foam/85",
					children: sms ? "Text notification is drafted. It is not sent until a number is configured." : "No open text."
				})]
			}),
			turnovers.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "kicker",
						children: "Same-day turnover"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 text-2xl",
						children: "Priority clean"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted",
						children: [
							"Checkout is 11:00 AM and the next check-in is 3:00 PM on ",
							turnovers.map((d) => pretty(d, false)).join(", "),
							". Mark the yacht ready before 3:00 PM. If it will not be ready, this needs owner attention."
						]
					})
				]
			}) : null,
			job ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "kicker",
						children: "New cleaning job"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 text-3xl",
						children: job.status === "required" ? "Cleaning required" : "Cleaning in progress"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1",
						children: "Sierra Point Harbor · Dock 5 · Slip 36"
					}),
					stay?.checkout ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm",
						children: ["Guest checkout: ", new Date(stay.checkout.at).toLocaleString()]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm",
						children: "Checkout by 11:00 AM"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: nextReservation(data, today) ? `Next guest arrival: ${pretty(nextReservation(data, today).checkIn, false)} at 3:00 PM` : "No arrival after this clean."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted",
						children: [
							"Internal cleaning cost ",
							money(data.config.cleaningCost),
							". Optional tip $20 via Zelle is tracked here only. Guests never see payment details."
						]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-4xl",
				children: "Nothing to clean"
			}),
			sms ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "kicker",
						children: "Text that would go to Maria"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 whitespace-pre-wrap text-sm",
						children: sms.body
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-brass-ink",
						children: "Phone number: ADMIN CONFIGURATION REQUIRED. Nothing is sent until you add it."
					})
				]
			}) : null,
			job ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2",
					children: [
						job.status === "required" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "btn btn-ready min-h-16 text-lg",
							onClick: () => startCleaning(job.id),
							children: "Start cleaning"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "card px-4 py-3",
							children: "Cleaning in progress"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "btn btn-quiet min-h-16",
							onClick: () => {
								if (!problem.trim()) {
									setError("Add a short description.");
									return;
								}
								reportProblem({
									severity,
									description: problem.trim(),
									photo,
									reservationId: job.reservationId
								});
								setProblem("");
								setError("Cameron is told only if this is more than minor.");
							},
							children: "Report problem"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "btn btn-tide min-h-16 text-lg",
							onClick: () => {
								finishCleaning(job.id, notes).then(setError);
							},
							children: "Complete cleaning"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "card divide-y divide-line",
					children: CLEAN_STEPS.map((step) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "flex min-h-14 w-full items-center justify-between gap-3 px-4 text-left",
						onClick: () => toggleCheck(job.id, step.id),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: step.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `grid size-6 place-items-center rounded-full text-xs text-foam ${job.checks[step.id] ? "bg-ready" : "bg-line text-transparent"}`,
							children: "✓"
						})]
					}) }, step.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-muted",
						children: "Note"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						className: "field mt-1 min-h-20",
						value: notes,
						onChange: (e) => setNotes(e.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: PHOTO_SLOTS.map((slot) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhotoPick, {
						label: slot.label,
						value: shots[slot.id] ?? null,
						onPick: (url) => setShots((s) => ({
							...s,
							[slot.id]: url
						}))
					}, slot.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card space-y-3 p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: "Problem"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: [
								"minor",
								"attention",
								"urgent"
							].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: `btn ${severity === s ? "btn-tide" : "btn-quiet"}`,
								onClick: () => setSeverity(s),
								children: s === "attention" ? "Needs attention" : s[0].toUpperCase() + s.slice(1)
							}, s))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							className: "field min-h-20",
							value: problem,
							onChange: (e) => setProblem(e.target.value),
							placeholder: "Short description"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhotoPick, {
							label: "Problem photo",
							value: photo,
							onPick: setPhoto
						})
					]
				}),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: error }) : null
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "card p-5",
				children: "When a guest submits checkout, this page fills itself and a text is drafted for you. Bird droppings on the command bridge are a checklist line, not a call to Cameron."
			})
		]
	});
}
function MaintenanceScreen() {
	const { data, completeExterior, addBlackout, removeBlackout } = useYacht();
	const [notes, setNotes] = (0, import_react.useState)("Command bridge, bird droppings, deck, cockpit, exterior.");
	const [cost, setCost] = (0, import_react.useState)("0");
	const [date, setDate] = (0, import_react.useState)("");
	const [reason, setReason] = (0, import_react.useState)("Owner hold");
	const open = data.maintenance.find((m) => m.kind === "exterior" && !m.completedAt);
	const past = data.maintenance.filter((m) => m.completedAt);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "kicker",
					children: "Maintenance"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 text-4xl",
					children: "Monthly exterior wash"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted",
					children: "At least once a month, bookings or not. Command bridge and bird droppings come first."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "kicker",
						children: "Next due"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-display text-4xl",
						children: open ? pretty(open.due, false) : "Set"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: open?.notes
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mt-4 block text-sm text-muted",
						children: ["Notes", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							className: "field mt-1 min-h-20",
							value: notes,
							onChange: (e) => setNotes(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mt-3 block text-sm text-muted",
						children: ["Cost", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "field mt-1",
							inputMode: "numeric",
							value: cost,
							onChange: (e) => setCost(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn btn-tide mt-4",
						onClick: () => completeExterior(notes, Number(cost) || 0),
						children: "Mark exterior wash done"
					})
				]
			}),
			past.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: [
					"Last recorded ",
					m.completedAt?.slice(0, 10),
					" · ",
					money(m.cost),
					" · ",
					m.notes
				]
			}, m.id)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl",
						children: "Block a date"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "field max-w-48",
								type: "date",
								value: date,
								onChange: (e) => setDate(e.target.value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "field max-w-xs",
								value: reason,
								onChange: (e) => setReason(e.target.value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "btn btn-quiet",
								onClick: () => date && addBlackout(date, reason),
								children: "Block"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 space-y-2",
						children: data.blackouts.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								pretty(b.date, false),
								" — ",
								b.reason
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "btn btn-ghost",
								onClick: () => removeBlackout(b.id),
								children: "Remove"
							})]
						}, b.id))
					})
				]
			})
		]
	});
}
function SettingsScreen() {
	const { data, updateConfig, updateGuide } = useYacht();
	const c = data.config;
	const field = (key, label) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm text-muted",
			children: label
		}), typeof c[key] === "number" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			className: "field mt-1",
			inputMode: "numeric",
			defaultValue: String(c[key]),
			onBlur: (e) => updateConfig({ [key]: Number(e.target.value) || 0 })
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
			className: "field mt-1 min-h-24",
			defaultValue: String(c[key]),
			onBlur: (e) => updateConfig({ [key]: e.target.value })
		})]
	}, key);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "kicker",
					children: "Settings"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 text-4xl",
					children: "Fill in what only you know"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted",
					children: "Blank fields stay labeled until you replace them. Do not put a Zelle address here until you mean guests to see it."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "card space-y-4 p-5",
				onSubmit: (e) => e.preventDefault(),
				children: [
					field("access", "Access instructions"),
					field("parking", "Parking"),
					field("shore", "Shore restroom and shower"),
					field("wifi", "Wi-Fi"),
					field("emergency", "Emergency contact"),
					field("zelle", "Tip instructions"),
					field("nightlyRate", "Extra night price"),
					field("cleaningCost", "Cleaning cost"),
					field("slipMonthly", "Monthly slip fee")
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "card space-y-4 p-5",
				onSubmit: (e) => e.preventDefault(),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl",
						children: "Guide copy"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm text-muted",
							children: "Hero"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							className: "field mt-1 min-h-24",
							defaultValue: data.guide.heroBody,
							onBlur: (e) => updateGuide({ heroBody: e.target.value })
						})]
					}),
					data.guide.activities.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-sm text-muted",
							children: [
								a.title,
								" ",
								a.verified ? "" : "· unverified"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							className: "field mt-1 min-h-24",
							defaultValue: a.body,
							onBlur: (e) => updateGuide({ activities: data.guide.activities.map((item) => item.id === a.id ? {
								...item,
								body: e.target.value
							} : item) })
						})]
					}, a.id))
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "card p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl",
					children: "Recent record"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 space-y-2 text-sm",
					children: data.audit.slice(0, 8).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted",
						children: [a.actor, " · "]
					}), a.action] }, a.id))
				})]
			})
		]
	});
}
//#endregion
export { OperationsScreen as a, SettingsScreen as c, MaintenanceScreen as i, CleanScreen as n, OwnerHome as o, Financials as r, PeopleScreen as s, AdminBookings as t };
