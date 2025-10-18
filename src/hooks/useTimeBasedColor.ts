import { useEffect, useState } from "react";
import { TimeBasedColor } from "../db/state";

// Convert time string "HH:mm" to minutes since midnight
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

// Interpolate between two colors
function interpolateColor(color1: string, color2: string, factor: number): string {
  // Parse hex colors
  const c1 = parseInt(color1.slice(1), 16);
  const c2 = parseInt(color2.slice(1), 16);

  const r1 = (c1 >> 16) & 0xff;
  const g1 = (c1 >> 8) & 0xff;
  const b1 = c1 & 0xff;

  const r2 = (c2 >> 16) & 0xff;
  const g2 = (c2 >> 8) & 0xff;
  const b2 = c2 & 0xff;

  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// Calculate the current color based on time
function calculateColor(timeBasedColors: TimeBasedColor[], currentTime: Date): string {
  if (!timeBasedColors || timeBasedColors.length === 0) {
    return "#ffffff";
  }

  if (timeBasedColors.length === 1) {
    return timeBasedColors[0].color;
  }

  // Sort colors by time
  const sortedColors = [...timeBasedColors].sort((a, b) => 
    timeToMinutes(a.time) - timeToMinutes(b.time)
  );

  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

  // Find the two colors to interpolate between
  let beforeIndex = 0;
  let afterIndex = 0;

  for (let i = 0; i < sortedColors.length; i++) {
    const colorMinutes = timeToMinutes(sortedColors[i].time);
    if (colorMinutes <= currentMinutes) {
      beforeIndex = i;
    }
    if (colorMinutes > currentMinutes && afterIndex === 0) {
      afterIndex = i;
      break;
    }
  }

  // If we didn't find an after color, wrap around to the first color
  if (afterIndex === 0) {
    afterIndex = 0;
  }

  const beforeColor = sortedColors[beforeIndex];
  const afterColor = sortedColors[afterIndex];

  // If before and after are the same, return that color
  if (beforeIndex === afterIndex) {
    return beforeColor.color;
  }

  const beforeMinutes = timeToMinutes(beforeColor.time);
  let afterMinutes = timeToMinutes(afterColor.time);

  // Handle wrap-around (e.g., from 23:00 to 01:00)
  if (afterMinutes < beforeMinutes) {
    afterMinutes += 24 * 60;
  }

  let adjustedCurrentMinutes = currentMinutes;
  if (currentMinutes < beforeMinutes) {
    adjustedCurrentMinutes += 24 * 60;
  }

  const totalDuration = afterMinutes - beforeMinutes;
  const elapsed = adjustedCurrentMinutes - beforeMinutes;
  const factor = elapsed / totalDuration;

  return interpolateColor(beforeColor.color, afterColor.color, factor);
}

export function useTimeBasedColor(
  timeBasedColors?: TimeBasedColor[],
  useTimeBasedColors?: boolean
): string | undefined {
  const [color, setColor] = useState<string | undefined>();

  useEffect(() => {
    if (!useTimeBasedColors || !timeBasedColors || timeBasedColors.length === 0) {
      setColor(undefined);
      return;
    }

    const updateColor = () => {
      const newColor = calculateColor(timeBasedColors, new Date());
      setColor(newColor);
    };

    // Update immediately
    updateColor();

    // Update every minute
    const interval = setInterval(updateColor, 60000);

    return () => clearInterval(interval);
  }, [timeBasedColors, useTimeBasedColors]);

  return color;
}
