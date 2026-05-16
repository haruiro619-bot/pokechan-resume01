import type { ResumeForm } from '@/lib/types';
import { Credit } from '../Credit';
import { RANKS } from '@/lib/constants/ranks';
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

// ── Main component ──────────────────────────────────────────────────────────
export function Starry({ form, accent }: { form: ResumeForm; accent: AccentDef }) {
  const rank = rankLabel(form.rank);

  return (
    <div
      className="absolute inset-0 text-white overflow-hidden"
      style={{
        background: `linear-gradient(160deg, ${accent.bgFrom} 0%, ${accent.bgMid} 55%, ${accent.bgTo} 100%)`,
      }}
    >
      {/* Star twinkle keyframes (inline for component isolation) */}
      <style>{`
        @keyframes starTwinkle {
          0%, 100% { opacity: var(--s-lo, 0.25); }
          50%       { opacity: var(--s-hi, 0.95); }
        }
      `}</style>

      {/* Nebula glow layers */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 500px 350px at 85% 8%,  ${accent.primary}1a, transparent 70%),
            radial-gradient(ellipse 350px 500px at 15% 82%, ${accent.secondary}14, transparent 70%),
            radial-gradient(ellipse 280px 280px at 55% 48%, #60D0F016, transparent 60%)
          `,
        }}
      />

      <StarField accent={accent} />

      {/* ── Main content stack ── */}
      <div
        className="relative h-full flex flex-col overflow-hidden"
        style={{ padding: 36, gap: 10 }}
      >
        {/* Header */}
        <div className="flex-shrink-0" style={{ height: 68 }}>
          <div
            style={{
              fontSize: 52,
              fontWeight: 900,
              letterSpacing: '0.1em',
              lineHeight: 1,
              background: `linear-gradient(90deg, ${accent.secondary} 0%, #ffffff 30%, ${accent.primary} 55%, #F0C060 75%, ${accent.secondary} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: `drop-shadow(0 0 14px ${accent.primary}) drop-shadow(0 0 28px ${accent.glow})`,
            }}
          >
            TRAINER CARD
          </div>
          <div
            className="mt-3 h-px"
            style={{
              background: `linear-gradient(90deg, ${accent.primary}cc, ${accent.primary}44, transparent)`,
            }}
          />
        </div>

        {/* Identity */}
        <div className="flex-shrink-0 flex items-center gap-8" style={{ height: 180 }}>
          <StarryAvatar iconDataUrl={form.iconDataUrl} accent={accent} />
          <div className="flex-1 min-w-0 flex flex-col justify-center" style={{ gap: 8 }}>
            <AutoFitText
              text={form.handle || 'TRAINER'}
              maxSize={60}
              minSize={24}
              className="font-bold leading-none"
              style={{ color: 'white', textShadow: `0 0 24px ${accent.glow}` }}
            />
            {rank && (
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 500,
                  lineHeight: 1,
                  color: accent.primary,
                  textShadow: `0 0 10px ${accent.glow}`,
                }}
              >
                {rank}
              </div>
            )}
            {form.snsLink && (
              <div
                style={{
                  fontSize: 16,
                  lineHeight: 1,
                  color: `${accent.primary}99`,
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                }}
              >
                {form.snsLink}
              </div>
            )}
          </div>
        </div>

        {/* 推しポケモン + バトルでの推し */}
        <div className="grid grid-cols-2 gap-3 flex-shrink-0">
          <StarryPanel label="推しポケモン"   content={joinValues(form.oshiPokemon)} accent={accent} />
          <StarryPanel label="バトルでの推し" content={joinValues(form.battleOshi)}  accent={accent} />
        </div>

        {/* 一言 — multiline */}
        <StarryPanel label="一言" content={form.comment} accent={accent} multiline />

        {/* 2-col grids */}
        <div className="grid grid-cols-2 gap-3 flex-shrink-0">
          <StarryPanel2 label="並び"         content={joinValues(form.narabi)} accent={accent} />
          <StarryPanel2 label="好きなルール" content={joinValues(form.rules)}  accent={accent} />
        </div>
        <div className="grid grid-cols-2 gap-3 flex-shrink-0">
          <StarryPanel2 label="主戦場"         content={form.battleground ?? ''} accent={accent} />
          <StarryPanel2 label="バトルスタイル" content={form.battleStyle}        accent={accent} />
        </div>
        <div className="grid grid-cols-2 gap-3 flex-shrink-0">
          <StarryPanel2 label="プレイ歴"   content={form.playHistory} accent={accent} />
          <StarryPanel2 label="推し活動者" content={form.oshiCreator} accent={accent} />
        </div>

        {/* こんな人と繋がりたい — multiline */}
        <StarryPanel label="こんな人と繋がりたい" content={form.wantToConnect} accent={accent} multiline />
      </div>

      <Credit className="text-white/20" />
    </div>
  );
}

// ── Sub-components ───────────────────────────────────────────────────────────

