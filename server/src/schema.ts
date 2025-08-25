import { z } from 'zod';

// User profile schema
export const userProfileSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
  age: z.number().int().min(18).max(100),
  bio: z.string().nullable(),
  location: z.string(),
  budget_min: z.number().positive(),
  budget_max: z.number().positive(),
  preferred_gender: z.enum(['male', 'female', 'any']).nullable(),
  lifestyle_preferences: z.string().nullable(), // JSON string for preferences like smoking, pets, etc.
  profile_image_url: z.string().url().nullable(),
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type UserProfile = z.infer<typeof userProfileSchema>;

// Input schema for creating user profiles
export const createUserProfileInputSchema = z.object({
  email: z.string().email(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  age: z.number().int().min(18).max(100),
  bio: z.string().nullable(),
  location: z.string().min(1),
  budget_min: z.number().positive(),
  budget_max: z.number().positive(),
  preferred_gender: z.enum(['male', 'female', 'any']).nullable(),
  lifestyle_preferences: z.string().nullable(),
  profile_image_url: z.string().url().nullable()
}).refine(data => data.budget_max >= data.budget_min, {
  message: "Budget max must be greater than or equal to budget min",
  path: ["budget_max"]
});

export type CreateUserProfileInput = z.infer<typeof createUserProfileInputSchema>;

// Input schema for updating user profiles
export const updateUserProfileInputSchema = z.object({
  id: z.number(),
  first_name: z.string().min(1).optional(),
  last_name: z.string().min(1).optional(),
  age: z.number().int().min(18).max(100).optional(),
  bio: z.string().nullable().optional(),
  location: z.string().min(1).optional(),
  budget_min: z.number().positive().optional(),
  budget_max: z.number().positive().optional(),
  preferred_gender: z.enum(['male', 'female', 'any']).nullable().optional(),
  lifestyle_preferences: z.string().nullable().optional(),
  profile_image_url: z.string().url().nullable().optional(),
  is_active: z.boolean().optional()
});

export type UpdateUserProfileInput = z.infer<typeof updateUserProfileInputSchema>;

// Interest status enum
export const interestStatusSchema = z.enum(['pending', 'accepted', 'rejected']);
export type InterestStatus = z.infer<typeof interestStatusSchema>;

// Interest schema (when someone expresses interest in another user)
export const interestSchema = z.object({
  id: z.number(),
  requester_id: z.number(),
  target_id: z.number(),
  status: interestStatusSchema,
  message: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Interest = z.infer<typeof interestSchema>;

// Input schema for creating interests
export const createInterestInputSchema = z.object({
  requester_id: z.number(),
  target_id: z.number(),
  message: z.string().nullable()
}).refine(data => data.requester_id !== data.target_id, {
  message: "Cannot express interest in yourself",
  path: ["target_id"]
});

export type CreateInterestInput = z.infer<typeof createInterestInputSchema>;

// Input schema for responding to interests
export const respondToInterestInputSchema = z.object({
  interest_id: z.number(),
  status: z.enum(['accepted', 'rejected'])
});

export type RespondToInterestInput = z.infer<typeof respondToInterestInputSchema>;

// Match schema (when there's mutual interest)
export const matchSchema = z.object({
  id: z.number(),
  user1_id: z.number(),
  user2_id: z.number(),
  created_at: z.coerce.date()
});

export type Match = z.infer<typeof matchSchema>;

// Browse profiles input schema with filters
export const browseProfilesInputSchema = z.object({
  location: z.string().optional(),
  min_age: z.number().int().min(18).optional(),
  max_age: z.number().int().max(100).optional(),
  budget_min: z.number().positive().optional(),
  budget_max: z.number().positive().optional(),
  preferred_gender: z.enum(['male', 'female', 'any']).optional(),
  exclude_user_id: z.number().optional(), // To exclude current user from results
  limit: z.number().int().positive().max(50).default(20),
  offset: z.number().int().nonnegative().default(0)
});

export type BrowseProfilesInput = z.infer<typeof browseProfilesInputSchema>;

// Get user profile by ID input
export const getUserProfileInputSchema = z.object({
  id: z.number()
});

export type GetUserProfileInput = z.infer<typeof getUserProfileInputSchema>;

// Get interests input schema
export const getInterestsInputSchema = z.object({
  user_id: z.number(),
  type: z.enum(['sent', 'received']).optional() // Filter by sent or received interests
});

export type GetInterestsInput = z.infer<typeof getInterestsInputSchema>;

// Get matches input schema
export const getMatchesInputSchema = z.object({
  user_id: z.number()
});

export type GetMatchesInput = z.infer<typeof getMatchesInputSchema>;