import type { ResumeForm } from '@/lib/types';
import { Credit } from '../Credit';
import { RANKS } from '@/lib/constants/ranks';
import { AutoFitText } from '../AutoFitText';

// ── GB Palette ──────────────────────────────────────────────────────────────
const GB = {
  bg:    '#0F380F',   // deep forest — background
  dark:  '#306230',   // mid forest  — borders, subtle bg
  mid:   '#8BAC0F',   // bright lime — value text
  gold:  '#E0C040',   // gold        — labels, header, accents
  cream: '#F0E880',   // warm cream  — prominent text
  black: '#000000',   // pure black  — frame borders
} as const;

const DOT = 'var(--font-dot-gothic)'; // DotGothic16 (loaded in layout.tsx)

function rankLabel(rank: ResumeForm['rank']): string {
  if (!rank) return '';
  const tier = RANKS.find(r => r.id === rank.tier);
  if (!tier) return '';
  return rank.step ? `${tier.label} ${rank.step}` : tier.label;
}

function join(values: string[]): string {
  return values.join(' · ');
}

// ── Main component ──────────────────────────────────────────────────────────
export function Retro({ form }: { form: ResumeForm }) {
  const rank = rankLabel(form.rank);

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        background: GB.bg,
        // Bevel: lighter top-left / darker bottom-right → "raised card" look
        boxShadow: `inset 8px 8px 0 ${GB.dark}, inset -8px -8px 0 ${GB.black}`,
      }}
    >
      <ScanlineOverlay />

      {/* Gold inner frame (on top, pointer-events off) */}
      <div
        className="absolute pointer-events-none"
        style={{ inset: 16, border: `3px solid ${GB.gold}`, zIndex: 10 }}
      />

      {/* Corner pixel brackets */}
      <CornerPixel style={{ top: 22, left: 22 }}   sq1={{ top: 0, left: 0 }} sq2={{ top: 8, left: 8 }} />
      <CornerPixel style={{ top: 22, right: 22 }}  sq1={{ top: 0, left: 8 }} sq2={{ top: 8, left: 0 }} />
      <CornerPixel style={{ bottom: 22, left: 22 }} sq1={{ top: 8, left: 0 }} sq2={{ top: 0, left: 8 }} />
      <CornerPixel style={{ bottom: 22, right: 22 }} sq1={{ top: 8, left: 8 }} sq2={{ top: 0, left: 0 }} />

      {/* ── Main content stack ── */}
      <div className="absolute flex flex-col overflow-hidden" style={{ inset: 16 }}>

        {/* Header */}
        <div
          className="flex-shrink-0 flex items-center"
          style={{
            height: 80,
            background: 'linear-gradient(180deg, #F0D060 0%, #E0C040 50%, #B09010 100%)',
            borderBottom: `4px solid ${GB.black}`,
            padding: '0 20px',
          }}
        >
          <div
            style={{
              fontFamily: DOT,
              fontSize: 36,
              fontWeight: 'bold',
              color: GB.black,
              letterSpacing: '0.08em',
              flex: 1,
            }}
          >
            ◆ TRAINER CARD ◆
          </div>
          {/* TCG-style color bars */}
          <div className="flex gap-1 flex-shrink-0" style={{ height: 52 }}>
            {(['#CC2200', GB.gold, GB.mid, GB.dark] as string[]).map((c, i) => (
              <div
                key={i}
                style={{
                  width: 12,
                  height: '100%',
                  background: c,
                  border: `2px solid ${GB.black}`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Identity */}
        <div
          className="flex-shrink-0 flex items-center gap-5"
          style={{
            height: 180,
            padding: '16px 20px',
            borderBottom: `2px solid ${GB.dark}`,
          }}
        >
          <RetroAvatar iconDataUrl={form.iconDataUrl} />
          <div className="flex-1 min-w-0 flex flex-col" style={{ gap: 8 }}>
            <AutoFitText
              text={form.handle || 'TRAINER'}
              maxSize={52}
              minSize={22}
              className="font-bold leading-none"
              style={{ color: GB.cream }}
            />
            {rank && (
              <div style={{ fontFamily: DOT, fontSize: 20, color: GB.gold, lineHeight: 1 }}>
                {rank}
              </div>
            )}
            {form.snsLink && (
              <div
                style={{
                  fontSize: 16,
                  color: GB.mid,
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  lineHeight: 1,
                }}
              >
                {form.snsLink}
              </div>
            )}
          </div>
        </div>

        {/* ── Data section ── */}
        <div
          className="flex-1 flex flex-col overflow-hidden"
          style={{ padding: '12px 20px', gap: 8 }}
        >
          {form.oshiPokemon.length > 0 && (
            <ProminentRow label="OSHI" value={join(form.oshiPokemon)} />
          )}
          {form.battleOshi.length > 0 && (
            <ProminentRow label="BTL " value={join(form.battleOshi)} />
          )}

          {form.comment && <RetroSep />}
          {form.comment && <MultilineRow label="MSG " value={form.comment} />}

          {(form.rules.length > 0 || form.battleground) && (
            <div className="flex-shrink-0 flex gap-2" style={{ height: 56 }}>
              {form.rules.length > 0 && (
                <DataRow
                  label="RULE"
                  value={form.rules.join(' & ')}
                  style={{ flex: 1, flexShrink: 1 }}
                />
              )}
              {form.battleground && (
                <DataRow
                  label="AREA"
                  value={form.battleground}
                  style={{ flex: 1, flexShrink: 1 }}
                />
              )}
            </div>
          )}

          {form.narabi.length > 0 && <DataRow label="LINK" value={join(form.narabi)} />}
          {form.battleStyle    && <DataRow label="STYL" value={form.battleStyle} />}
          {form.playHistory    && <DataRow label="HIST" value={form.playHistory} />}
          {form.wantToConnect  && <MultilineRow label="WANT" value={form.wantToConnect} />}
          {form.oshiCreator    && <DataRow label="FAV " value={form.oshiCreator} />}
        </div>
      </div>

      <Credit className="text-[#306230]" />
    </div>
  );
}

// ── Sub-components ───────────────────────────────────────────────────────────

function ScanlineOverlay() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage:
          'repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(0,0,0,0.12) 3px, rgba(0,0,0,0.12) 4px)',
        zIndex: 20,
      }}
    />
  );
}

