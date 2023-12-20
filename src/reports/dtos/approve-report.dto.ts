import { IsBoolean } from 'class-validator';

export class ApproveReportDto {
  @IsBoolean() // Means what is want to share with
  approved: boolean;
}
