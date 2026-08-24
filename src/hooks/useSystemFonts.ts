import { useEffect, useState } from "react";

export const STANDARD_FONTS: string[] = [
  "Arial",
  "Arial Black",
  "Bahnschrift",
  "Calibri",
  "Cambria",
  "Candara",
  "Comic Sans MS",
  "Consolas",
  "Constantia",
  "Corbel",
  "Courier New",
  "Franklin Gothic Medium",
  "Gabriola",
  "Georgia",
  "Helvetica",
  "Helvetica Neue",
  "Impact",
  "Inter",
  "Lucida Console",
  "Lucida Sans Unicode",
  "Palatino Linotype",
  "Roboto",
  "Segoe UI",
  "SF Pro",
  "SF Pro Display",
  "SF Pro Text",
  "Tahoma",
  "Times New Roman",
  "Trebuchet MS",
  "Verdana",
];

let cachedFonts: string[] | null = null;

export function useSystemFonts(): string[] {
  const [fonts, setFonts] = useState<string[]>(cachedFonts || STANDARD_FONTS);

  useEffect(() => {
    if (cachedFonts) {
      setFonts(cachedFonts);
      return;
    }

    let isMounted = true;

    async function loadFonts() {
      try {
        if ("queryLocalFonts" in window) {
          const localFonts = await (window as unknown as { queryLocalFonts: () => Promise<Array<{ family?: string }>> }).queryLocalFonts();
          const families = new Set<string>();
          for (const font of localFonts) {
            if (font.family) {
              families.add(font.family);
            }
          }
          for (const std of STANDARD_FONTS) {
            families.add(std);
          }
          const sorted = Array.from(families).sort((a, b) =>
            a.localeCompare(b, undefined, { sensitivity: "base" })
          );
          cachedFonts = sorted;
          if (isMounted) {
            setFonts(sorted);
          }
          return;
        }
      } catch {
        // queryLocalFonts permission denied or unavailable
      }

      cachedFonts = STANDARD_FONTS;
      if (isMounted) {
        setFonts(STANDARD_FONTS);
      }
    }

    loadFonts();

    return () => {
      isMounted = false;
    };
  }, []);

  return fonts;
}
