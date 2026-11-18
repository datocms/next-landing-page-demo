/** Whether the request carries `Authorization: Bearer <secret>`, as try.datocms.com configures every plugin */
export function hasBearerToken(request: Request, secret: string | undefined) {
  const token = request.headers.get('authorization')?.replace(/^Bearer /, '');
  return Boolean(token) && token === secret;
}

/** Adds the CORS headers the DatoCMS plugins need: they call these routes from the dashboard, another origin */
export function withCORS(init?: ResponseInit): ResponseInit {
  return {
    ...init,
    headers: {
      ...init?.headers,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  };
}
