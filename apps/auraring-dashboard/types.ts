export interface Metric {
  label: string;
  value: string | number;
  unit?: string;
}

export interface ChartDataPoint {
  time: string;
  value: number;
}

export interface User {
  name: string;
  avatar: string;
}
