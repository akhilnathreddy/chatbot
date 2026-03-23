export interface UserProfile {
  userId: string;
  name?: string;
  preferences: string[];
  pastTopics: string[];
  createdAt: Date;
  updatedAt: Date;
}

// In-memory store — replace with DB in production
const users = new Map<string, UserProfile>();

export const userStore = {
  get(userId: string): UserProfile | undefined {
    return users.get(userId);
  },

  upsert(userId: string, data: Partial<UserProfile>): UserProfile {
    const existing = users.get(userId);
    const now = new Date();

    const updated: UserProfile = {
      userId,
      name: data.name ?? existing?.name,
      preferences: data.preferences ?? existing?.preferences ?? [],
      pastTopics: data.pastTopics ?? existing?.pastTopics ?? [],
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    users.set(userId, updated);
    return updated;
  },

  addTopic(userId: string, topic: string) {
    const user = this.get(userId) || this.upsert(userId, {});
    if (!user.pastTopics.includes(topic)) {
      user.pastTopics = [...user.pastTopics.slice(-19), topic]; // keep last 20
      users.set(userId, { ...user, updatedAt: new Date() });
    }
  },
};
