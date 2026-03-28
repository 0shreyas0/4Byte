// This is a template for Database CRUD operations.
// You can adapt this to Prisma, Supabase, or any other DB tool.

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
}

export const dbUser = {
  async create(data: Partial<User>) {
    console.log('DB: Creating user', data);
    // await prisma.user.create({ data })
    return { id: 'mock-id', ...data, createdAt: new Date() } as User;
  },

  async get(id: string) {
    console.log('DB: Getting user', id);
    // await prisma.user.findUnique({ where: { id } })
    return { id, email: 'mock@example.com', createdAt: new Date() } as User;
  },

  async update(id: string, data: Partial<User>) {
    console.log('DB: Updating user', id, data);
    // await prisma.user.update({ where: { id }, data })
    return { id, ...data } as Partial<User>;
  },

  async delete(id: string) {
    console.log('DB: Deleting user', id);
    // await prisma.user.delete({ where: { id } })
    return { success: true };
  }
};
