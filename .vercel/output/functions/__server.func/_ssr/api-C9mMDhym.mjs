import { n as createServerFn, r as TSS_SERVER_FUNCTION } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-C9mMDhym.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var loadState_createServerFn_handler = createServerRpc({
	id: "6dcd232250baee1c7a595773c54cdaafe6532fffd419340f5be89868a7cecfa4",
	name: "loadState",
	filename: "src/lib/yacht/api.ts"
}, (opts) => loadState.__executeServer(opts));
var loadState = createServerFn({ method: "GET" }).handler(loadState_createServerFn_handler, async () => {
	return (await import("./ops.server-Cngu6RMq.mjs")).loadSnapshot();
});
var openInvite_createServerFn_handler = createServerRpc({
	id: "ff6d7e894a81439b699080788226dda61143cc72c404b62964b7c3dc1c400a60",
	name: "openInvite",
	filename: "src/lib/yacht/api.ts"
}, (opts) => openInvite.__executeServer(opts));
var openInvite = createServerFn({ method: "POST" }).validator((code) => code.trim().toLowerCase()).handler(openInvite_createServerFn_handler, async ({ data }) => {
	return (await import("./ops.server-Cngu6RMq.mjs")).openInvitation(data);
});
var switchView_createServerFn_handler = createServerRpc({
	id: "77b4c72219c22c2f40d22fd4fcd78323e8d878fd1928d46e561bba43bdbf74e5",
	name: "switchView",
	filename: "src/lib/yacht/api.ts"
}, (opts) => switchView.__executeServer(opts));
var switchView = createServerFn({ method: "POST" }).validator((id) => id).handler(switchView_createServerFn_handler, async ({ data }) => {
	return (await import("./ops.server-Cngu6RMq.mjs")).setView(data);
});
var bookStay_createServerFn_handler = createServerRpc({
	id: "a06698e9a0146240e852e8069c9d8af5aace7b1f7683ef8b63dc115ad98b7a6b",
	name: "bookStay",
	filename: "src/lib/yacht/api.ts"
}, (opts) => bookStay.__executeServer(opts));
var bookStay = createServerFn({ method: "POST" }).validator((input) => input).handler(bookStay_createServerFn_handler, async ({ data }) => {
	return (await import("./ops.server-Cngu6RMq.mjs")).book(data);
});
var changeStayFn_createServerFn_handler = createServerRpc({
	id: "ee2d64735b81b652eaebe5c3775d6188f30325945c534f0c68fa2986862e6efd",
	name: "changeStayFn",
	filename: "src/lib/yacht/api.ts"
}, (opts) => changeStayFn.__executeServer(opts));
var changeStayFn = createServerFn({ method: "POST" }).validator((input) => input).handler(changeStayFn_createServerFn_handler, async ({ data }) => {
	return (await import("./ops.server-Cngu6RMq.mjs")).changeStay(data);
});
var cancelStayFn_createServerFn_handler = createServerRpc({
	id: "6005e78da78002c606bc744915814047932241558c122260cf715b5f3ed88f90",
	name: "cancelStayFn",
	filename: "src/lib/yacht/api.ts"
}, (opts) => cancelStayFn.__executeServer(opts));
var cancelStayFn = createServerFn({ method: "POST" }).validator((id) => id).handler(cancelStayFn_createServerFn_handler, async ({ data }) => {
	return (await import("./ops.server-Cngu6RMq.mjs")).cancelStay(data);
});
var checkoutFn_createServerFn_handler = createServerRpc({
	id: "f6badc2545bd503498fd3a6e7f4258722503105c0e9c909b351d7b26b790d5c4",
	name: "checkoutFn",
	filename: "src/lib/yacht/api.ts"
}, (opts) => checkoutFn.__executeServer(opts));
var checkoutFn = createServerFn({ method: "POST" }).validator((input) => input).handler(checkoutFn_createServerFn_handler, async ({ data }) => {
	return (await import("./ops.server-Cngu6RMq.mjs")).submitCheckout(data.id, data);
});
var tipFn_createServerFn_handler = createServerRpc({
	id: "25a8533a059b0d2d8b73ff870744640f8493d88ebd3205a1d2fe7dfb7df8ab9e",
	name: "tipFn",
	filename: "src/lib/yacht/api.ts"
}, (opts) => tipFn.__executeServer(opts));
var tipFn = createServerFn({ method: "POST" }).validator((input) => input).handler(tipFn_createServerFn_handler, async ({ data }) => {
	return (await import("./ops.server-Cngu6RMq.mjs")).setTip(data.id, data.tip);
});
var startCleanFn_createServerFn_handler = createServerRpc({
	id: "c92aebc8081967e3842c03c65d480cb278d7eb1ba390f1e4f3cacfe64a28c3b1",
	name: "startCleanFn",
	filename: "src/lib/yacht/api.ts"
}, (opts) => startCleanFn.__executeServer(opts));
var startCleanFn = createServerFn({ method: "POST" }).validator((id) => id).handler(startCleanFn_createServerFn_handler, async ({ data }) => {
	return (await import("./ops.server-Cngu6RMq.mjs")).startCleaning(data);
});
var toggleCheckFn_createServerFn_handler = createServerRpc({
	id: "bf8bebef2a70f7b7e33b363d32e58d1b95a93d945a990e3643c6aad6fa57120d",
	name: "toggleCheckFn",
	filename: "src/lib/yacht/api.ts"
}, (opts) => toggleCheckFn.__executeServer(opts));
var toggleCheckFn = createServerFn({ method: "POST" }).validator((input) => input).handler(toggleCheckFn_createServerFn_handler, async ({ data }) => {
	return (await import("./ops.server-Cngu6RMq.mjs")).toggleCheck(data.jobId, data.step);
});
var finishCleanFn_createServerFn_handler = createServerRpc({
	id: "2b9060716894f8486623efe38e7f35b437a3b98526ff2ce2a9e21748f31467d5",
	name: "finishCleanFn",
	filename: "src/lib/yacht/api.ts"
}, (opts) => finishCleanFn.__executeServer(opts));
var finishCleanFn = createServerFn({ method: "POST" }).validator((input) => input).handler(finishCleanFn_createServerFn_handler, async ({ data }) => {
	return (await import("./ops.server-Cngu6RMq.mjs")).finishCleaning(data.jobId, data.notes);
});
var reportFn_createServerFn_handler = createServerRpc({
	id: "935f3e0eeb075b7550004977ed301133777275c8b6db5fdafd23e141fe9ec643",
	name: "reportFn",
	filename: "src/lib/yacht/api.ts"
}, (opts) => reportFn.__executeServer(opts));
var reportFn = createServerFn({ method: "POST" }).validator((input) => input).handler(reportFn_createServerFn_handler, async ({ data }) => {
	return (await import("./ops.server-Cngu6RMq.mjs")).reportProblem(data);
});
var resolveFn_createServerFn_handler = createServerRpc({
	id: "30eee50714cd987b56c45e70b0eae87ab0e4c8df11faccdb84eb8de1948d55f3",
	name: "resolveFn",
	filename: "src/lib/yacht/api.ts"
}, (opts) => resolveFn.__executeServer(opts));
var resolveFn = createServerFn({ method: "POST" }).validator((id) => id).handler(resolveFn_createServerFn_handler, async ({ data }) => {
	return (await import("./ops.server-Cngu6RMq.mjs")).resolveIncident(data);
});
var decideFn_createServerFn_handler = createServerRpc({
	id: "73c6020269e1e4fa086d994f0e0b0f95d749d49f8f5a5faf189e3c1824e8ed40",
	name: "decideFn",
	filename: "src/lib/yacht/api.ts"
}, (opts) => decideFn.__executeServer(opts));
var decideFn = createServerFn({ method: "POST" }).validator((input) => input).handler(decideFn_createServerFn_handler, async ({ data }) => {
	return (await import("./ops.server-Cngu6RMq.mjs")).decide(data.id, data.approve);
});
var restoreFn_createServerFn_handler = createServerRpc({
	id: "508f185bff14459b0ea2e2520a7a32989205caaac671da6d0d9e9f6cd9621d89",
	name: "restoreFn",
	filename: "src/lib/yacht/api.ts"
}, (opts) => restoreFn.__executeServer(opts));
var restoreFn = createServerFn({ method: "POST" }).validator((id) => id).handler(restoreFn_createServerFn_handler, async ({ data }) => {
	return (await import("./ops.server-Cngu6RMq.mjs")).restoreEntitlement(data);
});
var grantFn_createServerFn_handler = createServerRpc({
	id: "b13f47753fba05f7ab34fe68da6a1e749d3959f91dbbc4c12eb8c4fe23c88a63",
	name: "grantFn",
	filename: "src/lib/yacht/api.ts"
}, (opts) => grantFn.__executeServer(opts));
var grantFn = createServerFn({ method: "POST" }).validator((id) => id).handler(grantFn_createServerFn_handler, async ({ data }) => {
	return (await import("./ops.server-Cngu6RMq.mjs")).grantExtra(data);
});
var eligibleFn_createServerFn_handler = createServerRpc({
	id: "2218ea8158bc5253146da0daadf0a7e6c838866c5994c7deb9d7f09caf1059be",
	name: "eligibleFn",
	filename: "src/lib/yacht/api.ts"
}, (opts) => eligibleFn.__executeServer(opts));
var eligibleFn = createServerFn({ method: "POST" }).validator((input) => input).handler(eligibleFn_createServerFn_handler, async ({ data }) => {
	return (await import("./ops.server-Cngu6RMq.mjs")).setEligible(data.personId, data.eligible);
});
var updateGuestFn_createServerFn_handler = createServerRpc({
	id: "0ef28500f12245b15e29e632f97c2c70546782b887e62c4fe09e2185aeda1ebb",
	name: "updateGuestFn",
	filename: "src/lib/yacht/api.ts"
}, (opts) => updateGuestFn.__executeServer(opts));
var updateGuestFn = createServerFn({ method: "POST" }).validator((input) => input).handler(updateGuestFn_createServerFn_handler, async ({ data }) => {
	return (await import("./ops.server-Cngu6RMq.mjs")).updateGuest(data.personId, data.patch);
});
var blackoutFn_createServerFn_handler = createServerRpc({
	id: "1be3adf2aa01b83b41a77db8ae46461293d82435333255ba2cec2c5cd9eec7ae",
	name: "blackoutFn",
	filename: "src/lib/yacht/api.ts"
}, (opts) => blackoutFn.__executeServer(opts));
var blackoutFn = createServerFn({ method: "POST" }).validator((input) => input).handler(blackoutFn_createServerFn_handler, async ({ data }) => {
	return (await import("./ops.server-Cngu6RMq.mjs")).addBlackout(data.date, data.reason);
});
var removeBlackoutFn_createServerFn_handler = createServerRpc({
	id: "3be98a60c5d25d4f79913381f11300d675381233916dc2afb27ef6deabc37f59",
	name: "removeBlackoutFn",
	filename: "src/lib/yacht/api.ts"
}, (opts) => removeBlackoutFn.__executeServer(opts));
var removeBlackoutFn = createServerFn({ method: "POST" }).validator((id) => id).handler(removeBlackoutFn_createServerFn_handler, async ({ data }) => {
	return (await import("./ops.server-Cngu6RMq.mjs")).removeBlackout(data);
});
var washFn_createServerFn_handler = createServerRpc({
	id: "b4a4da841bbb9fa6cd2bf05d225be322dd2153b8bc7949d70fe028dde45f5d3c",
	name: "washFn",
	filename: "src/lib/yacht/api.ts"
}, (opts) => washFn.__executeServer(opts));
var washFn = createServerFn({ method: "POST" }).validator((input) => input).handler(washFn_createServerFn_handler, async ({ data }) => {
	return (await import("./ops.server-Cngu6RMq.mjs")).completeExterior(data.notes, data.cost);
});
var configFn_createServerFn_handler = createServerRpc({
	id: "06269c74b4c2d9813fc6eb1eeb5811c8dcb5fbd6575f2fa533c69a860a6b901f",
	name: "configFn",
	filename: "src/lib/yacht/api.ts"
}, (opts) => configFn.__executeServer(opts));
var configFn = createServerFn({ method: "POST" }).validator((patch) => patch).handler(configFn_createServerFn_handler, async ({ data }) => {
	return (await import("./ops.server-Cngu6RMq.mjs")).updateConfig(data);
});
var guideFn_createServerFn_handler = createServerRpc({
	id: "47d1bfa58248b719659377f881333b3f5482bf995b03e6fcb75c10cc2f2c10f8",
	name: "guideFn",
	filename: "src/lib/yacht/api.ts"
}, (opts) => guideFn.__executeServer(opts));
var guideFn = createServerFn({ method: "POST" }).validator((patch) => patch).handler(guideFn_createServerFn_handler, async ({ data }) => {
	return (await import("./ops.server-Cngu6RMq.mjs")).updateGuide(data);
});
//#endregion
export { blackoutFn_createServerFn_handler, bookStay_createServerFn_handler, cancelStayFn_createServerFn_handler, changeStayFn_createServerFn_handler, checkoutFn_createServerFn_handler, configFn_createServerFn_handler, decideFn_createServerFn_handler, eligibleFn_createServerFn_handler, finishCleanFn_createServerFn_handler, grantFn_createServerFn_handler, guideFn_createServerFn_handler, loadState_createServerFn_handler, openInvite_createServerFn_handler, removeBlackoutFn_createServerFn_handler, reportFn_createServerFn_handler, resolveFn_createServerFn_handler, restoreFn_createServerFn_handler, startCleanFn_createServerFn_handler, switchView_createServerFn_handler, tipFn_createServerFn_handler, toggleCheckFn_createServerFn_handler, updateGuestFn_createServerFn_handler, washFn_createServerFn_handler };
