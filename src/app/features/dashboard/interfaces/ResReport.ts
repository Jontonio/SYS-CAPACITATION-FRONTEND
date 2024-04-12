
interface ResReport {
  name: string;
  value: number;
}

interface ResReportSeries{
  name: string;
  series:ResReport[]
}

export { ResReport, ResReportSeries }