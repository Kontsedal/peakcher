declare module "*.scss" {
  const classes: { [key: string]: string };
  export default classes;
}

declare const IS_DEV: boolean;
declare module "*.png";
declare module "*.jpeg";
declare module "*.webp";
declare module "*.svg";
