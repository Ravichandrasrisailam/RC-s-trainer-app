export function authErrorMessage(error, action) {
  const message = typeof error?.message === "string" ? error.message.trim() : "";
  if (message && message !== "{}" && message !== "[object Object]") return message;

  const details = [];
  if (typeof error?.code === "string" && error.code.trim()) details.push(error.code.trim());
  if (Number.isInteger(error?.status)) details.push(`HTTP ${error.status}`);

  const reason = details.length ? ` (${details.join(", ")})` : "";
  return `Could not ${action}${reason}. Try again, or use Forgot password if you may already have an account.`;
}
