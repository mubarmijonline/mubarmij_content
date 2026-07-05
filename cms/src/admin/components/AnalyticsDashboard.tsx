import { getPayload } from 'payload'
import config from '../../payload.config'

type Row = { _id: unknown; total?: number; uniques?: number; count?: number }

type SessionRow = {
  _id: string
  visitorId: string
  pageviews: number
  uniquePaths: number
  paths: string[]
  entryPath: string
  exitPath: string
  country?: string
  locale?: string
  referrer?: string
  start: Date
  end: Date
  durationSec: number
}

type VisitorRow = {
  _id: string
  pageviews: number
  sessions: number
  topPaths: { path: string; count: number }[]
  firstSeen: Date
  lastSeen: Date
  country?: string
}

type DayVisitor = {
  visitorId: string
  pageviews: number
  paths: { path: string; count: number }[]
  country?: string
  locale?: string
}

type DayBreakdown = {
  day: string
  pageviews: number
  uniqueVisitors: number
  sessions: number
  visitors: DayVisitor[]
}

function startOfDayUtc(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
}

function daysAgo(n: number): Date {
  const d = startOfDayUtc(new Date())
  d.setUTCDate(d.getUTCDate() - n)
  return d
}

function formatDuration(sec: number): string {
  if (!sec || sec < 1) return '<1s'
  if (sec < 60) return `${Math.round(sec)}s`
  const m = Math.floor(sec / 60)
  const s = Math.round(sec % 60)
  if (m < 60) return s ? `${m}m ${s}s` : `${m}m`
  const h = Math.floor(m / 60)
  return `${h}h ${m % 60}m`
}

function formatDateTime(d: Date): string {
  try {
    return new Date(d).toISOString().replace('T', ' ').replace(/\.\d+Z$/, 'Z')
  } catch {
    return String(d)
  }
}

function shortId(s: string): string {
  if (!s) return '∅'
  return s.length > 10 ? `${s.slice(0, 6)}…${s.slice(-3)}` : s
}

