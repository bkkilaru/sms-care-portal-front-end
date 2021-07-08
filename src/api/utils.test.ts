import getPatientStatus from "./utils";

describe("getPatientStatus returns the expected value ", () => {
  it("returns Enrolled ✅ if outreach is complete ", () => {
    const data = {
      enabled: true,
      outreach: {
        outreach: false,
        yes: false,
        complete: true,
        lastMessageSent: "1",
        lastDate: new Date(),
      },
    };
    expect(getPatientStatus(data)).toBe("Enrolled ✅");
  });
  it("returns Not Sent 💤 if outreach is off ", () => {
    const data = {
      enabled: true,
      outreach: {
        outreach: false,
        yes: false,
        complete: false,
      },
    };
    expect(getPatientStatus(data)).toBe("Not Sent 💤");
  });
  it("returns Yes ❗️ if outreach is yes ", () => {
    const data = {
      enabled: true,
      outreach: {
        outreach: true,
        yes: true,
        complete: false,
        lastMessageSent: "1",
        lastDate: new Date(),
      },
    };
    expect(getPatientStatus(data)).toBe("Yes ❗️");
  });
  it("returns No Response 🔴 if outreach is ongoing ", () => {
    const data = {
      enabled: true,
      outreach: {
        outreach: true,
        yes: false,
        complete: false,
        lastMessageSent: "1",
        lastDate: new Date(),
      },
    };
    expect(getPatientStatus(data)).toBe("No Response 🔴");
  });
  it("returns Disabled if patient is disabled", () => {
    const data = {
      enabled: false,
      outreach: {
        outreach: false,
        yes: false,
        complete: true,
        lastMessageSent: "1",
        lastDate: new Date(),
      },
    };
    expect(getPatientStatus(data)).toBe("Disabled");
  });
});
