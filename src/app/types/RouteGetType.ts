interface IQuerystring {
  username: string;
  password: string;
}

interface IHeaders {
  'h-Custom': string;
}

export type RouteGetType = {
  Querystring: IQuerystring,
  Headers: IHeaders
}
