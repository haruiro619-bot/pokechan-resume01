import type { ResumeForm } from '@/lib/types';
import { Credit } from '../Credit';
import { RANKS } from '@/lib/constants/ranks';

function rankLabel(rank: ResumeForm['rank']): string {
  if (!rank) return '';
  const tier = RANKS.find(r => r.id === rank.tier);
  if (!tier) return '';
  return rank.step ? `${tier.label} ${rank.step}` : tier.label;
}

export function Starry({ form }: { form: ResumeForm }) {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-[#1a1145] via-[#2a1a5e] to-[#3a1f6e] text-white overflow-hidden">
      <Stars />
      <Moon />

      <div className="relative p-16 h-full flex flex-col gap-8">
        <div className="flex items-center gap-8">
          {form.iconDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={form.iconDataUrl}
              alt=""
              className="w-40 h-40 rounded-full object-cover ring-4 ring-amber-200/60"
              style={{ boxShadow: '0 0 40px rgba(252,211,77,0.4)' }}
            />
          ) : (
            <div className="w-40 h-40 rounded-full bg-white/10 ring-4 ring-amber-200/60" />
          )}
          <div>
            <div className="text-5xl font-serif tracking-wide">{form.handle || 'Trainer'}</div>
            <div className="text-amber-200/80 mt-2 text-lg">{rankLabel(form.rank)}</div>
          </div>
        </div>

        {form.comment && (
          <div className="text-xl italic text-amber-50/90 border-l-2 border-amber-200/60 pl-4">
            {form.comment}
          </div>
        )}

        <div className="grid grid-cols-2 gap-6 text-base">
          {form.oshiPokemon.length > 0 && <StarryField label="推し" values={form.oshiPokemon} />}
          {form.battleOshi.length > 0 && <StarryField label="バトル推し" values={form.battleOshi} />}
          {form.narabi.length > 0 && <StarryField label="並び" values={form.narabi} />}
          {form.rules.length > 0 && <StarryField label="ルール" values={form.rules} />}
          {form.battleground && <StarryField label="主戦場" values={[form.battleground]} />}
          {form.battleStyle && <StarryField label="バトルスタイル" values={[form.battleStyle]} />}
          {form.playHistory && <StarryField label="プレイ歴" values={[form.playHistory]} />}
          {form.oshiCreator && <StarryField label="推し活動者" values={[form.oshiCreator]} />}
        </div>

        {form.wantToConnect && (
          <div className="text-base text-amber-50/90">
            <div className="text-amber-200/80 text-sm mb-1">こんな人と繋がりたい</div>
            {form.wantToConnect}
          </div>
        )}

        {form.snsLink && (
          <div className="text-sm text-amber-200/80 break-all">{form.snsLink}</div>
        )}
      </div>

      <Credit className="text-white/60" />
    </div>
  );
}

function StarryField({ label, values }: { label: string; values: string[] }) {
  return (
    <div>
      <div className="text-amber-200/80 text-sm">{label}</div>
      <div className="flex flex-wrap gap-1 mt-1">
        {values.map(v => (
          <span key={v} className="bg-white/10 backdrop-blur px-2 py-0.5 rounded text-amber-50">{v}</span>
        ))}
      </div>
    </div>
  );
}

function Stars() {
  const dots = Array.from({ length: 60 }, (_, i) => i);
  return (
    <div className="absolute inset-0 pointer-events-none">
      {dots.map(i => {
        const top = (i * 53) % 100;
        const left = (i * 89) % 100;
        const size = (i % 3) + 1;
        return (
          <div
            key={i}
            className="absolute bg-white rounded-full opacity-70"
            style={{ top: `${top}%`, left: `${left}%`, width: size, height: size }}
          />
        );
      })}
    </div>
  );
}

function Moon() {
  return (
    <div
      className="absolute top-16 right-20 w-32 h-32 rounded-full bg-amber-100"
      style={{ boxShadow: '0 0 80px rgba(254,243,199,0.6)' }}
    />
  );
}
