import { z } from "zod";
import { UserSchema } from "../zod-schemas/user";

export type TUser = z.infer<typeof UserSchema>;