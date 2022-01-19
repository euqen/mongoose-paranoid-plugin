import { Schema } from "mongoose";

declare module "mongoose-paranoid-plugin";

export type ParanoidPluginOptions = {
  paranoid?: boolean;
  field?: string
};

export default function MongooseParanoidPlugin(
  schema: Schema,
  options: ParanoidPluginOptions
): void;
