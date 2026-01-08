export enum Currency {
  TWD = 'TWD',
  USD = 'USD',
  JPY = 'JPY',
  EUR = 'EUR'
}

export interface SalaryInputs {
  hourlyRate: number;
  workHours: number;
}

export interface SalaryBreakdown {
  total: number;
}

export interface DailyRecord {
  hourlyRate: number;
  workHours: number;
  total: number;
}

export type RecordMap = { [date: string]: DailyRecord };
