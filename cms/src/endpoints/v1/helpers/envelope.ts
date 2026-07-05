// Standard JSON response envelope helpers (v1 mobile API).

export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "RATE_LIMITED"
  | "SERVER_ERROR"

const STATUS_BY_CODE: Record<ApiErrorCode, number> = {
  VALIDATION_ERROR: 400,
  NOT_FOUND: 404,
  RATE_LIMITED: 429,
  SERVER_ERROR: 500,
}

const JSON_HEADERS = { "Content-Type": "application/json; charset=utf-8" }

export function ok<T>(
  data: T,
  init?: { status?: number; meta?: Record<string, unknown>; headers?: Record<string, string> },
): Response {
  const body: Record<string, unknown> = { data }
  if (init?.meta) body.meta = init.meta
  return new Response(JSON.stringify(body), {
    status: init?.status ?? 200,
    headers: { ...JSON_HEADERS, ...(init?.headers ?? {}) },
  })
}

export function fail(
  code: ApiErrorCode,
  message: string,
  opts?: { fields?: Record<string, string>; headers?: Record<string, string>; status?: number },
): Response {
  const body: Record<string, unknown> = { error: { code, message } }
  if (opts?.fields) (body.error as Record<string, unknown>).fields = opts.fields
  return new Response(JSON.stringify(body), {
    status: opts?.status ?? STATUS_BY_CODE[code],
    headers: { ...JSON_HEADERS, ...(opts?.headers ?? {}) },
  })
}

export const cacheableHeaders = {
  "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
}
