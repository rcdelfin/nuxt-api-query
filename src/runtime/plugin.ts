import { defineNuxtPlugin } from "#imports";
import { Model } from "./Model";

export default defineNuxtPlugin((nuxtApp) => {
  const { $api } = nuxtApp;

  Model.request = $api;
});
