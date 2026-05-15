import type { ResumeForm } from '@/lib/types';
import { Credit } from '../Credit';
import { RANKS } from '@/lib/constants/ranks';
import { SITE_NAME } from '@/lib/constants/site';
import type { AccentDef } from '@/lib/constants/accents';

function rankLabel(rank: ResumeForm['rank']): string {
  if (!rank) return '';
  const tier = RANKS.find(r => r.id === rank.tier);
  if (!tier) return '';
  return rank.step ? `${tier.label} ${rank.step}` : tier.label;
}

export function Official({ form, accent }: { form: ResumeForm; accent: AccentDef }) {
  return (
    <div
      className="absolute inset-0 text-white overflow-hidden"
      style={{ background: `linear-gradient(160deg, ${accent.bgFrom} 0%, ${accent.bgMid} 55%, ${accent.bgTo} 100%)` }}
    >
      <PokeBallPattern />

      {/* card border */}
      <div
        className="absolute inset-4 rounded-2xl pointer-events-none"
        style={{ border: `1px solid ${accent.primary}44` }}
      />

      {/* ambient glow corners */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${accent.glow} 0%, transparent 70%)`, transform: 'translate(30%, -30%)' }}
      />
      <div
        className="absolute bottom-0 left-0 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${accent.glow} 0%, transparent 70%)`, transform: 'translate(-30%, 30%)' }}
      />

      <div className="relative p-14 h-full flex flex-col gap-10">
        {/* ── Header ── */}
        <div className="flex items-end justify-between">
          <div>
            <div
              className="text-4xl font-bold tracking-widest uppercase"
              style={{
                background: `linear-gradient(90deg, ${accent.secondary} 0%, ${accent.primary} 35%, #fffbeb 55%, ${accent.primary} 75%, ${accent.secondary} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: `drop-shadow(0 0 10px ${accent.glow})`,
              }}
            >
              TRAINER CARD
            </div>
            <div
              className="mt-2 h-px"
              style={{ background: `linear-gradient(90deg, ${accent.primary}cc, ${accent.primary}22, transparent)` }}
            />
          </div>
          <div className="text-sm pb-1" style={{ color: 'rgba(255,255,255,0.25)' }}>{SITE_NAME}</div>
        </div>

        {/* ── Body ── */}
        <div className="flex gap-10 flex-1 min-h-0">
          {/* Left column */}
          <div className="flex flex-col items-center gap-6 w-72 flex-shrink-0">
            <Avatar iconDataUrl={form.iconDataUrl} accent={accent} />

            <div className="text-center w-full">
              <div
                className="text-4xl font-bold truncate"
                style={{ textShadow: `0 0 24px ${accent.glow}` }}
              >
                {form.handle || 'TRAINER'}
              </div>
              {form.rank && (
                <div className="mt-2 text-lg font-medium" style={{ color: accent.primary }}>
                  {rankLabel(form.rank)}
                </div>
              )}
            </div>

            {form.comment && (
              <div
                className="text-base leading-relaxed text-center line-clamp-5 w-full"
                style={{
                  color: 'rgba(240,238,232,0.8)',
                  borderTop: `1px solid ${accent.primary}33`,
                  paddingTop: '1.25rem',
                }}
              >
                {form.comment}
              </div>
            )}

            {form.snsLink && (
              <div
                className="text-sm break-all text-center mt-auto"
                style={{ color: `${accent.primary}bb` }}
              >
                {form.snsLink}
              </div>
            )}
          </div>

          {/* Divider */}
          <div
            className="w-px self-stretch flex-shrink-0"
            style={{ background: `linear-gradient(to bottom, transparent, ${accent.primary}55, transparent)` }}
          />

          {/* Right column */}
          <div className="flex-1 min-w-0 flex flex-col gap-6 overflow-hidden">
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              {form.oshiPokemon.length > 0 && <Field label="推しポケモン"   values={form.oshiPokemon}    accent={accent} prominent />}
              {form.battleOshi.length > 0   && <Field label="バトルでの推し" values={form.battleOshi}     accent={accent} prominent />}
              {form.narabi.length > 0       && <Field label="並び"           values={form.narabi}         accent={accent} />}
              {form.rules.length > 0        && <Field label="好きなルール"   values={form.rules}          accent={accent} />}
              {form.battleground            && <Field label="主戦場"         values={[form.battleground]} accent={accent} />}
              {form.battleStyle             && <Field label="バトルスタイル" values={[form.battleStyle]}  accent={accent} />}
              {form.playHistory             && <Field label="プレイ歴"       values={[form.playHistory]}  accent={accent} />}
              {form.oshiCreator             && <Field label="推し活動者"     values={[form.oshiCreator]}  accent={accent} />}
            </div>

            {form.wantToConnect && (
              <div
                className="rounded-xl p-5 mt-auto"
                style={{
                  background: `${accent.primary}14`,
                  border: `1px solid ${accent.primary}44`,
                }}
              >
                <div className="text-sm font-bold mb-1.5" style={{ color: accent.primary }}>
                  こんな人と繋がりたい
                </div>
                <div className="text-lg" style={{ color: 'rgba(240,238,232,0.9)' }}>
                  {form.wantToConnect}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Credit className="text-white/20" />
    </div>
  );
}

function Avatar({ iconDataUrl, accent }: { iconDataUrl: string; accent: AccentDef }) {
  const ring = `0 0 0 3px ${accent.bgFrom}, 0 0 0 7px ${accent.primary}, 0 0 0 10px ${accent.bgFrom}, 0 0 44px ${accent.glow}`;
  return (
    <div className="w-56 h-56 rounded-full flex-shrink-0" style={{ boxShadow: ring }}>
      {iconDataUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={iconDataUrl}
          alt=""
          className="w-full h-full rounded-full object-cover"
          style={{ border: '2px solid rgba(255,255,255,0.12)' }}
        />
      ) : (
        <div
          className="w-full h-full rounded-full"
          style={{
            background: `radial-gradient(circle at 38% 35%, rgba(255,255,255,0.12) 0%, transparent 55%), ${accent.bgMid}`,
            border: '2px solid rgba(255,255,255,0.08)',
          }}
        />
      )}
    </div>
  );
}

function Field({ label, values, accent, prominent }: { label: string; values: string[]; accent: AccentDef; prominent?: boolean }) {
  return (
    <div>
      <div className="text-sm font-semibold mb-2" style={{ color: `${accent.primary}bb` }}>
        {label}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {values.map(v => (
          <span
            key={v}
            className={`rounded-full px-3 py-0.5 ${prominent ? 'text-lg font-semibold' : 'text-base'}`}
            style={prominent ? {
              background: `${accent.primary}20`,
              border: `1px solid ${accent.primary}77`,
              color: accent.primary,
            } : {
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.13)',
              color: 'rgba(240,238,232,0.9)',
            }}
          >
            {v}
          </span>
        ))}
      </div>
    </div>
  );
}

function PokeBallPattern() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
      style={{ opacity: 0.06 }}
      viewBox="0 0 1080 1080"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* large pokéball — top-right */}
      <circle cx="900" cy="180" r="240" stroke="white" strokeWidth="3" />
      <line x1="660" y1="180" x2="1080" y2="180" stroke="white" strokeWidth="3" />
      <circle cx="900" cy="180" r="50" stroke="white" strokeWidth="3" />
      {/* small pokéball — bottom-left */}
      <circle cx="120" cy="940" r="130" stroke="white" strokeWidth="2" />
      <line x1="0" y1="940" x2="250" y2="940" stroke="white" strokeWidth="2" />
      <circle cx="120" cy="940" r="28" stroke="white" strokeWidth="2" />
    </svg>
  );
}
