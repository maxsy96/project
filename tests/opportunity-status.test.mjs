import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { getOpportunityStatus, isOpportunityOpen, sortOpportunitiesForDisplay } from "../lib/opportunity-utils.ts";
import { isActiveEventStatus, isEventSubmissionOpen } from "../lib/event-utils.ts";

const now = Date.parse("2026-11-02T00:00:00+04:00");
const approved = { status: "open", approvalStatus: "approved", deadline: "2026-11-10T23:59:59+04:00" };

// Read only the data declarations; importing seed.ts would reset the database.
const seedSource = readFileSync(new URL("../prisma/seed.ts", import.meta.url), "utf8");
function seedCollection(name, nextName) {
  const section = seedSource.slice(seedSource.indexOf(`const ${name}:`), seedSource.indexOf(`const ${nextName}:`));
  const declaration = section.replace(/: (OpportunitySeed|EventSeed)\[\]/, "");
  return runInNewContext(`${declaration}\n${name};`, {
    d: (date) => new Date(`${date}T09:00:00.000Z`),
    clubEmail: "club@example.test",
  });
}

test("seed records close elapsed windows and hold proposal-backed publications for confirmation", () => {
  const records = seedCollection("opportunities", "events");
  assert.equal(records.length, 12);
  for (const record of records) {
    assert.ok(record.deadline.getTime() < now, record.title);
    assert.equal(record.status, "closed", record.title);
    if (record.source.toLowerCase().includes("propos")) {
      assert.equal(record.approvalStatus, "pending", record.title);
    }
  }
  assert.equal(records.filter((record) => record.approvalStatus === "pending").length, 6);
});

test("the six proposal-backed event records are clearly labelled and cannot register students", () => {
  const records = seedCollection("events", "achievements");
  const proposed = records.filter((record) => record.status === "proposed");
  assert.equal(proposed.length, 6);
  for (const record of proposed) {
    assert.equal(record.submissionStatus, "closed", record.title);
    assert.equal(isEventSubmissionOpen(record.status, record.submissionStatus), false, record.title);
  }
});

test("all dated seed application windows have passed by 2 November in the UAE", () => {
  const deadlines = ["2026-07-15", "2026-09-10", "2026-09-22", "2026-10-01", "2026-10-12", "2026-10-25", "2026-09-30", "2026-08-20", "2026-07-05", "2026-08-10", "2026-11-01", "2026-09-05"];
  for (const status of ["open", "closing soon"]) {
    for (const date of deadlines) {
      const record = { ...approved, status, deadline: `${date}T09:00:00.000Z` };
      assert.equal(getOpportunityStatus(record, now), "closed");
      assert.equal(isOpportunityOpen(record, now), false);
    }
  }
});

test("closes at the exact stored deadline, including equivalent timezone offsets", () => {
  const record = { ...approved, deadline: "2026-11-02T00:00:00+04:00" };
  assert.equal(isOpportunityOpen(record, now - 1), true);
  assert.equal(isOpportunityOpen(record, now), false);
  assert.equal(isOpportunityOpen({ ...record, deadline: new Date("2026-11-01T20:00:00Z") }, now), false);
});

test("preserves genuinely extended deadlines from the latest admin record", () => {
  const seed = { ...approved, deadline: "2026-10-12T09:00:00Z" };
  const liveOverride = { deadline: "2026-11-12T23:59:59+04:00", status: "closing soon" };
  assert.equal(isOpportunityOpen(seed, now), false);
  const current = { ...seed, ...liveOverride };
  assert.equal(getOpportunityStatus(current, now), "closing soon");
  assert.equal(isOpportunityOpen(current, now), true);
  assert.deepEqual(liveOverride, { deadline: "2026-11-12T23:59:59+04:00", status: "closing soon" });
});

test("an extension does not reopen a deliberately closed, completed, cancelled, or unconfirmed record", () => {
  for (const status of ["closed", "completed", "cancelled", "awaiting confirmation"]) {
    assert.equal(getOpportunityStatus({ ...approved, status }, now), status);
    assert.equal(isOpportunityOpen({ ...approved, status }, now), false);
  }
});

test("requires explicit approval, including for rolling opportunities without a deadline", () => {
  for (const approvalStatus of ["pending", "rejected", "", undefined]) {
    for (const deadline of [approved.deadline, null]) {
      assert.equal(getOpportunityStatus({ ...approved, approvalStatus, deadline }, now), "awaiting confirmation");
      assert.equal(isOpportunityOpen({ ...approved, approvalStatus, deadline }, now), false);
    }
  }
  assert.equal(isOpportunityOpen({ ...approved, deadline: null }, now), true);
});

test("unknown statuses and malformed or missing deadlines cannot authorize applications", () => {
  for (const status of ["not closed", "not open", "pending", "proposed", "archived", ""]) {
    assert.equal(isOpportunityOpen({ ...approved, status }, now), false);
  }
  for (const deadline of ["invalid", "", new Date(NaN), undefined]) {
    assert.equal(isOpportunityOpen({ ...approved, deadline }, now), false);
  }
});

test("sorting and status filters agree on effective availability without mutating records", () => {
  const records = [
    { ...approved, id: "expired", deadline: "2026-10-01T00:00:00Z" },
    { ...approved, id: "completed", status: "completed" },
    { ...approved, id: "pending", approvalStatus: "pending" },
    { ...approved, id: "extended", status: "closing soon" },
    { ...approved, id: "open" },
  ];
  const snapshot = structuredClone(records);
  const sorted = sortOpportunitiesForDisplay(records, now);
  assert.deepEqual(sorted.map((record) => record.id), ["open", "extended", "expired", "completed", "pending"]);
  assert.deepEqual(sorted.filter((record) => getOpportunityStatus(record, now) === "open").map((record) => record.id), ["open"]);
  assert.deepEqual(records, snapshot);
});

test("proposed and unknown events are excluded from upcoming activities and reject registration", () => {
  for (const status of ["proposed", "awaiting confirmation", "completed", "cancelled", "closed", "unknown"]) {
    assert.equal(isActiveEventStatus(status), false);
    assert.equal(isEventSubmissionOpen(status, "open"), false);
  }
  assert.equal(isEventSubmissionOpen("upcoming", "open"), true);
  assert.equal(isEventSubmissionOpen("closing soon", "closing soon"), true);
  assert.equal(isEventSubmissionOpen("upcoming", "pending"), false);
  assert.equal(isEventSubmissionOpen("upcoming", "closed"), false);
});
