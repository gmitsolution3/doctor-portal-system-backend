import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export function normalizeTo24Hour(time: string): string {
  const parsed = dayjs(
    time.trim(),
    ["H", "H:mm", "HH:mm", "h A", "h:mm A"],
    true
  );

  if (!parsed.isValid()) {
    throw new Error(`Invalid time format: ${time}`);
  }

  return parsed.format("HH:mm");
}
