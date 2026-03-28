const firstNames = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'enterprise.io'];

export const generateMockUser = () => {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return {
    id: Math.random().toString(36).substring(2, 11),
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domains[Math.floor(Math.random() * domains.length)]}`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}`,
    role: Math.random() > 0.8 ? 'admin' : 'user',
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString(),
  };
};

export const generateMockUsers = (count: number = 10) => {
  return Array.from({ length: count }, generateMockUser);
};

// If run directly
if (require.main === module) {
  const users = generateMockUsers(5);
  console.log(JSON.stringify(users, null, 2));
}
