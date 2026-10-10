import type { CheckItem } from "./checklist";
import type { StayPhase } from "./time";

export type Role = "owner" | "manager" | "staff" | "steward" | "pending";

export type Me = {
  id: number;
  name: string;
  email: string | null;
  role: Role;
  staysGranted: number;
  staysUsed: number;
  remaining: number;
};

export type Wash = {
  id: number;
  ready: boolean;
  note: string;
  items: CheckItem[];
};

export type Stay = {
  id: number;
  guest: string;
  mine: boolean;
  checkIn: string;
  nights: number;
  partySize: number;
  note: string;
  leftEarly: boolean;
  phase: StayPhase;
  canCancel: boolean;
  canLeave: boolean;
  wash: Wash | null;
};

export type RosterPerson = {
  id: number;
  name: string;
  email: string | null;
  role: Role;
  linked: boolean;
  staysGranted: number;
  staysUsed: number;
};

export type BookGate = {
  allowed: boolean;
  reason: string;
};

export type HarborReady = {
  officeClaimed: true;
  me: Me;
  phase: "ready" | "aboard" | "wash";
  deskName: string;
  stewardNeedsEmail: boolean;
  managerCount: number;
  partyMax: number;
  gateNote: string | null;
  today: string;
  minCheckIn: string;
  maxCheckIn: string;
  taken: string[];
  blackouts: string[];
  washes: string[];
  stays: Stay[];
  roster: RosterPerson[] | null;
  book: BookGate;
};

export type HarborUnclaimed = {
  officeClaimed: false;
  viewerName: string;
};

export type HarborState = HarborReady | HarborUnclaimed;

export type Board = {
  taken: string[];
  blackouts: string[];
  washes: string[];
  partyMax: number;
};

export type ActionResult = { ok: true } | { ok: false; error: string };
