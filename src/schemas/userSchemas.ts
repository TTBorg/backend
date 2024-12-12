import { z } from 'zod';

export const adminLoginSchema = z.object({
    email: z.string(),
    password: z.string().min(8)
});

export const adminRegSchema = z.object({
    email: z.string(),
    password: z.string().min(8),
    fname: z.string(),
    lname: z.string(),
    company_name: z.string(),
    alt_email: z.string(),
    phone: z.string(),
    address: z.string(),
    country: z.string(),
    state: z.string(),
    team_size: z.number(),
});