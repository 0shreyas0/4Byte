import { z } from 'zod';

// User Schema Template
export const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(['admin', 'user']).default('user'),
});

// Post/Article Schema Template
export const postSchema = z.object({
  title: z.string().min(5, "Title too short"),
  content: z.string().min(20, "Content too short"),
  tags: z.array(z.string()).optional(),
  published: z.boolean().default(false),
});

export type UserFormData = z.infer<typeof userSchema>;
export type PostFormData = z.infer<typeof postSchema>;

/**
 * Validates data against a schema and returns formatted errors
 */
export const validateData = <T>(schema: z.ZodSchema<T>, data: any) => {
  const result = schema.safeParse(data);
  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }
  return {
    success: true,
    data: result.data,
  };
};
