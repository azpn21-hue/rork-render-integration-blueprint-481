declare module "cors" {
  const cors: any;
  export default cors;
}

declare module "express" {
  const e: any;
  export default e;
  export type Request = any;
  export type Response = any;
  export type NextFunction = any;
}
