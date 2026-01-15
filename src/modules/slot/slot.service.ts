// slot.service.ts
import dayjs from "dayjs";
import Appointment from "./../appointment/appointment.model";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrBefore);

interface Slot {
  start: string;
  end: string;
  disabled: boolean;
}

export const generateSlots = async (
  date: string,
  type: "ONLINE" | "OFFLINE",
  startTime: string,
  endTime: string,
  duration: number
): Promise<Slot[]> => {
  const slots: Slot[] = [];
  let current = dayjs(`${date} ${startTime}`);
  const end = dayjs(`${date} ${endTime}`);
  const now = dayjs();

  const bookedSlots = await Appointment.find({
    date,
    type,
    status: "BOOKED",
  });

  while (current.add(duration, "minute").isSameOrBefore(end)) {
    const slotStart = current.format("HH:mm");
    const slotEnd = current.add(duration, "minute").format("HH:mm");

    let disabled = false;

    // past time check
    if (dayjs(`${date} ${slotStart}`).isBefore(now)) {
      disabled = true;
    }

    // booking overlap check
    const isBooked = bookedSlots.some(
      (b) => b.startTime === slotStart
    );

    if (isBooked) disabled = true;

    slots.push({
      start: slotStart,
      end: slotEnd,
      disabled,
    });

    current = current.add(duration, "minute");
  }

  return slots;
};
