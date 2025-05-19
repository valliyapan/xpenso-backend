import { DateTime } from 'luxon';

export function convertToExpenseDate(date) {
  if (!date) return false;

  // Convert to DateTime object in Asia/Kolkata timezone
  const dateTime = DateTime.fromJSDate(date, { zone: 'asia/kolkata' });
  return dateTime.toFormat('yyyy-MM-dd'); // Format to 'yyyy-MM-dd'
}