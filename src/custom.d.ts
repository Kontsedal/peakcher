declare module "*.scss" {
  const classes: { [key: string]: string };
  export default classes;
}

declare const IS_DEV: boolean;
