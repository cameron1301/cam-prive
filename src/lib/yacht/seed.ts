import {
  addDays,
  blankChecks,
  blankPhotos,
  laToday,
  type Data,
  type GuestType,
  type Guide,
  type Person,
} from "./logic";

const CONFIG_GAP = "ADMIN CONFIGURATION REQUIRED";

function guest(partial: Pick<Person, "id" | "name" | "region" | "role"> & Partial<Person>): Person {
  const guestType: GuestType = partial.guestType ?? (partial.role === "manager" ? "manager" : "guest");
  const complimentaryPerYear = partial.complimentaryPerYear ?? (guestType === "manager" ? 1 : 0);
  const complimentaryUsed = partial.complimentaryUsed ?? (partial.entitlement === "used" ? 1 : 0);
  return {
    email: "",
    phone: "",
    guestType,
    eligible: partial.role !== "cleaner",
    entitlement: complimentaryUsed < complimentaryPerYear ? "available" : "used",
    extraStays: 0,
    complimentaryPerYear,
    complimentaryUsed,
    preferredRate: guestType === "manager" ? 89 : 0,
    maxStay: 3,
    benefitExpires: "",
    benefitStarts: "",
    specialBenefit: "",
    inviteCode: partial.id,
    notes: "",
    ...partial,
  };
}

