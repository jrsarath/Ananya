import { describe, it, expect } from "vitest";
import { ObjectId } from "./object-id";

describe("ObjectId", () => {
  it("should generate a valid ObjectId string value", () => {
    const id = ObjectId.generate();
    expect(id.value).toBeDefined();
    expect(typeof id.value).toBe("string");
    expect(id.value.length).toBeGreaterThan(0);
  });

  it("should create an ObjectId from a value string", () => {
    const rawValue = "test-id-123";
    const id = ObjectId.create(rawValue);
    expect(id.value).toBe(rawValue);
  });

  it("should throw an error if an empty value is provided", () => {
    expect(() => new ObjectId("")).toThrow();
  });
});
