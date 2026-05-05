export const formatTime = (minutes: number, short: boolean = false) => {
  if (minutes < 60) return `${minutes}${!short ? " min" : "'"}`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) return `${hours}h`;

  const paddedMinutes = remainingMinutes.toString().padStart(2, "0");
  return `${hours}h${paddedMinutes}`;
};
