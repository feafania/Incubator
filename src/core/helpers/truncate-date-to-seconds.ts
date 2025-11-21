export function truncateDateToSeconds(date: Date = new Date()): Date {
  return new Date(Math.floor(date.getTime() / 1000) * 1000);
}
