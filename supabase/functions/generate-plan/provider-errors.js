export function isProviderTimeout(error) {
  return typeof error === "object" && error !== null
    && "name" in error && error.name === "TimeoutError";
}
