import { defineNuxtPlugin } from "#app";
import { Model } from "./Model";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const $api = $fetch.create({
    baseURL: config.public.apiURL,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  Model.$http = $api;

  return {
    provide: {
      api: $api,
    },
  };
});
