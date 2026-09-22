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

export type PostType = "text" | "image" | "video" | "blog";

export type Comment = {
  id: string;
  authorId: string;
  text: string;
  createdAt: string;
  author?: PublicUser;
};

export type Post = {
  id: string;
  authorId: string;
  type: PostType;
  title?: string;
  body: string;
  mediaUrl: string;
  likes: string[]; // Array of User IDs
  comments: Comment[];
  sharesCount: number;
  createdAt: string;
  author?: PublicUser;
};

export type DB = {
  users: User[];
  follows: Follow[];
  posts: Post[];
};

export type PublicUser = Omit<User, "passwordHash" | "email"> & { email?: string };