async function fetchStats() {
  const payload = await getPayload({ config })
  // Payload's mongoose adapter exposes models on `db.collections`.
  // Mongoose `Model.aggregate(pipeline)` returns a thenable Aggregate (NOT a cursor),
  // so we await it directly instead of calling `.toArray()`.
  const db = payload.db as unknown as {
    collections: Record<
      string,
      { aggregate: (pipeline: object[]) => Promise<Row[]> }
    >
  }
  const Coll = db.collections['analytics-events']
  if (!Coll) return null
  const agg = (pipeline: object[]): Promise<Row[]> =>
    Coll.aggregate(pipeline) as Promise<Row[]>

  const since30 = daysAgo(30)
  const since7 = daysAgo(7)
  const since1 = daysAgo(1)
  const since14 = daysAgo(14)

  const matchHumans = { isBot: { $ne: true } }

  const [
    total30Doc,
    total7Doc,
    total1Doc,
    unique30Doc,
    unique7Doc,
    unique1Doc,
    sessions30Doc,
    sessions7Doc,
    sessions1Doc,
    topPaths,
    daily,
    topReferrers,
    topLocales,
    recentSessionsRaw,
    topVisitorsRaw,
    uniqueAllTimeDoc,
    firstSeenDoc,
    dailyDetailedRaw,
  ] = await Promise.all([
    agg([
      { $match: { ...matchHumans, createdAt: { $gte: since30 } } },
      { $count: 'total' },
    ]),
    agg([
      { $match: { ...matchHumans, createdAt: { $gte: since7 } } },
      { $count: 'total' },
    ]),
    agg([
      { $match: { ...matchHumans, createdAt: { $gte: since1 } } },
      { $count: 'total' },
    ]),
    agg([
      { $match: { ...matchHumans, createdAt: { $gte: since30 } } },
      { $group: { _id: '$visitorId' } },
      { $count: 'uniques' },
    ]),
    agg([
      { $match: { ...matchHumans, createdAt: { $gte: since7 } } },
      { $group: { _id: '$visitorId' } },
      { $count: 'uniques' },
    ]),
    agg([
      { $match: { ...matchHumans, createdAt: { $gte: since1 } } },
      { $group: { _id: '$visitorId' } },
      { $count: 'uniques' },
    ]),
    agg([
      { $match: { ...matchHumans, createdAt: { $gte: since30 } } },
      { $group: { _id: '$sessionId' } },
      { $count: 'uniques' },
    ]),
    agg([
      { $match: { ...matchHumans, createdAt: { $gte: since7 } } },
      { $group: { _id: '$sessionId' } },
      { $count: 'uniques' },
    ]),
    agg([
      { $match: { ...matchHumans, createdAt: { $gte: since1 } } },
      { $group: { _id: '$sessionId' } },
      { $count: 'uniques' },
    ]),
    agg([
      { $match: { ...matchHumans, createdAt: { $gte: since30 } } },
      { $group: { _id: '$path', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
    agg([
      { $match: { ...matchHumans, createdAt: { $gte: since14 } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          total: { $sum: 1 },
          visitors: { $addToSet: '$visitorId' },
        },
      },
      { $project: { total: 1, uniques: { $size: '$visitors' } } },
      { $sort: { _id: 1 } },
    ]),
    agg([
      {
        $match: {
          ...matchHumans,
          createdAt: { $gte: since30 },
          referrer: { $nin: [null, ''] },
        },
      },
      { $group: { _id: '$referrer', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]),
    agg([
      { $match: { ...matchHumans, createdAt: { $gte: since30 } } },
      { $group: { _id: '$locale', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    // Recent sessions: group events by sessionId, compute span/paths
    agg([
      { $match: { ...matchHumans, createdAt: { $gte: since7 } } },
      { $sort: { createdAt: 1 } },
      {
        $group: {
          _id: '$sessionId',
          visitorId: { $first: '$visitorId' },
          pageviews: { $sum: 1 },
          paths: { $push: '$path' },
          start: { $min: '$createdAt' },
          end: { $max: '$createdAt' },
          country: { $first: '$country' },
          locale: { $first: '$locale' },
          referrer: { $first: '$referrer' },
          entryPath: { $first: '$path' },
          exitPath: { $last: '$path' },
        },
      },
      { $sort: { end: -1 } },
      { $limit: 25 },
    ]),
    // Top visitors: group by visitorId + path, then re-group by visitor
    agg([
      { $match: { ...matchHumans, createdAt: { $gte: since30 } } },
      {
        $group: {
          _id: { visitorId: '$visitorId', path: '$path' },
          count: { $sum: 1 },
          sessions: { $addToSet: '$sessionId' },
          firstSeen: { $min: '$createdAt' },
          lastSeen: { $max: '$createdAt' },
          country: { $first: '$country' },
        },
      },
      {
        $group: {
          _id: '$_id.visitorId',
          pageviews: { $sum: '$count' },
          sessionsArr: { $push: '$sessions' },
          firstSeen: { $min: '$firstSeen' },
          lastSeen: { $max: '$lastSeen' },
          country: { $first: '$country' },
          paths: { $push: { path: '$_id.path', count: '$count' } },
        },
      },
      { $sort: { pageviews: -1 } },
      { $limit: 15 },
    ]),
    // All-time unique visitor identifiers
    agg([
      { $match: matchHumans },
      { $group: { _id: '$visitorId' } },
      { $count: 'uniques' },
    ]),
    // First-ever event date — used to compute "avg unique / day" denominator
    agg([
      { $match: matchHumans },
      { $group: { _id: null, first: { $min: '$createdAt' } } },
    ]) as unknown as Promise<Array<{ first: string | Date }>>,
    // Day-by-day breakdown with per-visitor unique endpoints (last 30 days)
    agg([
      { $match: { ...matchHumans, createdAt: { $gte: since30 } } },
      {
        $group: {
          _id: {
            day: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            visitorId: '$visitorId',
            path: '$path',
          },
          count: { $sum: 1 },
          country: { $first: '$country' },
          locale: { $first: '$locale' },
          sessions: { $addToSet: '$sessionId' },
        },
      },
      {
        $group: {
          _id: { day: '$_id.day', visitorId: '$_id.visitorId' },
          pageviews: { $sum: '$count' },
          paths: { $push: { path: '$_id.path', count: '$count' } },
          country: { $first: '$country' },
          locale: { $first: '$locale' },
          sessions: { $push: '$sessions' },
        },
      },
      {
        $group: {
          _id: '$_id.day',
          pageviews: { $sum: '$pageviews' },
          uniqueVisitors: { $sum: 1 },
          visitors: {
            $push: {
              visitorId: '$_id.visitorId',
              pageviews: '$pageviews',
              paths: '$paths',
              country: '$country',
              locale: '$locale',
              sessions: '$sessions',
            },
          },
        },
      },
      { $sort: { _id: -1 } },
    ]),
  ])

  const recentSessions: SessionRow[] = (
    recentSessionsRaw as unknown as Array<{
      _id: string
      visitorId: string
      pageviews: number
      paths: string[]
      start: string | Date
      end: string | Date
      country?: string
      locale?: string
      referrer?: string
      entryPath: string
      exitPath: string
    }>
  ).map((s) => {
    const start = new Date(s.start)
    const end = new Date(s.end)
    const durationSec = Math.max(0, (end.getTime() - start.getTime()) / 1000)
    return {
      _id: s._id,
      visitorId: s.visitorId,
      pageviews: s.pageviews,
      uniquePaths: new Set(s.paths).size,
      paths: s.paths,
      entryPath: s.entryPath,
      exitPath: s.exitPath,
      country: s.country,
      locale: s.locale,
      referrer: s.referrer,
      start,
      end,
      durationSec,
    }
  })

  const topVisitors: VisitorRow[] = (
    topVisitorsRaw as unknown as Array<{
      _id: string
      pageviews: number
      sessionsArr: string[][]
      firstSeen: string | Date
      lastSeen: string | Date
      country?: string
      paths: { path: string; count: number }[]
    }>
  ).map((v) => {
    const sessionsSet = new Set<string>()
    for (const arr of v.sessionsArr || []) for (const s of arr) sessionsSet.add(s)
    const sortedPaths = [...(v.paths || [])]
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
    return {
      _id: v._id,
      pageviews: v.pageviews,
      sessions: sessionsSet.size,
      topPaths: sortedPaths,
      firstSeen: new Date(v.firstSeen),
      lastSeen: new Date(v.lastSeen),
      country: v.country,
    }
  })

  const sessions30 = (sessions30Doc[0]?.uniques as number | undefined) ?? 0
  const sessions7 = (sessions7Doc[0]?.uniques as number | undefined) ?? 0
  const sessions1 = (sessions1Doc[0]?.uniques as number | undefined) ?? 0
  const total30 = total30Doc[0]?.total ?? 0
  const total7 = total7Doc[0]?.total ?? 0
  const total1 = total1Doc[0]?.total ?? 0
  const uniqueAllTime = (uniqueAllTimeDoc[0]?.uniques as number | undefined) ?? 0

  // Build day-by-day breakdown (sorted newest first)
  const dailyDetailed: DayBreakdown[] = (
    dailyDetailedRaw as unknown as Array<{
      _id: string
      pageviews: number
      uniqueVisitors: number
      visitors: Array<{
        visitorId: string
        pageviews: number
        paths: { path: string; count: number }[]
        country?: string
        locale?: string
        sessions: string[][]
      }>
    }>
  ).map((d) => {
    const sessionSet = new Set<string>()
    const visitors: DayVisitor[] = d.visitors
      .map((v) => {
        for (const arr of v.sessions || []) for (const s of arr) sessionSet.add(s)
        return {
          visitorId: v.visitorId,
          pageviews: v.pageviews,
          paths: [...(v.paths || [])].sort((a, b) => b.count - a.count),
          country: v.country,
          locale: v.locale,
        }
      })
      .sort((a, b) => b.pageviews - a.pageviews)
    return {
      day: d._id,
      pageviews: d.pageviews,
      uniqueVisitors: d.uniqueVisitors,
      sessions: sessionSet.size,
      visitors,
    }
  })

  // Average unique visitors per day, computed over the actual span of data
  const firstSeenRaw = firstSeenDoc?.[0]?.first
  const firstSeen = firstSeenRaw ? new Date(firstSeenRaw) : null
  const today = startOfDayUtc(new Date())
  const lifetimeDays = firstSeen
    ? Math.max(
        1,
        Math.ceil((today.getTime() - startOfDayUtc(firstSeen).getTime()) / 86400000) + 1,
      )
    : 1
  const totalUniques7 = dailyDetailed
    .filter((d) => new Date(`${d.day}T00:00:00Z`) >= since7)
    .reduce((acc, d) => acc + d.uniqueVisitors, 0)
  const totalUniques30 = dailyDetailed.reduce((acc, d) => acc + d.uniqueVisitors, 0)
  const avgUniquePerDay = {
    d7: dailyDetailed.length ? +(totalUniques7 / Math.min(7, dailyDetailed.length)).toFixed(2) : 0,
    d30: dailyDetailed.length
      ? +(totalUniques30 / Math.min(30, dailyDetailed.length)).toFixed(2)
      : 0,
    lifetime: +(uniqueAllTime / lifetimeDays).toFixed(2),
  }

  return {
    total: { d1: total1, d7: total7, d30: total30 },
    unique: {
      d1: unique1Doc[0]?.uniques ?? 0,
      d7: unique7Doc[0]?.uniques ?? 0,
      d30: unique30Doc[0]?.uniques ?? 0,
      allTime: uniqueAllTime,
    },
    sessions: { d1: sessions1, d7: sessions7, d30: sessions30 },
    avgPagesPerSession: {
      d1: sessions1 ? +(total1 / sessions1).toFixed(2) : 0,
      d7: sessions7 ? +(total7 / sessions7).toFixed(2) : 0,
      d30: sessions30 ? +(total30 / sessions30).toFixed(2) : 0,
    },
    avgUniquePerDay,
    lifetimeDays,
    topPaths: topPaths as Row[],
    topReferrers: topReferrers as Row[],
    topLocales: topLocales as Row[],
    daily: daily as Row[],
    dailyDetailed,
    recentSessions,
    topVisitors,
  }
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div
      style={{
        background: 'var(--theme-elevation-50)',
        border: '1px solid var(--theme-elevation-150)',
        borderRadius: 8,
        padding: '14px 16px',
        minWidth: 0,
      }}
    >
      <div
        style={{
          fontSize: 12,
          color: 'var(--theme-elevation-600)',
          textTransform: 'uppercase',
          letterSpacing: 0.4,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, marginTop: 4 }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
    </div>
  )
}

function Sparkline({ data }: { data: Row[] }) {
  if (!data?.length) return null
  const W = 600
  const H = 80
  const max = Math.max(1, ...data.map((d) => d.total ?? 0))
  const step = data.length > 1 ? W / (data.length - 1) : W
  const pts = data
    .map((d, i) => `${i * step},${H - ((d.total ?? 0) / max) * (H - 8) - 4}`)
    .join(' ')
  return (
    <svg
      width="100%"
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      style={{ display: 'block' }}
    >
      <polyline
        fill="none"
        stroke="var(--theme-success-500, #22c55e)"
        strokeWidth={2}
        points={pts}
      />
    </svg>
  )
}

const cellStyle: React.CSSProperties = {
  padding: '6px 8px',
  borderBottom: '1px solid var(--theme-elevation-100)',
  fontSize: 12.5,
  verticalAlign: 'top',
}

const headStyle: React.CSSProperties = {
  ...cellStyle,
  textAlign: 'left',
  color: 'var(--theme-elevation-600)',
  fontWeight: 500,
  borderBottom: '1px solid var(--theme-elevation-200)',
  background: 'var(--theme-elevation-100)',
}

function SectionCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        background: 'var(--theme-elevation-50)',
        border: '1px solid var(--theme-elevation-150)',
        borderRadius: 8,
        padding: '14px 16px',
        marginBottom: 18,
        overflowX: 'auto',
      }}
    >
      <div
        style={{
          fontSize: 12,
          color: 'var(--theme-elevation-600)',
          textTransform: 'uppercase',
          letterSpacing: 0.4,
          marginBottom: 8,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  )
}

function SessionsTable({ sessions }: { sessions: SessionRow[] }) {
  if (!sessions.length) {
    return (
      <div style={{ color: 'var(--theme-elevation-500)', fontSize: 13 }}>
        No sessions in the last 7 days yet.
      </div>
    )
  }
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
      <thead>
        <tr>
          <th style={headStyle}>Started</th>
          <th style={headStyle}>Visitor</th>
          <th style={headStyle}>Session</th>
          <th style={{ ...headStyle, textAlign: 'right' }}>Pages</th>
          <th style={{ ...headStyle, textAlign: 'right' }}>Duration</th>
          <th style={headStyle}>Entry → Exit</th>
          <th style={headStyle}>Geo / Locale</th>
        </tr>
      </thead>
      <tbody>
        {sessions.map((s) => (
          <tr key={s._id}>
            <td style={cellStyle}>{formatDateTime(s.start)}</td>
            <td style={cellStyle} title={s.visitorId}>
              <code>{shortId(s.visitorId)}</code>
            </td>
            <td style={cellStyle} title={s._id}>
              <code>{shortId(s._id)}</code>
            </td>
            <td
              style={{
                ...cellStyle,
                textAlign: 'right',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {s.pageviews}
              {s.uniquePaths !== s.pageviews ? (
                <span style={{ color: 'var(--theme-elevation-500)' }}>
                  {' '}
                  ({s.uniquePaths} unique)
                </span>
              ) : null}
            </td>
            <td
              style={{
                ...cellStyle,
                textAlign: 'right',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {formatDuration(s.durationSec)}
            </td>
            <td style={{ ...cellStyle, maxWidth: 320 }}>
              <div
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                title={`${s.entryPath} → ${s.exitPath}`}
              >
                <span>{s.entryPath}</span>
                <span style={{ color: 'var(--theme-elevation-500)' }}> → </span>
                <span>{s.exitPath}</span>
              </div>
              {s.paths.length > 1 ? (
                <details style={{ marginTop: 4 }}>
                  <summary
                    style={{
                      cursor: 'pointer',
                      color: 'var(--theme-elevation-600)',
                      fontSize: 11.5,
                    }}
                  >
                    View {s.paths.length} pages
                  </summary>
                  <ol
                    style={{
                      margin: '6px 0 0 18px',
                      padding: 0,
                      fontSize: 11.5,
                      color: 'var(--theme-elevation-700)',
                    }}
                  >
                    {s.paths.map((p, i) => (
                      <li key={i} style={{ wordBreak: 'break-all' }}>
                        {p}
                      </li>
                    ))}
                  </ol>
                </details>
              ) : null}
            </td>
            <td style={cellStyle}>
              {[s.country, s.locale].filter(Boolean).join(' / ') || '—'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function VisitorsTable({ visitors }: { visitors: VisitorRow[] }) {
  if (!visitors.length) {
    return (
      <div style={{ color: 'var(--theme-elevation-500)', fontSize: 13 }}>
        No unique visitors recorded yet.
      </div>
    )
  }
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
      <thead>
        <tr>
          <th style={headStyle}>Visitor</th>
          <th style={{ ...headStyle, textAlign: 'right' }}>Pageviews</th>
          <th style={{ ...headStyle, textAlign: 'right' }}>Sessions</th>
          <th style={headStyle}>Most-visited URLs</th>
          <th style={headStyle}>First seen</th>
          <th style={headStyle}>Last seen</th>
          <th style={headStyle}>Geo</th>
        </tr>
      </thead>
      <tbody>
        {visitors.map((v) => (
          <tr key={v._id}>
            <td style={cellStyle} title={v._id}>
              <code>{shortId(v._id)}</code>
            </td>
            <td
              style={{
                ...cellStyle,
                textAlign: 'right',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {v.pageviews}
            </td>
            <td
              style={{
                ...cellStyle,
                textAlign: 'right',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {v.sessions}
            </td>
            <td style={{ ...cellStyle, maxWidth: 360 }}>
              <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: 12 }}>
                {v.topPaths.map((p) => (
                  <li
                    key={p.path}
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    title={p.path}
                  >
                    <span>{p.path}</span>
                    <span style={{ color: 'var(--theme-elevation-500)' }}>
                      {' '}
                      ({p.count})
                    </span>
                  </li>
                ))}
              </ul>
            </td>
            <td style={cellStyle}>{formatDateTime(v.firstSeen)}</td>
            <td style={cellStyle}>{formatDateTime(v.lastSeen)}</td>
            <td style={cellStyle}>{v.country || '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function DayBreakdownTable({ days }: { days: DayBreakdown[] }) {
  if (!days.length) {
    return (
      <div style={{ color: 'var(--theme-elevation-500)', fontSize: 13 }}>
        No daily activity in the last 30 days.
      </div>
    )
  }
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
      <thead>
        <tr>
          <th style={headStyle}>Day (UTC)</th>
          <th style={{ ...headStyle, textAlign: 'right' }}>Pageviews</th>
          <th style={{ ...headStyle, textAlign: 'right' }}>Unique visitors</th>
          <th style={{ ...headStyle, textAlign: 'right' }}>Sessions</th>
          <th style={headStyle}>Visitors &amp; endpoints</th>
        </tr>
      </thead>
      <tbody>
        {days.map((d) => (
          <tr key={d.day}>
            <td style={{ ...cellStyle, fontVariantNumeric: 'tabular-nums' }}>{d.day}</td>
            <td
              style={{
                ...cellStyle,
                textAlign: 'right',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {d.pageviews.toLocaleString()}
            </td>
            <td
              style={{
                ...cellStyle,
                textAlign: 'right',
                fontVariantNumeric: 'tabular-nums',
                fontWeight: 600,
              }}
            >
              {d.uniqueVisitors.toLocaleString()}
            </td>
            <td
              style={{
                ...cellStyle,
                textAlign: 'right',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {d.sessions.toLocaleString()}
            </td>
            <td style={cellStyle}>
              <details>
                <summary
                  style={{
                    cursor: 'pointer',
                    color: 'var(--theme-elevation-700)',
                    fontSize: 12,
                  }}
                >
                  Show {d.visitors.length} visitor{d.visitors.length === 1 ? '' : 's'}
                </summary>
                <div style={{ marginTop: 8 }}>
                  <table
                    style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      fontSize: 12,
                      background: 'var(--theme-elevation-0)',
                    }}
                  >
                    <thead>
                      <tr>
                        <th style={headStyle}>Visitor</th>
                        <th style={{ ...headStyle, textAlign: 'right' }}>Views</th>
                        <th style={{ ...headStyle, textAlign: 'right' }}>Unique URLs</th>
                        <th style={headStyle}>Endpoints visited</th>
                        <th style={headStyle}>Geo / Locale</th>
                      </tr>
                    </thead>
                    <tbody>
                      {d.visitors.map((v) => (
                        <tr key={v.visitorId}>
                          <td style={cellStyle} title={v.visitorId}>
                            <code>{shortId(v.visitorId)}</code>
                          </td>
                          <td
                            style={{
                              ...cellStyle,
                              textAlign: 'right',
                              fontVariantNumeric: 'tabular-nums',
                            }}
                          >
                            {v.pageviews}
                          </td>
                          <td
                            style={{
                              ...cellStyle,
                              textAlign: 'right',
                              fontVariantNumeric: 'tabular-nums',
                            }}
                          >
                            {v.paths.length}
                          </td>
                          <td style={{ ...cellStyle, maxWidth: 420 }}>
                            <ul style={{ margin: 0, padding: '0 0 0 16px' }}>
                              {v.paths.map((p) => (
                                <li
                                  key={p.path}
                                  style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                  }}
                                  title={p.path}
                                >
                                  <span>{p.path}</span>
                                  <span style={{ color: 'var(--theme-elevation-500)' }}>
                                    {' '}
                                    ({p.count})
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </td>
                          <td style={cellStyle}>
                            {[v.country, v.locale].filter(Boolean).join(' / ') || '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default async function AnalyticsDashboard() {
  let stats: Awaited<ReturnType<typeof fetchStats>> = null
  try {
    stats = await fetchStats()
  } catch (err) {
    console.error('AnalyticsDashboard error', err)
  }

  if (!stats) {
    return (
      <div style={{ padding: 16 }}>
        <h2 style={{ marginBottom: 4 }}>Traffic</h2>
        <p style={{ color: 'var(--theme-elevation-600)' }}>
          Analytics collection unavailable. Once a few page views are recorded the dashboard will
          appear here.
        </p>
      </div>
    )
  }

  return (
    <div style={{ padding: '16px 0 24px' }}>
      <h2 style={{ margin: '0 0 12px', fontSize: 18 }}>Site traffic</h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 12,
          marginBottom: 18,
        }}
      >
        <StatCard label="Visits • today" value={stats.total.d1} />
        <StatCard label="Visits • 7 days" value={stats.total.d7} />
        <StatCard label="Visits • 30 days" value={stats.total.d30} />
        <StatCard label="Unique users • today" value={stats.unique.d1} />
        <StatCard label="Unique users • 7 days" value={stats.unique.d7} />
        <StatCard label="Unique users • 30 days" value={stats.unique.d30} />
        <StatCard
          label={`Unique users • all time (${stats.lifetimeDays}d)`}
          value={stats.unique.allTime}
        />
        <StatCard label="Avg unique / day • 7d" value={stats.avgUniquePerDay.d7} />
        <StatCard label="Avg unique / day • 30d" value={stats.avgUniquePerDay.d30} />
        <StatCard label="Avg unique / day • lifetime" value={stats.avgUniquePerDay.lifetime} />
        <StatCard label="Sessions • today" value={stats.sessions.d1} />
        <StatCard label="Sessions • 7 days" value={stats.sessions.d7} />
        <StatCard label="Sessions • 30 days" value={stats.sessions.d30} />
        <StatCard label="Pages / session • 1d" value={stats.avgPagesPerSession.d1} />
        <StatCard label="Pages / session • 7d" value={stats.avgPagesPerSession.d7} />
        <StatCard label="Pages / session • 30d" value={stats.avgPagesPerSession.d30} />
      </div>

      <SectionCard title="Visits — last 14 days">
        <Sparkline data={stats.daily} />
      </SectionCard>

      <SectionCard title="Day-by-day breakdown (last 30 days) — click a row to see each visitor's endpoints">
        <DayBreakdownTable days={stats.dailyDetailed} />
      </SectionCard>

      <SectionCard title="Recent sessions (last 7 days, latest 25)">
        <SessionsTable sessions={stats.recentSessions} />
      </SectionCard>

      <SectionCard title="Top unique users — most-visited URLs (30 days)">
        <VisitorsTable visitors={stats.topVisitors} />
      </SectionCard>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 18,
        }}
      >
        <ListCard title="Top pages (30 days)" rows={stats.topPaths} keyLabel="Path" />
        <ListCard title="Top referrers (30 days)" rows={stats.topReferrers} keyLabel="Referrer" />
        <ListCard title="By locale (30 days)" rows={stats.topLocales} keyLabel="Locale" />
      </div>
    </div>
  )
}

function ListCard({
  title,
  rows,
  keyLabel,
}: {
  title: string
  rows: Row[]
  keyLabel: string
}) {
  return (
    <div
      style={{
        background: 'var(--theme-elevation-50)',
        border: '1px solid var(--theme-elevation-150)',
        borderRadius: 8,
        padding: '14px 16px',
      }}
    >
      <div
        style={{
          fontSize: 12,
          color: 'var(--theme-elevation-600)',
          textTransform: 'uppercase',
          letterSpacing: 0.4,
          marginBottom: 8,
        }}
      >
        {title}
      </div>
      {rows.length === 0 ? (
        <div style={{ color: 'var(--theme-elevation-500)', fontSize: 13 }}>No data yet.</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              <th
                style={{
                  textAlign: 'left',
                  padding: '4px 0',
                  color: 'var(--theme-elevation-600)',
                  fontWeight: 500,
                }}
              >
                {keyLabel}
              </th>
              <th
                style={{
                  textAlign: 'right',
                  padding: '4px 0',
                  color: 'var(--theme-elevation-600)',
                  fontWeight: 500,
                }}
              >
                Views
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={String(r._id ?? '∅')}>
                <td
                  style={{
                    padding: '4px 0',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: 320,
                  }}
                  title={String(r._id ?? '∅')}
                >
                  {String(r._id ?? '∅')}
                </td>
                <td
                  style={{
                    padding: '4px 0',
                    textAlign: 'right',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {(r.count ?? r.total ?? 0).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
