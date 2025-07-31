import { z } from 'zod'

export const emailSchema = z.string().email('Invalid email address')

export const passwordSchema = z
  .string()
  .min(6, 'Password must be at least 6 characters')
  .max(100, 'Password must be less than 100 characters')

export const authSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export const ideaSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  tags: z.array(z.string()).max(5, 'Maximum 5 tags allowed').optional(),
})

export const initiativeSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  impact: z.number().min(1).max(5),
  effort: z.number().min(1).max(5),
  status: z.enum(['backlog', 'active', 'completed', 'archived']).optional(),
})

export const promoteIdeaSchema = z.object({
  ideaId: z.string().uuid(),
  impact: z.number().min(1).max(5),
  effort: z.number().min(1).max(5),
})

export const visionDocumentSchema = z.object({
  mission: z.string(),
  values: z.array(z.string()),
  goals: z.array(z.string()),
  toolStack: z.array(z.string()),
})

export const logEntryContentSchema = z.object({
  achievements: z.array(z.string()),
  blockers: z.array(z.string()),
  learnings: z.array(z.string()),
  tomorrowFocus: z.string(),
})