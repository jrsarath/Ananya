import { describe, it, expect } from "vitest";
import { Serial } from "./serial";

describe("Serial aggregate", () => {
  it("should create a valid Serial", () => {
    const serial = Serial.create({
      componentId: "comp-1",
      serialNumber: "SN-987654321",
      locationId: "loc-1",
    });

    expect(serial.id).toBeDefined();
    expect(serial.serialNumber).toBe("SN-987654321");
    expect(serial.locationId).toBe("loc-1");
  });

  it("should throw when serial number is empty", () => {
    expect(() =>
      Serial.create({
        componentId: "comp-1",
        serialNumber: "",
      }),
    ).toThrow();
  });
});
