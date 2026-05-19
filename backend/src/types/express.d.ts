// Override Express 5 params type for simpler usage
import 'express';

declare module 'express' {
  interface ParamsDictionary {
    [key: string]: string;
  }

  interface Request {
    params: ParamsDictionary;
  }
}
