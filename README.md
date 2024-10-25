# nuxt-api-query

A powerful and flexible API query builder for Nuxt 3 applications, inspired by Laravel's Eloquent ORM.

## Features

- Fluent interface for building API queries
- Support for common CRUD operations
- Easy integration with Nuxt 3 projects
- TypeScript support
- Customizable base URL and HTTP client

## Installation

1. Install the package in your Nuxt 3 project:

```bash
npm install nuxt-api-query
```

or

```bash
yarn add nuxt-api-query
```

2. Add `nuxt-api-query` to the `modules` section of your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ["nuxt-api-query"],
  apiQuery: {
    // Optional configuration
  },
});
```

3. add api plugin to your project

```ts
// [your-project]/plugins/api.ts
export default defineNuxtPlugin(() => {
  const requestHeaders: HeadersInit = new Headers();
  requestHeaders.set("Content-Type", "application/json");

  const VALIDATION_ERROR_STATUS = new Set([403, 422, 500]);

  const $api = $fetch.create({
    baseURL: useRuntimeConfig().public.apiURL,
    headers: {
      Accept: "application/json",
    },
    onRequest({ request, options, error }) {
      const config = useRuntimeConfig();
      const cookieName = config.public?.app?.cookieName || "accessToken";
      const accessToken = useCookie(cookieName);
      if (accessToken.value) {
        options.headers = new Headers(options.headers || {});
        options.headers.set("Authorization", `Bearer ${accessToken.value}`);
      }
    },
    async onResponseError({ response }) {
      let { message, error, errors, http_status } = response._data;

      if (VALIDATION_ERROR_STATUS.has(http_status)) {
        throw createError({
          message,
          statusCode: http_status,
          statusMessage: error,
          data: errors,
        });
      }
    },
  });

  return {
    provide: {
      api: $api,
    },
  };
});
```

# Usage

### Defining Models

Create a model for each of your API resources by extending the `Model` class:

```ts
// models/Users.ts;
import { Model } from "nuxt-api-query";
export class User extends Model {
  static baseURL = "/api/users";
  id!: number;
  name!: string;
  email!: string;
}
```

### Basic CRUD Operations

```ts
// Fetch all users
const users = await User.$all();

// Find a specific user
const user = await User.$find(1);

// Create a new user
const newUser = new User({ name: "John Doe", email: "john@example.com" });
await newUser.$save();

// Update a user
user.name = "Jane Doe";
await user.$save();

// Delete a user
await user.$delete();
```

### Query Building

```ts
// Fetch active users, ordered by creation date
const activeUsers = await User.query()
  .where("active", true)
  .orderBy("created_at", "desc")
  .get();

// Paginate results
const paginatedUsers = await User.query().page(1).limit(10).get();

// Include related data
const usersWithPosts = await User.query().with("posts").get();
```
