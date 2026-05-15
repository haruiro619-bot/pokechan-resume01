import type { ResumeForm } from '@/lib/types';
import { Credit } from '../Credit';
import { RANKS } from '@/lib/constants/ranks';
import { SITE_NAME } from '@/lib/constants/site';

function rankLabel(rank: ResumeForm['rank']): string {
  if (!rank) return '';
  const tier = RANKS.find(r => r.id === rank.tier);
  if (!tier) return '';
  return rank.step ? `${tier.label} ${rank.step}` : tier.label;
}

export function Official({ form }: { form: ResumeForm }) {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-red-500 to-red-600 text-white font-sans">
      <div className="h-[88px] bg-red-700 flex items-center px-10">
        <div className="text-3xl font-bold tracking-wider">TRAINER CARD</div>
        <div className="ml-auto text-sm opacity-80">{SITE_NAME}</div>
      </div>

      <div className="bg-white text-neutral-900 m-8 rounded-2xl shadow-xl p-8 h-[calc(100%-152px)] flex flex-col gap-6 overflow-hidden">
        <div className="flex items-center gap-6">
          {form.iconDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.iconDataUrl} alt="" className="w-36 h-36 rounded-full object-cover border-4 border-red-500 flex-shrink-0" />
          ) : (
            <div className="w-36 h-36 rounded-full bg-neutral-200 border-4 border-red-500 flex-shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <div className="text-5xl font-bold truncate">{form.handle || 'TRAINER'}</div>
            <div className="text-lg text-neutral-600 mt-1">{rankLabel(form.rank)}</div>
            <div className="mt-3 text-lg line-clamp-3">{form.comment}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          {form.oshiPokemon.length > 0 && <Field label="推し" values={form.oshiPokemon} prominent />}
          {form.battleOshi.length > 0 && <Field label="バトル推し" values={form.battleOshi} prominent />}
          {form.narabi.length > 0 && <Field label="並び" values={form.narabi} />}
          {form.rules.length > 0 && <Field label="好きなルール" values={form.rules} />}
          {form.battleground && <Field label="主戦場" values={[form.battleground]} />}
          {form.battleStyle && <Field label="バトルスタイル" values={[form.battleStyle]} />}
          {form.playHistory && <Field label="プレイ歴" values={[form.playHistory]} />}
          {form.oshiCreator && <Field label="推し活動者" values={[form.oshiCreator]} />}
        </div>

        {form.wantToConnect && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3">
            <div className="text-sm text-red-700 font-bold">こんな人と繋がりたい！</div>
            <div className="text-lg">{form.wantToConnect}</div>
          </div>
        )}

        {form.snsLink && (
          <div className="text-base text-blue-600 break-all">{form.snsLink}</div>
        )}
      </div>

      <Credit />
    </div>
  );
}

function Field({ label, values, prominent }: { label: string; values: string[]; prominent?: boolean }) {
  return (
    <div>
      <div className="text-sm text-red-700 font-bold">{label}</div>
      <div className="flex flex-wrap gap-1 mt-1">
        {values.map(v => (
          <span key={v} className={`bg-red-100 text-red-900 px-2 py-0.5 rounded ${prominent ? 'text-xl font-semibold' : 'text-base'}`}>{v}</span>
        ))}
      </div>
    </div>
  );
}