function StarField({ accent }: { accent: AccentDef }) {
  const stars = Array.from({ length: 80 }, (_, i) => {
    const cx      = ((i * 137.508) % 100) * 10.8;
    const cy      = ((i * 98.618)  % 100) * 10.8;
    const isBright = i % 15 === 0;
    const isMid    = i % 5 === 0;
    const r   = isBright ? 2.5 : isMid ? 1.8 : 1.2;
    const lo  = 0.20 + (i % 6) * 0.05;
    const hi  = 0.60 + (i % 5) * 0.08;
    const dur = 2.5 + (i % 6) * 0.5;
    const delay = (i % 8) * 0.4;
    return { cx, cy, r, isBright, isMid, lo, hi, dur, delay };
  });

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1080 1080"
      xmlns="http://www.w3.org/2000/svg"
      style={{ zIndex: 1 }}
    >
      <defs>
        <filter id="sGlow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="aGlow" x="-300%" y="-300%" width="700%" height="700%">
          <feColorMatrix type="saturate" values="2" result="sat" />
          <feGaussianBlur stdDeviation="3" in="sat" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {stars.map((s, i) => (
        <circle
          key={i}
          cx={s.cx}
          cy={s.cy}
          r={s.r}
          fill={s.isBright ? accent.primary : 'white'}
          filter={s.isBright ? 'url(#aGlow)' : s.isMid ? 'url(#sGlow)' : undefined}
          style={{
            ['--s-lo' as string]: s.lo,
            ['--s-hi' as string]: s.hi,
            animation: `starTwinkle ${s.dur}s ${s.delay}s ease-in-out infinite`,
          }}
        />
      ))}
    </svg>
  );
}

function StarryAvatar({ iconDataUrl, accent }: { iconDataUrl: string; accent: AccentDef }) {
  const ring = [
    `0 0 0 3px ${accent.bgFrom}`,
    `0 0 0 6px ${accent.primary}`,
    `0 0 0 9px ${accent.bgFrom}`,
    `0 0 0 13px ${accent.primary}55`,
    `0 0 0 16px ${accent.bgFrom}`,
    `0 0 0 20px ${accent.primary}22`,
    `0 0 48px ${accent.glow}`,
    `0 0 96px ${accent.glow}`,
  ].join(', ');

  return (
    <div className="w-36 h-36 rounded-full flex-shrink-0" style={{ boxShadow: ring }}>
      {iconDataUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={iconDataUrl}
          alt=""
          className="w-full h-full rounded-full object-cover"
          style={{ border: '2px solid rgba(255,255,255,0.15)' }}
        />
      ) : (
        <div
          className="w-full h-full rounded-full"
          style={{
            background: `radial-gradient(circle at 38% 35%, rgba(255,255,255,0.15) 0%, transparent 55%), ${accent.bgMid}`,
            border: '2px solid rgba(255,255,255,0.08)',
          }}
        />
      )}
    </div>
  );
}

/* ── Full-width panel (h=105) ──────────────────────────────────────────────
   availableHeight = 105 - 10(top) - 10(bot) - 18(label) - 8(mt-2) = 59    */
function StarryPanel({
  label,
  content,
  accent,
  multiline,
}: {
  label: string;
  content: string;
  accent: AccentDef;
  multiline?: boolean;
}) {
  return (
    <div
      className="flex-shrink-0 overflow-hidden"
      style={{
        height: 105,
        borderRadius: 20,
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${accent.primary}44`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.07), inset 0 0 24px rgba(255,255,255,0.01)`,
        padding: '10px 20px',
      }}
    >
      <div
        style={{
          fontSize: 18,
          fontWeight: 600,
          lineHeight: 1,
          color: accent.primary,
          textShadow: `0 0 8px ${accent.glow}`,
        }}
      >
        {label}
      </div>
      <AutoFitText
        text={content}
        maxSize={48}
        minSize={20}
        multiline={multiline}
        availableHeight={59}
        className="font-bold leading-none mt-2"
        style={{ color: 'white' }}
      />
    </div>
  );
}

/* ── Half-width panel (h=93, used inside grid-cols-2) ──────────────────────
   availableHeight = 93 - 8(top) - 8(bot) - 16(label) - 8(mt-2) = 53       */
function StarryPanel2({
  label,
  content,
  accent,
}: {
  label: string;
  content: string;
  accent: AccentDef;
}) {
  return (
    <div
      className="flex-shrink-0 overflow-hidden"
      style={{
        height: 93,
        borderRadius: 16,
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${accent.primary}44`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.07)`,
        padding: '8px 18px',
      }}
    >
      <div
        style={{
          fontSize: 16,
          fontWeight: 600,
          lineHeight: 1,
          color: accent.primary,
          textShadow: `0 0 6px ${accent.glow}`,
        }}
      >
        {label}
      </div>
      <AutoFitText
        text={content}
        maxSize={36}
        minSize={16}
        className="font-bold leading-none mt-2"
        style={{ color: 'white' }}
      />
    </div>
  );
}
