import type { ResumeForm } from '@/lib/types';
import { Credit } from '../Credit';
import { RANKS } from '@/lib/constants/ranks';
import { SITE_NAME } from '@/lib/constants/site';
import type { AccentDef } from '@/lib/constants/accents';
import { AutoFitText } from '../AutoFitText';

function rankLabel(rank: ResumeForm['rank']): string {
  if (!rank) return '';
  const tier = RANKS.find(r => r.id === rank.tier);
  if (!tier) return '';
  return rank.step ? `${tier.label} ${rank.step}` : tier.label;
}

function joinValues(values: string[]): string {
  return values.join('・');
}

export function Official({ form, accent }: { form: ResumeForm; accent: AccentDef }) {
  const rank = rankLabel(form.rank);

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

      {/* corner glows */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${accent.glow} 0%, transparent 70%)`, transform: 'translate(30%, -30%)' }}
      />
      <div
        className="absolute bottom-0 left-0 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${accent.glow} 0%, transparent 70%)`, transform: 'translate(-30%, 30%)' }}
      />

      {/* ── Main stack ── */}
      <div className="relative p-8 h-full flex flex-col gap-3">

        {/* Header — 60px */}
        <div className="flex items-center justify-between flex-shrink-0" style={{ height: 60 }}>
          <div className="flex-1">
            <div
              className="text-5xl font-bold tracking-widest uppercase leading-none"
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
            <div className="mt-2 h-px" style={{ background: `linear-gradient(90deg, ${accent.primary}cc, ${accent.primary}22, transparent)` }} />
          </div>
          <div className="text-sm pl-4 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.25)' }}>{SITE_NAME}</div>
        </div>

        {/* Identity — 156px */}
        <div className="flex items-center gap-8 flex-shrink-0" style={{ height: 156 }}>
          <Avatar iconDataUrl={form.iconDataUrl} accent={accent} />
          <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
            <AutoFitText
              text={form.handle || 'TRAINER'}
              maxSize={60}
              minSize={24}
              className="font-bold leading-none"
              style={{ textShadow: `0 0 24px ${accent.glow}` }}
            />
            {rank && (
              <div className="text-3xl font-medium leading-none mt-2" style={{ color: accent.primary }}>
                {rank}
              </div>
            )}
            {form.snsLink && (
              <div className="text-base leading-none mt-1 truncate" style={{ color: `${accent.primary}99` }}>
                {form.snsLink}
              </div>
            )}
          </div>
        </div>

        {/* Full-width fixed fields */}
        <FixedField label="推しポケモン"      content={joinValues(form.oshiPokemon)} accent={accent} />
        <FixedField label="バトルでの推し"    content={joinValues(form.battleOshi)}  accent={accent} />
        <FixedField label="一言"              content={form.comment}                  accent={accent} />

        {/* 2-col fixed rows */}
        <div className="grid grid-cols-2 gap-3 flex-shrink-0">
          <FixedField2 label="並び"           content={joinValues(form.narabi)}       accent={accent} />
          <FixedField2 label="好きなルール"   content={joinValues(form.rules)}        accent={accent} />
        </div>
        <div className="grid grid-cols-2 gap-3 flex-shrink-0">
          <FixedField2 label="主戦場"         content={form.battleground ?? ''}       accent={accent} />
          <FixedField2 label="バトルスタイル" content={form.battleStyle}              accent={accent} />
        </div>
        <div className="grid grid-cols-2 gap-3 flex-shrink-0">
          <FixedField2 label="プレイ歴"       content={form.playHistory}              accent={accent} />
          <FixedField2 label="推し活動者"     content={form.oshiCreator}              accent={accent} />
        </div>

        {/* Full-width fixed field */}
        <FixedField label="こんな人と繋がりたい" content={form.wantToConnect} accent={accent} />
      </div>

      <Credit className="text-white/20" />
    </div>
  );
}

/* ── Full-width field (h=105px) ── */
function FixedField({ label, content, accent }: { label: string; content: string; accent: AccentDef }) {
  return (
    <div
      className="flex-shrink-0 rounded-xl overflow-hidden"
      style={{
        height: 105,
        border: `1px solid ${accent.primary}33`,
        padding: '10px 18px',
      }}
    >
      <div className="text-xl font-semibold leading-none" style={{ color: `${accent.primary}cc` }}>
        {label}
      </div>
      <AutoFitText
        text={content}
        maxSize={48}
        minSize={20}
        className="font-bold leading-none mt-2"
      />
    </div>
  );
}

/* ── Half-width field (h=93px, used inside a grid-cols-2) ── */
function FixedField2({ label, content, accent }: { label: string; content: string; accent: AccentDef }) {
  return (
    <div
      className="flex-shrink-0 rounded-xl overflow-hidden"
      style={{
        height: 93,
        border: `1px solid ${accent.primary}33`,
        padding: '8px 16px',
      }}
    >
      <div className="text-lg font-semibold leading-none" style={{ color: `${accent.primary}cc` }}>
        {label}
      </div>
      <AutoFitText
        text={content}
        maxSize={36}
        minSize={16}
        className="font-bold leading-none mt-1.5"
      />
    </div>
  );
}

function Avatar({ iconDataUrl, accent }: { iconDataUrl: string; accent: AccentDef }) {
  const ring = `0 0 0 3px ${accent.bgFrom}, 0 0 0 6px ${accent.primary}, 0 0 0 9px ${accent.bgFrom}, 0 0 36px ${accent.glow}`;
  return (
    <div className="w-36 h-36 rounded-full flex-shrink-0" style={{ boxShadow: ring }}>
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

function PokeBallPattern() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
      style={{ opacity: 0.06 }}
      viewBox="0 0 1080 1080"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="900" cy="180" r="240" stroke="white" strokeWidth="3" />
      <line x1="660" y1="180" x2="1080" y2="180" stroke="white" strokeWidth="3" />
      <circle cx="900" cy="180" r="50" stroke="white" strokeWidth="3" />
      <circle cx="120" cy="940" r="130" stroke="white" strokeWidth="2" />
      <line x1="0" y1="940" x2="250" y2="940" stroke="white" strokeWidth="2" />
      <circle cx="120" cy="940" r="28" stroke="white" strokeWidth="2" />
    </svg>
  );
}
