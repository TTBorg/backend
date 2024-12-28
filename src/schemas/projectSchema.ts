
import { z } from 'zod';

export const createProjectSchema = z.object({
    title: z.string(),
    created_by: z.string(),
    pm_id: z.string()
});

export const reassignProject = z.object({
    pm_id: z.string()
})

export const projectDetailsSchema = z.object({
    project_id: z.string(),
    project_description: z.string(),
    project_country: z.string(),
    project_state: z.string(),
    project_city: z.string(),
    project_client: z.string(),

});

export const sendInviteSchema = z.object({
    contractors: z.array(z.object({ email: z.string().email(), role: z.string() })),
    consultants: z.array(z.object({ email: z.string().email(), role: z.string() })),
    owners: z.array(z.object({ email: z.string().email()})),
})