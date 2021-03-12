export class TableData {
  year: string;
  values: any[] = [];

  constructor(year: string, values: any[]) {
    this.year = year;
    this.values = values;
  }
}
