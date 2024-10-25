import { Model } from "./Model";

export class QueryBuilder<M extends Model> {
  protected wheres: Array<{ field: string; operator: string; value: any }> = [];
  protected includes: string[] = [];
  protected sorts: string[] = [];
  protected limitValue: number | null = null;
  protected pageValue: number | null = null;

  constructor(protected model: typeof Model) {}

  where(
    field: string,
    operatorOrValue: string | number | boolean,
    value?: any
  ): this {
    if (value === undefined) {
      this.wheres.push({ field, operator: "=", value: operatorOrValue });
    } else {
      this.wheres.push({ field, operator: operatorOrValue as string, value });
    }
    return this;
  }

  with(...relations: string[]): this {
    this.includes.push(...relations);
    return this;
  }

  orderBy(field: string, direction: "asc" | "desc" = "asc"): this {
    this.sorts.push(`${field}:${direction}`);
    return this;
  }

  limit(value: number): this {
    this.limitValue = value;
    return this;
  }

  page(value: number): this {
    this.pageValue = value;
    return this;
  }

  async get(): Promise<InstanceType<M>[]> {
    const response = await this.model.$http(this.model.baseURL, {
      params: this.getQueryParams(),
    });
    return response.map((item: any) => new this.model(item));
  }

  async find(id: string | number): Promise<InstanceType<M>> {
    const response = await this.model.$http(`${this.model.baseURL}/${id}`);
    return new this.model(response);
  }

  async create(data: Partial<M>): Promise<InstanceType<M>> {
    const response = await this.model.$http(this.model.baseURL, {
      method: "POST",
      body: data,
    });
    return new this.model(response);
  }

  async update(
    id: string | number,
    data: Partial<M>
  ): Promise<InstanceType<M>> {
    const response = await this.model.$http(`${this.model.baseURL}/${id}`, {
      method: "PUT",
      body: data,
    });
    return new this.model(response);
  }

  async delete(id: string | number): Promise<void> {
    await this.model.$http(`${this.model.baseURL}/${id}`, {
      method: "DELETE",
    });
  }

  protected getQueryParams(): Record<string, any> {
    const params: Record<string, any> = {};

    if (this.wheres.length) params.where = JSON.stringify(this.wheres);
    if (this.includes.length) params.include = this.includes.join(",");
    if (this.sorts.length) params.sort = this.sorts.join(",");
    if (this.limitValue !== null) params.limit = this.limitValue;
    if (this.pageValue !== null) params.page = this.pageValue;

    return params;
  }
}
