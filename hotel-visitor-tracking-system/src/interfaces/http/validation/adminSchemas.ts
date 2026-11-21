import { z } from 'zod';
import { REPORT_PERIODS } from '../../../domain/value-objects/ReportPeriod.js';

export const loginSchema = z.object({
  username: z.string().min(1).max(100),
  password: z.string().min(1).max(200),
});

export const analyticsQuerySchema = z.object({
  period: z.enum(REPORT_PERIODS).default('7d'),
});
