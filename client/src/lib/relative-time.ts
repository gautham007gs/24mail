interface FormatOptions {
  addSuffix?: boolean;
}

const DIVISIONS: { amount: number; name: Intl.RelativeTimeFormatUnit }[] = [
  { amount: 60, name: "seconds" },
  { amount: 60, name: "minutes" },
  { amount: 24, name: "hours" },
  { amount: 7, name: "days" },
  { amount: 4.34524, name: "weeks" },
  { amount: 12, name: "months" },
  { amount: Number.POSITIVE_INFINITY, name: "years" },
];

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
const rtfNumeric = new Intl.RelativeTimeFormat("en", { numeric: "always" });

export function formatDistanceToNow(date: Date | number, options?: FormatOptions): string {
  const timestamp = typeof date === "number" ? date : date.getTime();
  let duration = (timestamp - Date.now()) / 1000;
  const addSuffix = options?.addSuffix ?? true;
  
  const formatter = addSuffix ? rtf : rtfNumeric;

  for (let i = 0; i < DIVISIONS.length; i++) {
    const division = DIVISIONS[i];
    if (Math.abs(duration) < division.amount) {
      const result = formatter.format(Math.round(duration), division.name);
      if (!addSuffix) {
        return result.replace(/ ago$/, '').replace(/^in /, '');
      }
      return result;
    }
    duration /= division.amount;
  }
  
  const result = formatter.format(Math.round(duration), "years");
  if (!addSuffix) {
    return result.replace(/ ago$/, '').replace(/^in /, '');
  }
  return result;
}

export function formatTimeAgo(date: Date | number): string {
  return formatDistanceToNow(date, { addSuffix: true });
}