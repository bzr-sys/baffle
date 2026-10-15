import {
  GranteeType,
  PermissionType,
  ProductRepeatInterval,
  type BazaarContext,
  type Doc,
  type NewPermission,
} from '@bzr/bazaar'
import { appId, bzr, sellerOrgId } from '@/bazaar'
import { levelLabel } from '@/games'
import type { GameDoc, GameId, Level, PackDoc, PackLevel, Solve } from '@/types'

/** App DB: written only by Baffle's team, read by players */
export const GAMES = 'games'
export const PACK = 'pack'
export const LEVELS = 'levels'
/** Player's own DB */
export const SOLVES = 'solves'

export const PACK_GROUP = 'baffle-pack'
export const PACK_PRICE_CENTS = 500

const all = [
  PermissionType.READ,
  PermissionType.INSERT,
  PermissionType.UPDATE,
  PermissionType.DELETE,
]
const team = { granteeType: GranteeType.TEAM, granteeId: appId, types: all }
const anyoneReads = { granteeType: GranteeType.ANY, types: [PermissionType.READ] }

/**
 * Who may do what in the app DB. Baffle's team writes; players read. Pack
 * levels are readable once the player owns the pack.
 */
const appPermissions: Record<string, Omit<NewPermission, 'collectionName'>[]> = {
  [GAMES]: [team, anyoneReads],
  [PACK]: [team, anyoneReads],
  [LEVELS]: [team, { ...anyoneReads, filter: { products: { $containsAny: '$purchases' } } }],
}

let appContext: Promise<BazaarContext> | undefined

/** Baffle's own DB. Fails for players until an admin has published. */
export function app(): Promise<BazaarContext> {
  appContext ??= bzr.appContext().catch((e) => {
    appContext = undefined
    throw e
  })
  return appContext
}

/** What the pack holds, and the pack levels this player can read */
export async function loadPack(): Promise<{
  pack: PackDoc | null
  games: GameDoc[]
  levels: PackLevel[]
}> {
  const ctx = await app()
  const [packs, games, levels] = await Promise.all([
    ctx.collection<PackDoc>(PACK).getAll(),
    ctx.collection<GameDoc>(GAMES).getAll(),
    ctx.collection<PackLevel>(LEVELS).getAll(),
  ])
  return { pack: packs[0] ?? null, games, levels }
}

export function solves() {
  return bzr.collection<Solve>(SOLVES)
}

// ── Admin ────────────────────────────────────────────────────

/** Only Baffle's team can read the app DB's permissions */
export async function isAppAdmin(): Promise<boolean> {
  try {
    await (await app()).permissions.list()
    return true
  } catch {
    return false
  }
}

/** A game's pack file (`levels/<game>.json`), or null if it isn't one */
export function parseLevels(game: GameId, text: string): Level[] | null {
  try {
    const levels = JSON.parse(text) as Level[]
    const ok =
      Array.isArray(levels) &&
      levels.length > 0 &&
      levels.every((l) => l.game === game && typeof l.n === 'number')
    return ok ? levels : null
  } catch {
    return null
  }
}

/** Add the permissions a collection is missing */
async function grant(ctx: BazaarContext, collectionName: string) {
  const existing = await ctx.permissions.list({ collectionName })
  const key = (p: { granteeType: string; granteeId?: string; types: string[]; filter?: unknown }) =>
    JSON.stringify([p.granteeType, p.granteeId ?? null, [...p.types].sort(), p.filter ?? {}])
  const have = new Set(existing.map(key))
  for (const permission of appPermissions[collectionName] ?? []) {
    if (!have.has(key(permission))) {
      await ctx.permissions.create({ collectionName, ...permission } as NewPermission)
    }
  }
}

/** Create the collection if missing, then its grants: the team itself only reads through one */
async function prepare(ctx: BazaarContext, collectionName: string) {
  const existing = await ctx.collections.list()
  if (!existing.includes(collectionName)) await ctx.collections.create(collectionName)
  await grant(ctx, collectionName)
}

async function upsert<T extends Doc>(ctx: BazaarContext, collectionName: string, docs: T[]) {
  await prepare(ctx, collectionName)
  const collection = ctx.collection<T>(collectionName)
  const current = new Set((await collection.getAll()).map((d) => d.id))
  for (const doc of docs) {
    if (current.has(doc.id)) await collection.replaceOne(doc.id, doc)
    else await collection.insertOne(doc)
  }
}

/**
 * Publish the pack: the product, sold by `sellerOrgId` or else the publishing admin, and
 * the chosen games' pack levels. Safe to run again: it updates what exists.
 */
export async function publish(
  files: Partial<Record<GameId, Level[]>>,
  log: (line: string) => void,
) {
  const ctx = await app()

  // Reuse the product of an earlier publish, recorded in the pack doc
  await prepare(ctx, PACK)
  let pack = await ctx.collection<PackDoc>(PACK).getOne('pack')
  if (pack == null) {
    const product = await bzr.monetization.products.create(
      {
        name: 'Baffle pack',
        description: 'Every puzzle in every Baffle game. Yours to keep.',
        costInCents: PACK_PRICE_CENTS,
        repeatInterval: ProductRepeatInterval.NEVER,
        group: PACK_GROUP,
      },
      { sellerId: sellerOrgId },
    )
    log(`Created the pack product (${product.id})`)
    pack = { id: 'pack', productId: product.id, priceCents: product.costInCents }
    if (sellerOrgId) pack.sellerId = sellerOrgId
  }
  await upsert<PackDoc>(ctx, PACK, [pack])

  for (const [game, levels] of Object.entries(files) as [GameId, Level[]][]) {
    await upsert<PackLevel>(
      ctx,
      LEVELS,
      levels.map((l) => ({ ...l, id: `${game}-${l.n}`, products: [pack.productId] })),
    )
    const sorted = [...levels].sort((a, b) => a.n - b.n)
    await upsert<GameDoc>(ctx, GAMES, [
      { id: game, packCount: levels.length, labels: sorted.map(levelLabel) },
    ])
    log(`${game}: ${levels.length} pack levels`)
  }
  log('Done.')
}
