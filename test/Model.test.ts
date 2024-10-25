import { Model } from "../src/runtime/Model";
import { QueryBuilder } from "../src/runtime/QueryBuilder";

class TestModel extends Model {
  static baseURL = "/api/test";
}

describe("Model", () => {
  beforeAll(() => {
    // Mock the request method
    TestModel.request = jest.fn().mockResolvedValue([]);
  });

  it("should create a new instance with attributes", () => {
    const model = new TestModel({ id: 1, name: "Test" });
    expect(model["$attributes"]).toEqual({ id: 1, name: "Test" });
  });

  it("should return a QueryBuilder instance when calling query()", () => {
    expect(TestModel.query()).toBeInstanceOf(QueryBuilder);
  });

  it("should call $http with correct URL when calling $all()", async () => {
    await TestModel.$all();
    expect(TestModel.request).toHaveBeenCalledWith("/api/test", { params: {} });
  });

  it("should call $http with correct URL and ID when calling $find()", async () => {
    await TestModel.$find(1);
    expect(TestModel.request).toHaveBeenCalledWith("/api/test/1");
  });

  it("should call create when $save() is called on a new instance", async () => {
    const model = new TestModel({ name: "New Test" });
    await model.$save();
    expect(TestModel.request).toHaveBeenCalledWith("/api/test", {
      method: "POST",
      body: { name: "New Test" },
    });
  });

  it("should call update when $save() is called on an existing instance", async () => {
    const model = new TestModel({ id: 1, name: "Existing Test" });
    await model.$save();
    expect(TestModel.request).toHaveBeenCalledWith("/api/test/1", {
      method: "PUT",
      body: { id: 1, name: "Existing Test" },
    });
  });

  it("should call $http with DELETE method when $delete() is called", async () => {
    const model = new TestModel({ id: 1 });
    await model.$delete();
    expect(TestModel.request).toHaveBeenCalledWith("/api/test/1", {
      method: "DELETE",
    });
  });
});
