declare module "react-calendar-heatmap" {
  import { Component } from "react";
  interface Props {
    values: any[];
    startDate?: Date;
    endDate?: Date;
    gutterSize?: number;
    showWeekdayLabels?: boolean;
    classForValue?: (value: any) => string;
    onMouseOver?: (event: any, value: any) => void;
    onMouseLeave?: (event: any, value: any) => void;
    [key: string]: any;
  }
  export default class CalendarHeatmap extends Component<Props> {}
}
