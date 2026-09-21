export type User = {
  id: string;
  email: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  passwordHash: string;
  createdAt: string;
};

export type Follow = {
  followerId: string;
  followingId: string;
};

export type PostType = "text" | "image" | "video";

export type Post = {
  id: string;
  authorId: string;
  type: PostType;
  body: string;
  mediaUrl: string;
  createdAt: string;
};

export type DB = {
  users: User[];
  follows: Follow[];
  posts: Post[];
};

export type PublicUser = Omit<User, "passwordHash" | "email"> & { email?: string };
