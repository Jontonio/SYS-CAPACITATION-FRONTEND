
interface ResReport {
  name: string;
  value: number;
  percentage?: string;
}

interface ResReportSeries{
  name: string;
  series:ResReport[]
}

export { ResReport, ResReportSeries }