
export type TRequestUser = {
    _id: string; // MongoDB ObjectId as a string
    googleId: string; // Google OAuth ID
    email: string; // User's email address
    name: string; // User's display name
    createdAt: string; // ISO 8601 formatted timestamp
    __v: number; // Version key (used by Mongoose)
    accessToken: string; // Access token string
    updatedAt: string; // ISO 8601 formatted timestamp
    lastLogin: string; // ISO 8601 formatted timestamp
  };
  