function CornerPixel({
  style,
  sq1,
  sq2,
}: {
  style: React.CSSProperties;
  sq1: { top: number; left: number };
  sq2: { top: number; left: number };
}) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{ width: 16, height: 16, zIndex: 11, ...style }}
    >
      <div style={{ position: 'absolute', width: 8, height: 8, background: GB.gold, ...sq1 }} />
      <div style={{ position: 'absolute', width: 8, height: 8, background: GB.gold, ...sq2 }} />
    </div>
  );
}

function RetroAvatar({ iconDataUrl }: { iconDataUrl: string }) {
  return (
    <div
      className="flex-shrink-0"
      style={{
        width: 140,
        height: 140,
        border: `6px solid ${GB.black}`,
        boxShadow: `0 0 0 2px ${GB.mid}, 0 0 0 4px ${GB.black}, 0 0 20px ${GB.gold}88`,
        background: GB.dark,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {iconDataUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={iconDataUrl}
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            imageRendering: 'pixelated',
            display: 'block',
          }}
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundImage: `repeating-linear-gradient(
              45deg,
              ${GB.dark} 0px, ${GB.dark} 10px,
              ${GB.bg} 10px, ${GB.bg} 20px
            )`,
          }}
        />
      )}
    </div>
  );
}

/** Prominent row — used for OSHI and BTL (h=96) */
function ProminentRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="flex-shrink-0 flex flex-col"
      style={{
        height: 96,
        padding: '10px 14px',
        background: `${GB.dark}44`,
        border: `1px solid ${GB.dark}`,
        borderLeft: `6px solid ${GB.gold}`,
        gap: 6,
      }}
    >
      <div style={{ fontFamily: DOT, fontSize: 16, color: GB.gold, lineHeight: 1 }}>
        [{label}]
      </div>
      <AutoFitText
        text={value}
        maxSize={44}
        minSize={18}
        className="font-bold leading-none"
        style={{ color: GB.cream }}
      />
    </div>
  );
}

/** Multiline text row — used for MSG and WANT (h=96) */
// availableHeight = 96 - paddingTop(10) - paddingBottom(6) - label(16) - gap(6) = 58
function MultilineRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="flex-shrink-0 flex flex-col"
      style={{
        height: 96,
        padding: '10px 14px 6px',
        border: `1px solid ${GB.dark}`,
        borderLeft: `6px solid ${GB.dark}`,
        gap: 6,
      }}
    >
      <div style={{ fontFamily: DOT, fontSize: 16, color: `${GB.gold}99`, lineHeight: 1 }}>
        [{label}]
      </div>
      <AutoFitText
        text={value}
        maxSize={24}
        minSize={14}
        multiline
        availableHeight={58}
        className="leading-none"
        style={{ color: GB.mid }}
      />
    </div>
  );
}

/** Standard data row (h=56) */
function DataRow({
  label,
  value,
  style,
}: {
  label: string;
  value: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className="flex items-center gap-3"
      style={{ height: 56, flexShrink: 0, ...style }}
    >
      <div
        style={{
          fontFamily: DOT,
          fontSize: 16,
          color: GB.gold,
          flexShrink: 0,
          width: 72,
          lineHeight: 1,
        }}
      >
        [{label}]
      </div>
      <div className="flex-1 min-w-0">
        <AutoFitText
          text={value}
          maxSize={26}
          minSize={14}
          style={{ color: GB.mid }}
        />
      </div>
    </div>
  );
}

function RetroSep() {
  return (
    <div
      className="flex-shrink-0"
      style={{ borderTop: `2px dashed ${GB.dark}`, margin: '2px 0' }}
    />
  );
}