export function createSeed(today = laToday()): Data {
  const people: Person[] = [
    guest({ id: "cameron", name: "Cameron", region: "Owner", role: "owner", guestType: "manager", eligible: true, complimentaryPerYear: 0, complimentaryUsed: 0 }),
    guest({ id: "maria", name: "Maria", region: "Cleaner", role: "cleaner", guestType: "team", eligible: false, complimentaryPerYear: 0, complimentaryUsed: 0 }),
    guest({ id: "alex", name: "Alex Chen", region: "San Jose", role: "manager", inviteCode: "alex-escape", email: "alex@cam.example", phone: "408-555-0142", notes: "One complimentary night this year. Additional nights $89." }),
    guest({ id: "priya", name: "Priya Shah", region: "Los Angeles", role: "manager", inviteCode: "priya-escape", entitlement: "used", complimentaryPerYear: 1, complimentaryUsed: 1, email: "priya@cam.example" }),
    guest({ id: "jordan", name: "Jordan Hale", region: "Sacramento", role: "manager", inviteCode: "jordan-escape", entitlement: "used", complimentaryPerYear: 1, complimentaryUsed: 1, email: "jordan@cam.example" }),
    guest({ id: "maya", name: "Maya Ortiz", region: "San Diego", role: "manager", inviteCode: "maya-escape", email: "maya@cam.example" }),
    guest({ id: "chris", name: "Chris Nguyen", region: "Oakland", role: "manager", inviteCode: "chris-escape", email: "chris@cam.example" }),
    guest({ id: "elena", name: "Elena Vasquez", region: "Irvine", role: "manager", inviteCode: "elena-escape", email: "elena@cam.example" }),
    guest({ id: "sam", name: "Sam Patel", region: "Fresno", role: "manager", inviteCode: "sam-escape", email: "sam@cam.example" }),
    guest({ id: "riley", name: "Riley Brooks", region: "Santa Barbara", role: "manager", inviteCode: "riley-escape", email: "riley@cam.example" }),
    guest({ id: "noah", name: "Noah Kim", region: "San Francisco", role: "manager", inviteCode: "noah-escape", email: "noah@cam.example" }),
    guest({ id: "avery", name: "Avery Singh", region: "Long Beach", role: "manager", inviteCode: "avery-escape", email: "avery@cam.example" }),
    guest({
      id: "helena",
      name: "Helena Cho",
      region: "Client",
      role: "manager",
      guestType: "vip",
      inviteCode: "helena-escape",
      email: "helena@client.example",
      complimentaryPerYear: 2,
      complimentaryUsed: 0,
      notes: "VIP client. Two complimentary nights.",
    }),
    guest({
      id: "daniel",
      name: "Daniel Brooks",
      region: "Friend",
      role: "manager",
      guestType: "friend",
      inviteCode: "daniel-escape",
      preferredRate: 89,
      email: "daniel@example.com",
      complimentaryPerYear: 0,
      complimentaryUsed: 0,
      notes: "Preferred rate only. No complimentary nights.",
    }),
    guest({
      id: "alicia",
      name: "Alicia Romero",
      region: "District partner",
      role: "manager",
      guestType: "district",
      inviteCode: "alicia-escape",
      email: "alicia@district.example",
      complimentaryPerYear: 3,
      complimentaryUsed: 0,
      notes: "School district partner. Three complimentary nights.",
    }),
  ];

  const priyaIn = addDays(today, -8);
  const jordanIn = addDays(today, 16);

  const guide: Guide = {
    heroTitle: "Your Weekend on the Bay",
    heroBody: "A private dockside retreat at Sierra Point Harbor, thoughtfully created for our invited guests.",
    activities: [
      {
        id: "relax",
        title: "Waterfront quiet",
        body: "The stay is dockside. The point is the slip itself: still water, a slower evening, and nowhere you have to be.",
        verified: true,
      },
      {
        id: "sunset",
        title: "Sunset on the command bridge",
        body: "The flybridge is the best seat on the boat. Gulls use it too — Maria washes droppings after every stay.",
        verified: true,
      },
      {
        id: "read",
        title: "Reading and an early night",
        body: "Bedding, a heater, and air conditioning are aboard. This is a quiet cabin, not a party boat.",
        verified: true,
      },
      {
        id: "photo",
        title: "Bay light",
        body: "Morning and late day are the photographs. The boat does not leave the slip.",
        verified: true,
      },
      {
        id: "walk",
        title: "Marina walks",
        body: "A dock walk is part of the stay. Which paths, gates, and hours guests may use is not published until the owner confirms it.",
        verified: false,
      },
      {
        id: "food",
        title: "Dinner and coffee nearby",
        body: "Bring food that needs no stove. Restaurant and coffee notes stay blank until someone who knows the harbor writes them.",
        verified: false,
      },
      {
        id: "fish",
        title: "Fishing",
        body: "Only where it is legal and the marina allows it. No spot, license rule, or hour is listed until that is verified.",
        verified: false,
      },
      {
        id: "bbq",
        title: "Picnic or BBQ",
        body: "Open flame and stovetop cooking are not allowed aboard. Shore BBQ is listed only if marina rules actually permit it.",
        verified: false,
      },
    ],
    bring: [
      "Toiletries for the shore shower — there is no shower aboard",
      "A warm layer; the bay cools after sunset",
      "Food and coffee supplies that do not need a stove or flame",
      "Drinking water",
      "A trash bag for whatever the galley bin will not hold",
      "Soft shoes for the dock",
      "A phone charger",
    ],
    escape24: [
      "3:00 PM — Come aboard. The manager named on the reservation stays for the whole visit.",
      "Late afternoon — Command bridge, then the cabin if the wind picks up.",
      "Evening — Cold supper or something warmed only in the microwave. No cooking.",
      "Night — Adults only. Marina quiet hours apply once the owner publishes them.",
      "Morning — Shore restroom and shower. The boat’s head and shower stay closed.",
      "11:00 AM — Checkout photos, trash, towels, and bedding set aside for Maria.",
    ],
    escape48: [
      "Night one — Arrive at 3:00 PM, settle two adults, watch the light from the bridge.",
      "Morning — Shore facilities, then a slow dock walk only where access has been confirmed.",
      "Day two — Reading, bay views, and a picnic that never lights a flame on board.",
      "Evening two — Same house rules. The stereo and TV are aboard; a party is not.",
      "Checkout morning — 9:00 AM reminder, off the boat at 11:00 AM, four photos before you go.",
    ],
  };

  return {
    people,
    reservations: [
      {
        id: "stay-priya",
        managerId: "priya",
        checkIn: priyaIn,
        nights: 2,
        adults: 2,
        kind: "complimentary",
        status: "checked_out",
        payment: "not_required",
        amount: 0,
        rulesVersion: "2026-10-house-1",
        rulesAcceptedAt: `${priyaIn}T15:00:00-07:00`,
        createdAt: `${addDays(priyaIn, -10)}T18:00:00Z`,
        checkout: {
          at: `${addDays(priyaIn, 2)}T18:00:00Z`,
          notes: "Quiet stay. Gulls were busy on the bridge.",
          damage: "",
          photos: blankPhotos(),
        },
        tip: "sent",
        entitlementConsumed: true,
        complimentaryApplied: 1,
      },
      {
        id: "stay-jordan",
        managerId: "jordan",
        checkIn: jordanIn,
        nights: 2,
        adults: 2,
        kind: "paid",
        status: "cancelled",
        payment: "not_required",
        amount: 0,
        rulesVersion: "2026-10-house-1",
        rulesAcceptedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        checkout: null,
        tip: "unset",
        entitlementConsumed: false,
        complimentaryApplied: 0,
      },
    ],
    jobs: [
      {
        id: "job-priya",
        reservationId: "stay-priya",
        status: "complete",
        checks: Object.fromEntries(Object.keys(blankChecks()).map((k) => [k, true])),
        photos: {},
        notes: "Bridge washed. Bird droppings on the command bridge cleared.",
        cost: 100,
        startedAt: `${addDays(priyaIn, 2)}T19:00:00Z`,
        completedAt: `${addDays(priyaIn, 2)}T22:00:00Z`,
      },
    ],
    incidents: [],
    blackouts: [],
    maintenance: [
      {
        id: "wash-month",
        title: "Monthly exterior wash",
        kind: "exterior",
        due: addDays(today, 9),
        completedAt: null,
        cost: 0,
        notes: "Command bridge, bird droppings, deck, cockpit, exterior surfaces.",
        cleaner: "Maria",
      },
    ],
    expenses: [
      {
        id: "exp-priya",
        date: addDays(priyaIn, 2),
        kind: "cleaning",
        label: "Turnover cleaning — Priya Shah",
        amount: 100,
      },
    ],
    audit: [
      {
        id: "audit-seed",
        at: new Date().toISOString(),
        actor: "System",
        action: "Walkthrough opened with ten managers, one finished stay, and one paid request waiting.",
      },
    ],
    sms: [],
    config: {
      access: CONFIG_GAP,
      parking: CONFIG_GAP,
      shore:
        "There is no usable toilet or shower aboard. Guests use onshore facilities. Location, hours, and how to get in: " +
        CONFIG_GAP,
      wifi: CONFIG_GAP,
      emergency: CONFIG_GAP,
      zelle: CONFIG_GAP,
      nightlyRate: 89,
      cleaningCost: 100,
      slipMonthly: 400,
      maxNights: 3,
      horizonDays: 30,
    },
    guide,
  };
}
