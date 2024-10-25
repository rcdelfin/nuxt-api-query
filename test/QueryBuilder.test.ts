import { QueryBuilder } from "../src/runtime/QueryBuilder";
import { Model } from "../src/runtime/Model";

class TestModel extends Model {
  static baseURL = "/api/test";
}

describe("QueryBuilder", () => {
  let queryBuilder: QueryBuilder<typeof TestModel>;

  beforeEach(() => {
    queryBuilder = new QueryBuilder(TestModel);
    TestModel.request = jest.fn().mockResolvedValue([]);
  });

  it("should add where clause", () => {
    queryBuilder.where("field", "value");
    expect(queryBuilder["wheres"]).toEqual([
      { field: "field", operator: "=", value: "value" },
    ]);
  });

  it("should add where clause with custom operator", () => {
    queryBuilder.where("field", ">", "value");
    expect(queryBuilder["wheres"]).toEqual([
      { field: "field", operator: ">", value: "value" },
    ]);
  });

  it("should add includes", () => {
    queryBuilder.with("relation1", "relation2");
    expect(queryBuilder["includes"]).toEqual(["relation1", "relation2"]);
  });

  it("should add orderBy", () => {
    queryBuilder.orderBy("field", "desc");
    expect(queryBuilder["sorts"]).toEqual(["field:desc"]);
  });

  it("should set limit", () => {
    queryBuilder.limit(10);
    expect(queryBuilder["limitValue"]).toBe(10);
  });

  it("should set page", () => {
    queryBuilder.page(2);
    expect(queryBuilder["pageValue"]).toBe(2);
  });

  it("should generate correct query params", () => {
    queryBuilder
      .where("field1", "value1")
      .where("field2", ">", "value2")
      .with("relation")
      .orderBy("field", "desc")
      .limit(10)
      .page(2);

    const params = queryBuilder["getQueryParams"]();
    expect(params).toEqual({
      where: JSON.stringify([
        { field: "field1", operator: "=", value: "value1" },
        { field: "field2", operator: ">", value: "value2" },
      ]),
      include: "relation",
      sort: "field:desc",
      limit: 10,
      page: 2,
    });
  });

  it("should call $http with correct params when get() is called", async () => {
    await queryBuilder.where("field", "value").get();
    expect(TestModel.request).toHaveBeenCalledWith("/api/test", {
      params: {
        where: JSON.stringify([
          { field: "field", operator: "=", value: "value" },
        ]),
      },
    });
  });
});
