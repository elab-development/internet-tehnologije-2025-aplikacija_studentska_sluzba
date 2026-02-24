/**
 * Automatizovani testovi za API rute
 *
 * Ovi testovi proveravaju da li API rute rade ispravno
 * bez potrebe da ručno otvaramo browser.
 *
 * Pokretanje sa: npm run test
 */

import { describe, it, expect } from "vitest";

const BASE_URL = process.env.TEST_URL || "http://localhost:3000";

// testovi za Auth API
describe("Auth API", () => {
  it("POST /api/auth/login - odbija pogrešne kredencijale", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "nepostojeci@test.com",
        password: "pogresanlozinka",
      }),
    });

    expect(res.status).toBe(401);

    const data = await res.json();
    expect(data.error).toBeDefined();
  });

  it("POST /api/auth/login - odbija prazan zahtev", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it("GET /api/auth/me - vraća 401 bez sesije", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/me`);
    expect(res.status).toBe(401);
  });
});

// testovi za Request Types API
describe("Request Types API", () => {
  it("GET /api/request-types - vraća listu tipova", async () => {
    const res = await fetch(`${BASE_URL}/api/request-types`);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.requestTypes).toBeDefined();
    expect(Array.isArray(data.requestTypes)).toBe(true);
  });
});

// testovi za Requests API
describe("Requests API", () => {
  it("GET /api/requests - vraća 401 bez sesije", async () => {
    const res = await fetch(`${BASE_URL}/api/requests`);
    expect(res.status).toBe(401);
  });

  it("POST /api/requests - odbija neautentifikovane", async () => {
    const res = await fetch(`${BASE_URL}/api/requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requestTypeId: 1,
        purpose: "Test",
      }),
    });

    expect(res.status).toBe(401);
  });
});

// testovi za Stats API
describe("Stats API", () => {
  it("GET /api/stats - vraća statistike", async () => {
    const res = await fetch(`${BASE_URL}/api/stats`);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.totalRequests).toBeDefined();
    expect(data.completedRequests).toBeDefined();
    expect(data.avgProcessingDays).toBeDefined();
  });
});

// testovi za eksterni Holidays API
describe("Holidays API", () => {
  it("GET /api/holidays - vraća praznike za RS", async () => {
    const res = await fetch(`${BASE_URL}/api/holidays?country=RS&year=2026`);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.holidays).toBeDefined();
    expect(Array.isArray(data.holidays)).toBe(true);
    expect(data.holidays.length).toBeGreaterThan(5);
  });
});

// testovi za Documents API
describe("Documents API", () => {
  it("POST /api/documents/generate - generiše PDF", async () => {
    const res = await fetch(`${BASE_URL}/api/documents/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentName: "Test Student",
        indexNumber: "2021/0001",
        purpose: "Za testiranje",
        documentType: "UVERENJE O STUDIRANJU",
      }),
    });

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("application/pdf");
  });

  it("POST /api/documents/generate - odbija bez podataka", async () => {
    const res = await fetch(`${BASE_URL}/api/documents/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error).toBeDefined();
  });
});