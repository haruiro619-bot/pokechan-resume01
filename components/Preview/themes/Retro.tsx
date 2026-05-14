import type { ResumeForm } from '@/lib/types';
import { Credit } from '../Credit';
import { RANKS } from '@/lib/constants/ranks';

function rankLabel(rank: ResumeForm['rank']): string {
  if (!rank) return '';
  const tier = RANKS.find(r => r.id === rank.tier);
  if (!tier) return '';
  return rank.step ? `${tier.label} ${rank.step}` : tier.label;
}

export function Retro({ form }: { form: ResumeForm }) {
  return (
    <div
      className="absolute inset-0 bg-[#9bbc0f] text-[#0f380f] p-12"
      style={{ fontFamily: 'ui-monospace, "Cascadia Mono", Menlo, monospace', letterSpacing: '0.05em' }}
    >
      <div className="border-4 border-[#0f380f] h-full p-8 relative overflow-hidden">
        <div className="text-3xl font-bold mb-6">▶ TRAINER DATA</div>

        <div className="flex items-start gap-6 mb-6">
          {form.iconDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={form.iconDataUrl}
              alt=""
              className="w-32 h-32 object-cover border-4 border-[#0f380f] flex-shrink-0"
              style={{ imageRendering: 'pixelated' }}
            />
          ) : (
            <div className="w-32 h-32 bg-[#306230] border-4 border-[#0f380f] flex-shrink-0" />
          )}
          <div className="min-w-0">
            <div className="text-4xl truncate">{form.handle || 'NONAME'}</div>
            <div className="text-lg mt-2">{rankLabel(form.rank)}</div>
          </div>
        </div>

        <div className="space-y-2 text-lg">
          {form.comment && <Line label="MSG" value={form.comment} />}
          {form.oshiPokemon.length > 0 && <Line label="OSHI" value={form.oshiPokemon.join(' / ')} />}
          {form.battleOshi.length > 0 && <Line label="BTL" value={form.battleOshi.join(' / ')} />}
          {form.narabi.length > 0 && <Line label="LINK" value={form.narabi.join(' / ')} />}
          {form.rules.length > 0 && <Line label="RULE" value={form.rules.join(' & ')} />}
          {form.battleground && <Line label="AREA" value={form.battleground} />}
          {form.battleStyle && <Line label="STYL" value={form.battleStyle} />}
          {form.playHistory && <Line label="HIST" value={form.playHistory} />}
          {form.wantToConnect && <Line label="WANT" value={form.wantToConnect} />}
          {form.oshiCreator && <Line label="FAV " value={form.oshiCreator} />}
          {form.snsLink && <Line label="URL " value={form.snsLink} />}
        </div>

        <Credit className="text-[#0f380f]" />
      </div>
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <span className="opacity-70 flex-shrink-0">[{label}]</span>
      <span className="flex-1 break-all">{value}</span>
    </div>
  );
}
