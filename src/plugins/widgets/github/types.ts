import { API } from "../../types";

type Data = {
  username?: string;
  showColorLegend: boolean;
  showMonthLabels: boolean;
  showTotalCount: boolean;
  clickAction: "none" | "github" | "profile";
  forceDarkMode: boolean;
};

export type Props = API<Data>;

export const defaultData: Data = {
  username: "",
  showColorLegend: false,
  showMonthLabels: false,
  showTotalCount: false,
  clickAction: "none",
  forceDarkMode: false,
};
