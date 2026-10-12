import { a as getCookie, o as setCookie$1 } from "./ssr.mjs";
import { F as uid, M as priceStay, O as normalizePerson, P as turnoverDate, b as hoursUntilCheckIn, h as createSeed, i as RULES_VERSION, l as blankChecks, p as canStart, u as blankPhotos, x as laToday, y as getSql } from "./seed-DCl7Zp1f.mjs";
import { createHash, randomBytes } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/ops.server-Cngu6RMq.js
var COOKIE = "cam_prive_session";
function hashToken(token) {
	return createHash("sha256").update(token).digest("hex");
}
function parseData(raw) {
	const data = typeof raw === "string" ? JSON.parse(raw) : raw;
	data.people = (data.people || []).map((p) => normalizePerson(p));
	if (!data.config) data.config = createSeed().config;
	if (data.config.maxNights < 3) data.config.maxNights = 3;
	return data;
}
async function readState() {
	const sql = await getSql();
	const rows = await sql`select data from cam_state where id = 1`;
	if (!rows.length) {
		const fresh = createSeed(laToday());
		fresh.version = 1;
		await sql.query("insert into cam_state (id, data) values (1, $1::jsonb)", [JSON.stringify(fresh)]);
		return fresh;
	}
	const parsed = parseData(rows[0].data);
	const repaired = repairWalkthrough(parsed);
	if (!repaired) return parsed;
	return await writeState(repaired, versionOf(parsed)) ? repaired : parsed;
}
/** The original walkthrough used a paid stay as if money had been collected. Correct that once. */
function repairWalkthrough(data) {
	let changed = false;
	const reservations = data.reservations.map((stay) => {
		if (stay.id === "stay-jordan" && stay.status === "confirmed" && stay.payment === "pending") {
			changed = true;
			return {
				...stay,
				status: "cancelled",
				payment: "not_required",
				amount: 0
			};
		}
		if (stay.id === "stay-priya" && stay.payment === "paid") {
			changed = true;
			return {
				...stay,
				payment: "not_required",
				amount: 0,
				kind: "complimentary"
			};
		}
		return stay;
	});
	return changed ? {
		...data,
		reservations
	} : null;
}
async function writeState(next, previousVersion) {
	const sql = await getSql();
	const version = previousVersion + 1;
	const payload = {
		...next,
		version
	};
	return (await sql.query("update cam_state set data = $1::jsonb where id = 1 and coalesce((data->>'version')::int, 1) = $2 returning id", [JSON.stringify(payload), previousVersion || 1])).length > 0;
}
function versionOf(data) {
	return Number(data.version || 1);
}
async function mutate(change) {
	for (let attempt = 0; attempt < 3; attempt++) {
		const current = await readState();
		const result = change(current);
		if ("error" in result) return result;
		if (await writeState(result, versionOf(current))) return { data: result };
	}
	return { error: "Please try that again." };
}
function cookieSecure() {
	return true;
}
async function readSession() {
	const token = getCookie(COOKIE);
	if (!token) return null;
	const rows = await (await getSql())`
    select person_id, view_id from cam_sessions
    where token_hash = ${hashToken(token)} and expires_at > now()
  `;
	if (!rows.length) return null;
	return {
		personId: rows[0].person_id,
		viewId: rows[0].view_id
	};
}
async function issueSession(personId, viewId = personId) {
	const token = randomBytes(32).toString("hex");
	const sql = await getSql();
	const previous = getCookie(COOKIE);
	if (previous) await sql`delete from cam_sessions where token_hash = ${hashToken(previous)}`;
	await sql`
    insert into cam_sessions (token_hash, person_id, view_id, expires_at)
    values (${hashToken(token)}, ${personId}, ${viewId}, now() + interval '30 days')
  `;
	setCookie$1(COOKIE, token, {
		httpOnly: true,
		secure: cookieSecure(),
		sameSite: "lax",
		path: "/",
		maxAge: 2592e3
	});
}
function personById(data, id) {
	return data.people.find((p) => p.id === id);
}
function roleOf(person) {
	return person?.role ?? "";
}
function redactStay(stay) {
	return {
		id: stay.id,
		managerId: "",
		checkIn: stay.checkIn,
		nights: stay.nights,
		adults: 0,
		kind: "paid",
		status: stay.status,
		payment: "not_required",
		amount: 0,
		rulesVersion: null,
		rulesAcceptedAt: null,
		createdAt: "",
		checkout: null,
		tip: "unset",
		entitlementConsumed: false
	};
}
function publicConfig(data) {
	return {
		...data.config,
		access: "",
		parking: "",
		shore: "",
		wifi: "",
		emergency: "",
		zelle: "",
		cleaningCost: 0,
		slipMonthly: 0
	};
}
function present(data, session) {
	const actor = session ? personById(data, session.personId) : void 0;
	const view = session ? personById(data, session.viewId) : void 0;
	const actorRole = roleOf(actor);
	const privileged = actorRole === "owner" || actorRole === "admin";
	if (!actor || !view) return {
		data: {
			...data,
			people: [],
			reservations: data.reservations.map(redactStay),
			jobs: [],
			incidents: [],
			expenses: [],
			audit: [],
			sms: [],
			maintenance: [],
			config: publicConfig(data)
		},
		me: null,
		actorRole: ""
	};
	if (privileged) return {
		data,
		me: view,
		actorRole
	};
	if (actor.role === "cleaner") return {
		data: {
			...data,
			people: data.people.map((p) => ({
				...p,
				email: "",
				phone: "",
				notes: "",
				inviteCode: p.id === actor.id ? p.inviteCode : ""
			})),
			expenses: [],
			audit: [],
			config: {
				...data.config,
				zelle: "",
				slipMonthly: 0
			}
		},
		me: actor,
		actorRole
	};
	const mine = data.reservations.filter((r) => r.managerId === actor.id);
	const others = data.reservations.filter((r) => r.managerId !== actor.id).map(redactStay);
	return {
		data: {
			...data,
			people: [{ ...actor }],
			reservations: [...mine, ...others],
			jobs: [],
			incidents: data.incidents.filter((i) => i.reservationId && mine.some((r) => r.id === i.reservationId)),
			expenses: [],
			audit: [],
			sms: [],
			maintenance: [],
			blackouts: data.blackouts.map((b) => ({
				...b,
				reason: "Held"
			})),
			config: {
				...data.config,
				zelle: "",
				cleaningCost: 0,
				slipMonthly: 0
			}
		},
		me: actor,
		actorRole
	};
}
function audit(data, actor, action) {
	return {
		...data,
		audit: [{
			id: uid("log"),
			at: (/* @__PURE__ */ new Date()).toISOString(),
			actor,
			action
		}, ...data.audit].slice(0, 80)
	};
}
async function actorContext() {
	const session = await readSession();
	const data = await readState();
	const actor = session ? personById(data, session.personId) : void 0;
	return {
		session,
		data,
		actor,
		view: session ? personById(data, session.viewId) ?? actor : void 0
	};
}
function deny() {
	return { error: "This invitation can't do that." };
}
async function loadSnapshot() {
	const { data, actor, view, session } = await actorContext();
	const shown = present(data, session && actor && view ? {
		personId: actor.id,
		viewId: view.id
	} : null);
	return {
		ready: true,
		data: shown.data,
		me: shown.me,
		actorRole: shown.actorRole,
		today: laToday()
	};
}
async function openInvitation(code) {
	const key = code.trim().toLowerCase();
	const person = (await readState()).people.map(normalizePerson).find((p) => p.inviteCode === key);
	const allowed = person && (person.role === "owner" || person.role === "admin" || person.role === "cleaner" || person.eligible);
	if (!person || !allowed) return { ok: false };
	await issueSession(person.id, person.id);
	const shown = present(await readState(), {
		personId: person.id,
		viewId: person.id
	});
	return {
		ok: true,
		ready: true,
		data: shown.data,
		me: shown.me,
		actorRole: shown.actorRole,
		today: laToday()
	};
}
async function setView(id) {
	const { actor, data } = await actorContext();
	if (!actor || actor.role !== "owner" && actor.role !== "admin") return { ok: false };
	if (!personById(data, id)) return { ok: false };
	const token = getCookie(COOKIE);
	if (!token) return { ok: false };
	await (await getSql())`update cam_sessions set view_id = ${id} where token_hash = ${hashToken(token)}`;
	return {
		ok: true,
		...await loadSnapshot()
	};
}
function actingGuest(actor, view) {
	if (!actor || !view) return void 0;
	if (actor.role === "owner" || actor.role === "admin") return view.role === "manager" ? view : void 0;
	if (actor.id !== view.id) return void 0;
	return actor.role === "manager" ? actor : void 0;
}
async function book(input) {
	const today = laToday();
	const { actor, view } = await actorContext();
	const me = actingGuest(actor, view);
	if (!me || !actor || !view) return {
		ok: false,
		error: "We couldn't find an invitation for this visit."
	};
	const saved = await mutate((data) => {
		const profile = normalizePerson(data.people.find((p) => p.id === me.id) || me);
		if (!profile.eligible) return { error: "This invitation isn't open for dates just now." };
		if (profile.benefitStarts && today < profile.benefitStarts) return { error: "This invitation opens on a later date." };
		if (profile.benefitExpires && today > profile.benefitExpires) return { error: "This invitation has passed its date." };
		if (!input.accepted) return { error: "Please confirm you'll be aboard before we reserve the stay." };
		if (input.adults < 1 || input.adults > 4) return { error: "We can welcome one to four adults." };
		if (input.nights > profile.maxStay) return { error: `This invitation is for ${profile.maxStay} nights at most.` };
		if (data.reservations.some((r) => r.managerId === profile.id && (r.status === "confirmed" || r.status === "pending_approval"))) return { error: "You already have a stay with us. You can adjust it from My Stay." };
		const block = canStart(data, input.checkIn, input.nights, today);
		if (block) return { error: block };
		const priced = priceStay(profile, input.nights, data.config.nightlyRate);
		const paid = priced.amount > 0;
		const reservation = {
			id: uid("stay"),
			managerId: profile.id,
			checkIn: input.checkIn,
			nights: input.nights,
			adults: input.adults,
			kind: priced.kind,
			status: paid ? "pending_approval" : "confirmed",
			payment: paid ? "pending" : "not_required",
			amount: priced.amount,
			rulesVersion: RULES_VERSION,
			rulesAcceptedAt: (/* @__PURE__ */ new Date()).toISOString(),
			createdAt: (/* @__PURE__ */ new Date()).toISOString(),
			checkout: null,
			tip: "unset",
			entitlementConsumed: priced.usesBenefit,
			complimentaryApplied: priced.complimentaryNights
		};
		const people = data.people.map((p) => {
			if (p.id !== profile.id) return p;
			const complimentaryUsed = profile.complimentaryUsed + priced.complimentaryNights;
			return normalizePerson({
				...profile,
				complimentaryUsed
			});
		});
		const turnover = turnoverDate(data, input.checkIn, input.nights);
		const when = (/* @__PURE__ */ new Date()).toISOString();
		const sms = turnover ? [{
			id: uid("sms"),
			at: when,
			to: "Maria",
			body: `SAME-DAY TURNOVER\nCheckout 11:00 AM and the next check-in 3:00 PM on ${turnover}.\nPriority clean. The yacht must be READY before 3:00 PM.`
		}] : [];
		return audit({
			...data,
			people,
			reservations: [reservation, ...data.reservations],
			sms: [...sms, ...data.sms]
		}, profile.name, paid ? `Requested ${input.nights} nights starting ${input.checkIn}. Payment is not configured, so the stay is not confirmed.` : `Booked a complimentary ${input.nights}-night stay starting ${input.checkIn}.`);
	});
	if ("error" in saved) return {
		ok: false,
		error: saved.error
	};
	const snap = present(saved.data, {
		personId: actor.id,
		viewId: view.id
	});
	return {
		ok: true,
		id: saved.data.reservations[0]?.id,
		data: snap.data,
		me: snap.me
	};
}
async function changeStay(input) {
	const today = laToday();
	const { actor, view } = await actorContext();
	const me = actingGuest(actor, view);
	if (!me || !actor || !view) return {
		ok: false,
		error: "We couldn't find that stay."
	};
	const saved = await mutate((data) => {
		const currentStay = data.reservations.find((x) => x.id === input.id);
		if (!currentStay || currentStay.managerId !== me.id) return { error: "We couldn't find that stay." };
		if (currentStay.status !== "confirmed" && currentStay.status !== "pending_approval") return { error: "This stay can no longer be changed." };
		const profile = normalizePerson(data.people.find((p) => p.id === me.id) || me);
		if (input.adults < 1 || input.adults > 4) return { error: "We can welcome one to four adults." };
		if (input.nights > profile.maxStay) return { error: `This invitation is for ${profile.maxStay} nights at most.` };
		const block = canStart(data, input.checkIn, input.nights, today, input.id);
		if (block) return { error: block };
		const applied = currentStay.complimentaryApplied ?? (currentStay.entitlementConsumed ? 1 : 0);
		const restored = normalizePerson({
			...profile,
			complimentaryUsed: Math.max(0, profile.complimentaryUsed - applied)
		});
		const priced = priceStay(restored, input.nights, data.config.nightlyRate);
		const paid = priced.amount > 0;
		const people = data.people.map((p) => p.id === me.id ? normalizePerson({
			...p,
			complimentaryUsed: restored.complimentaryUsed + priced.complimentaryNights
		}) : p);
		const reservations = data.reservations.map((x) => x.id === input.id ? {
			...x,
			checkIn: input.checkIn,
			nights: input.nights,
			adults: input.adults,
			kind: priced.kind,
			amount: priced.amount,
			status: paid ? "pending_approval" : "confirmed",
			payment: paid ? "pending" : "not_required",
			entitlementConsumed: priced.usesBenefit,
			complimentaryApplied: priced.complimentaryNights
		} : x);
		return audit({
			...data,
			people,
			reservations
		}, profile.name, "Adjusted a stay.");
	});
	if ("error" in saved) return {
		ok: false,
		error: saved.error
	};
	const snap = present(saved.data, {
		personId: actor.id,
		viewId: view.id
	});
	return {
		ok: true,
		data: snap.data,
		me: snap.me
	};
}
async function cancelStay(id) {
	const { actor, view } = await actorContext();
	if (!actor || !view) return { error: "We couldn't find that stay." };
	const privileged = actor.role === "owner" || actor.role === "admin";
	const saved = await mutate((data) => {
		const stay = data.reservations.find((x) => x.id === id);
		if (!stay) return { error: "We couldn't find that stay." };
		if (!privileged && stay.managerId !== actor.id) return { error: "We couldn't find that stay." };
		if (stay.status !== "confirmed" && stay.status !== "pending_approval") return { error: "This stay can no longer be changed." };
		const late = stay.entitlementConsumed && stay.status === "confirmed" && hoursUntilCheckIn(stay.checkIn) < 48;
		const people = data.people.map((p) => {
			if (p.id !== stay.managerId || late) return p;
			const current = normalizePerson(p);
			const restore = stay.complimentaryApplied ?? (stay.entitlementConsumed ? 1 : 0);
			const complimentaryUsed = Math.max(0, current.complimentaryUsed - restore);
			return normalizePerson({
				...current,
				complimentaryUsed
			});
		});
		return audit({
			...data,
			people,
			reservations: data.reservations.map((x) => x.id === id ? {
				...x,
				status: "cancelled",
				entitlementConsumed: late ? true : false
			} : x)
		}, actor.name, late ? "Cancelled inside 48 hours. The complimentary night stays used." : "Cancelled a stay.");
	});
	if ("error" in saved) return {
		error: saved.error,
		data: present(await readState(), {
			personId: actor.id,
			viewId: view.id
		}).data
	};
	const message = saved.data.reservations.find((r) => r.id === id)?.entitlementConsumed ? "Your stay is released. Because this is inside 48 hours, the complimentary night remains with this visit." : "Your stay is released, and the complimentary night returns to your invitation.";
	const snap = present(saved.data, {
		personId: actor.id,
		viewId: view.id
	});
	return {
		error: null,
		message,
		data: snap.data,
		me: snap.me
	};
}
async function submitCheckout(id, input) {
	if (Object.keys(blankPhotos()).filter((k) => !input.photos[k]).length) return { error: "Please add the interior, cockpit, and exterior photos before you leave." };
	const { actor, view } = await actorContext();
	if (!actor || !view) return { error: "This stay is not ready for checkout." };
	const today = laToday();
	const saved = await mutate((data) => {
		const stay = data.reservations.find((x) => x.id === id);
		if (!stay || stay.managerId !== actor.id || stay.status !== "confirmed") return { error: "This stay is not ready for checkout." };
		if (today < stay.checkIn) return { error: "Checkout opens on the day you arrive." };
		const when = (/* @__PURE__ */ new Date()).toISOString();
		const job = {
			id: uid("job"),
			reservationId: id,
			status: "required",
			checks: blankChecks(),
			photos: {},
			notes: "",
			cost: data.config.cleaningCost,
			startedAt: null,
			completedAt: null
		};
		const cleaningNote = {
			id: uid("sms"),
			at: when,
			to: "Maria",
			body: "CLEANING REQUIRED\nA guest has checked out at Dock 5, Slip 36. Please clean the cabin and wash the command bridge before the next arrival."
		};
		return audit({
			...data,
			reservations: data.reservations.map((x) => x.id === id ? {
				...x,
				status: "checked_out",
				checkout: {
					at: when,
					notes: input.notes,
					damage: input.damage,
					photos: input.photos
				}
			} : x),
			jobs: [job, ...data.jobs],
			sms: [cleaningNote, ...data.sms],
			incidents: input.damage.trim() ? [{
				id: uid("inc"),
				severity: "attention",
				description: input.damage.trim(),
				photo: input.photos.overall,
				source: "guest",
				reservationId: id,
				createdAt: when,
				resolved: false
			}, ...data.incidents] : data.incidents
		}, actor.name, "Checked out. Cleaning is required.");
	});
	if ("error" in saved) return { error: saved.error };
	const snap = present(saved.data, {
		personId: actor.id,
		viewId: view.id
	});
	return {
		error: null,
		data: snap.data,
		me: snap.me
	};
}
async function requireCleaner() {
	const ctx = await actorContext();
	if (!ctx.actor || ctx.actor.role !== "cleaner" && ctx.actor.role !== "owner" && ctx.actor.role !== "admin") return null;
	return ctx;
}
async function startCleaning(jobId) {
	const ctx = await requireCleaner();
	if (!ctx?.actor || !ctx.view) return deny();
	const saved = await mutate((data) => audit({
		...data,
		jobs: data.jobs.map((j) => j.id === jobId ? {
			...j,
			status: "in_progress",
			startedAt: (/* @__PURE__ */ new Date()).toISOString()
		} : j)
	}, ctx.actor.name, "Started cleaning."));
	if ("error" in saved) return saved;
	return { data: present(saved.data, {
		personId: ctx.actor.id,
		viewId: ctx.view.id
	}).data };
}
async function toggleCheck(jobId, step) {
	const ctx = await requireCleaner();
	if (!ctx?.actor || !ctx.view) return deny();
	const saved = await mutate((data) => ({
		...data,
		jobs: data.jobs.map((j) => j.id === jobId ? {
			...j,
			checks: {
				...j.checks,
				[step]: !j.checks[step]
			}
		} : j)
	}));
	if ("error" in saved) return saved;
	return { data: present(saved.data, {
		personId: ctx.actor.id,
		viewId: ctx.view.id
	}).data };
}
async function finishCleaning(jobId, notes) {
	const ctx = await requireCleaner();
	if (!ctx?.actor || !ctx.view) return { error: "Cleaning card not found." };
	const today = laToday();
	const saved = await mutate((data) => {
		const job = data.jobs.find((j) => j.id === jobId);
		if (!job) return { error: "Cleaning card not found." };
		if (Object.values(job.checks).some((on) => !on)) return { error: "Finish the checklist first. The command bridge is on it for a reason." };
		const stay = data.reservations.find((r) => r.id === job.reservationId);
		const who = stay ? data.people.find((p) => p.id === stay.managerId)?.name : "guest";
		const when = (/* @__PURE__ */ new Date()).toISOString();
		return audit({
			...data,
			jobs: data.jobs.map((j) => j.id === jobId ? {
				...j,
				status: "complete",
				notes,
				completedAt: when
			} : j),
			expenses: [{
				id: uid("exp"),
				date: today,
				kind: "cleaning",
				label: `Turnover cleaning — ${who}`,
				amount: data.config.cleaningCost
			}, ...data.expenses]
		}, ctx.actor.name, "Marked the yacht ready after cleaning.");
	});
	if ("error" in saved) return { error: saved.error };
	return {
		error: null,
		data: present(saved.data, {
			personId: ctx.actor.id,
			viewId: ctx.view.id
		}).data
	};
}
async function reportProblem(input) {
	const ctx = await requireCleaner();
	if (!ctx?.actor || !ctx.view) return deny();
	const saved = await mutate((data) => audit({
		...data,
		incidents: [{
			id: uid("inc"),
			severity: input.severity,
			description: input.description,
			photo: input.photo,
			source: "maria",
			reservationId: input.reservationId,
			createdAt: (/* @__PURE__ */ new Date()).toISOString(),
			resolved: false
		}, ...data.incidents]
	}, ctx.actor.name, `Reported a ${input.severity} issue.`));
	if ("error" in saved) return saved;
	return { data: present(saved.data, {
		personId: ctx.actor.id,
		viewId: ctx.view.id
	}).data };
}
function requireOwner(actor) {
	return !!actor && (actor.role === "owner" || actor.role === "admin");
}
async function resolveIncident(id) {
	const { actor, view } = await actorContext();
	if (!requireOwner(actor) || !view) return deny();
	const saved = await mutate((data) => audit({
		...data,
		incidents: data.incidents.map((i) => i.id === id ? {
			...i,
			resolved: true
		} : i)
	}, actor.name, "Resolved an exception."));
	if ("error" in saved) return saved;
	return { data: present(saved.data, {
		personId: actor.id,
		viewId: view.id
	}).data };
}
async function decide(id, approve) {
	const { actor, view } = await actorContext();
	if (!requireOwner(actor) || !view) return deny();
	if (approve) return { error: "Payment is not configured, so a paid stay cannot be marked confirmed." };
	const saved = await mutate((data) => {
		const target = data.reservations.find((r) => r.id === id);
		const people = data.people.map((p) => {
			if (!target || p.id !== target.managerId) return p;
			const current = normalizePerson(p);
			const restore = target.complimentaryApplied ?? 0;
			return normalizePerson({
				...current,
				complimentaryUsed: Math.max(0, current.complimentaryUsed - restore)
			});
		});
		return audit({
			...data,
			people,
			reservations: data.reservations.map((r) => r.id === id ? {
				...r,
				status: "declined",
				payment: "waived"
			} : r)
		}, actor.name, "Declined a stay that could not be paid.");
	});
	if ("error" in saved) return saved;
	return { data: present(saved.data, {
		personId: actor.id,
		viewId: view.id
	}).data };
}
async function restoreEntitlement(personId) {
	return ownerPatch(personId, (p) => normalizePerson({
		...p,
		complimentaryUsed: 0
	}), "Restored a complimentary stay.");
}
async function grantExtra(personId) {
	return ownerPatch(personId, (p) => ({
		...p,
		extraStays: p.extraStays + 1
	}), "Granted an extra complimentary stay.");
}
async function setEligible(personId, eligible) {
	return ownerPatch(personId, (p) => normalizePerson({
		...p,
		eligible
	}), eligible ? "Opened booking access." : "Closed booking access.");
}
async function updateGuest(personId, patch) {
	return ownerPatch(personId, (p) => normalizePerson({
		...normalizePerson(p),
		...patch,
		id: p.id,
		role: patch.role ?? p.role
	}), "Updated a guest invitation.");
}
async function ownerPatch(personId, map, action) {
	const { actor, view } = await actorContext();
	if (!requireOwner(actor) || !view) return deny();
	const saved = await mutate((data) => audit({
		...data,
		people: data.people.map((p) => p.id === personId ? map(p) : p)
	}, actor.name, action));
	if ("error" in saved) return saved;
	return { data: present(saved.data, {
		personId: actor.id,
		viewId: view.id
	}).data };
}
async function addBlackout(date, reason) {
	const { actor, view } = await actorContext();
	if (!requireOwner(actor) || !view) return deny();
	const saved = await mutate((data) => audit({
		...data,
		blackouts: [{
			id: uid("blk"),
			date,
			reason
		}, ...data.blackouts]
	}, actor.name, `Blocked ${date}.`));
	if ("error" in saved) return saved;
	return { data: present(saved.data, {
		personId: actor.id,
		viewId: view.id
	}).data };
}
async function removeBlackout(id) {
	const { actor, view } = await actorContext();
	if (!requireOwner(actor) || !view) return deny();
	const saved = await mutate((data) => audit({
		...data,
		blackouts: data.blackouts.filter((b) => b.id !== id)
	}, actor.name, "Removed a blocked date."));
	if ("error" in saved) return saved;
	return { data: present(saved.data, {
		personId: actor.id,
		viewId: view.id
	}).data };
}
async function completeExterior(notes, cost) {
	const { actor, view } = await actorContext();
	if (!actor || !view || actor.role !== "cleaner" && !requireOwner(actor)) return deny();
	const today = laToday();
	const saved = await mutate((data) => {
		const open = data.maintenance.find((m) => m.kind === "exterior" && !m.completedAt);
		const nextDue = addDaysIso(today, 30);
		return audit({
			...data,
			maintenance: [{
				id: uid("wash"),
				title: "Monthly exterior wash",
				kind: "exterior",
				due: nextDue,
				completedAt: null,
				cost: 0,
				notes: "Command bridge, bird droppings, deck, cockpit, exterior surfaces.",
				cleaner: "Maria"
			}, ...data.maintenance.map((m) => m.id === open?.id ? {
				...m,
				completedAt: (/* @__PURE__ */ new Date()).toISOString(),
				notes,
				cost
			} : m)],
			expenses: cost ? [{
				id: uid("exp"),
				date: today,
				kind: "maintenance",
				label: "Monthly exterior wash",
				amount: cost
			}, ...data.expenses] : data.expenses
		}, actor.name, "Recorded the monthly exterior wash.");
	});
	if ("error" in saved) return saved;
	return { data: present(saved.data, {
		personId: actor.id,
		viewId: view.id
	}).data };
}
async function updateConfig(patch) {
	const { actor, view } = await actorContext();
	if (!requireOwner(actor) || !view) return deny();
	const saved = await mutate((data) => audit({
		...data,
		config: {
			...data.config,
			...patch
		}
	}, actor.name, "Updated yacht settings."));
	if ("error" in saved) return saved;
	return { data: present(saved.data, {
		personId: actor.id,
		viewId: view.id
	}).data };
}
async function updateGuide(patch) {
	const { actor, view } = await actorContext();
	if (!requireOwner(actor) || !view) return deny();
	const saved = await mutate((data) => audit({
		...data,
		guide: {
			...data.guide,
			...patch
		}
	}, actor.name, "Updated the guest guide."));
	if ("error" in saved) return saved;
	return { data: present(saved.data, {
		personId: actor.id,
		viewId: view.id
	}).data };
}
async function setTip(id, tip) {
	const { actor, view } = await actorContext();
	if (!actor || !view) return deny();
	const saved = await mutate((data) => {
		const stay = data.reservations.find((r) => r.id === id);
		if (!stay || stay.managerId !== actor.id && actor.role !== "owner" && actor.role !== "admin") return { error: "We couldn't find that stay." };
		return audit({
			...data,
			reservations: data.reservations.map((r) => r.id === id ? {
				...r,
				tip
			} : r)
		}, actor.name, tip === "sent" ? "Guest marked a tip as sent." : "Guest skipped the optional tip.");
	});
	if ("error" in saved) return saved;
	return { data: present(saved.data, {
		personId: actor.id,
		viewId: view.id
	}).data };
}
function addDaysIso(iso, n) {
	const [y, m, d] = iso.split("-").map(Number);
	const dt = new Date(Date.UTC(y, m - 1, d));
	dt.setUTCDate(dt.getUTCDate() + n);
	return dt.toISOString().slice(0, 10);
}
//#endregion
export { addBlackout, book, cancelStay, changeStay, completeExterior, decide, finishCleaning, grantExtra, loadSnapshot, openInvitation, removeBlackout, reportProblem, resolveIncident, restoreEntitlement, setEligible, setTip, setView, startCleaning, submitCheckout, toggleCheck, updateConfig, updateGuest, updateGuide };
