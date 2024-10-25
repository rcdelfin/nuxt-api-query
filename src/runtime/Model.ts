import { QueryBuilder } from "./QueryBuilder";

export class Model {
  protected static baseURL = "";
  protected static $http: any;

  protected $id: string | number | null = null;
  protected $attributes: Record<string, any> = {};
  protected $relations: Record<string, any> = {};

  constructor(attributes = {}) {
    this.$fill(attributes);
  }

  $fill(attributes: Record<string, any>): this {
    this.$attributes = { ...attributes };
    this.$id = this.$attributes[this.$primaryKey] ?? null;
    return this;
  }

  get $primaryKey(): string {
    return "id";
  }

  static query(): QueryBuilder<typeof this> {
    return new QueryBuilder(this);
  }

  static async $find(id: string | number): Promise<InstanceType<typeof this>> {
    const model = await this.query().find(id);
    return new this(model);
  }

  static $all(): Promise<InstanceType<typeof this>[]> {
    return this.query().get();
  }

  async $save(): Promise<this> {
    return this.$id !== null ? this.$update() : this.$create();
  }

  async $create(): Promise<this> {
    const model = await (this.constructor as typeof Model)
      .query()
      .create(this.$attributes);
    return this.$fill(model);
  }

  async $update(): Promise<this> {
    const model = await (this.constructor as typeof Model)
      .query()
      .update(this.$id!, this.$attributes);
    return this.$fill(model);
  }

  $delete(): Promise<void> {
    return (this.constructor as typeof Model).query().delete(this.$id!);
  }
}
