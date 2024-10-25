import { defineNuxtModule, addPlugin, createResolver } from "@nuxt/kit";

export interface ModuleOptions {
  // Define your module options here
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "nuxt-api-query",
    configKey: "apiQuery",
  },
  defaults: {},
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);

    // Add plugin
    addPlugin(resolver.resolve("./runtime/plugin"));

    // Add runtime config
    nuxt.options.runtimeConfig.public.apiQuery = {
      ...nuxt.options.runtimeConfig.public.apiQuery,
      ...options,
    };
  },
});
