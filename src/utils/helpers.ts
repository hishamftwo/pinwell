import { Colors } from '../constants/theme';

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

export function ymd(d: Date): string {
  return (
    d.getFullYear() +
    '-' +
    String(d.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(d.getDate()).padStart(2, '0')
  );
}

export function addDays(d: Date, n: number): Date {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
}

export function fmtShort(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function fmtLong(d: Date): string {
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export function getDoseColor(doseStr: string): { bg: string; fg: string } {
  const v = parseFloat(doseStr);
  if (v <= 2.5) return { bg: Colors.tealLight, fg: Colors.teal };
  if (v <= 5) return { bg: Colors.blueLight, fg: Colors.blue };
  if (v <= 7.5) return { bg: Colors.violetLight, fg: Colors.violet };
  if (v <= 10) return { bg: Colors.pinkLight, fg: Colors.pink };
  if (v <= 12.5) return { bg: Colors.coralLight, fg: Colors.coral };
  return { bg: Colors.amberLight, fg: Colors.amber };
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}
