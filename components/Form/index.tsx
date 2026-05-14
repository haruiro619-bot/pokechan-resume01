'use client';
import { useAppStore } from '@/lib/store';
import { HandleInput } from './HandleInput';
import { TextareaField } from './TextareaField';
import { AvatarUpload } from './AvatarUpload';
import { PokemonPicker } from './PokemonPicker';
import { RankPicker } from './RankPicker';
import { RuleCheckboxes } from './RuleCheckboxes';
import { BattlegroundSelect } from './BattlegroundSelect';
import { PresetChipInput } from './PresetChipInput';
import { UrlInput } from './UrlInput';
import { PLAY_HISTORY_PRESETS, BATTLE_STYLE_PRESETS } from '@/lib/constants/presets';

export function Form() {
  const form = useAppStore(s => s.form);
  const updateForm = useAppStore(s => s.updateForm);
  return (
    <section aria-label="入力フォーム" className="space-y-6">
      <HandleInput />
      <AvatarUpload />
      <PokemonPicker
        label="推し（純粋推しポケモン） *"
        value={form.oshiPokemon}
        onChange={(v) => updateForm({ oshiPokemon: v })}
        min={1}
        max={3}
      />
      <PokemonPicker
        label="バトルでの推し *"
        value={form.battleOshi}
        onChange={(v) => updateForm({ battleOshi: v })}
        min={1}
        max={3}
      />
      <PokemonPicker
        label="推しの並び（任意）"
        hint="対戦上相性の良いポケモンの組み合わせ（パーティの核）"
        value={form.narabi}
        onChange={(v) => updateForm({ narabi: v })}
        min={2}
        max={3}
      />
      <RankPicker value={form.rank} onChange={(v) => updateForm({ rank: v })} />
      <RuleCheckboxes value={form.rules} onChange={(v) => updateForm({ rules: v })} />
      <BattlegroundSelect value={form.battleground} onChange={(v) => updateForm({ battleground: v })} />
      <PresetChipInput
        id="playHistory"
        label="プレイ歴"
        presets={PLAY_HISTORY_PRESETS}
        value={form.playHistory}
        onChange={(v) => updateForm({ playHistory: v })}
        maxLength={30}
      />
      <PresetChipInput
        id="battleStyle"
        label="好きなバトルスタイル"
        presets={BATTLE_STYLE_PRESETS}
        value={form.battleStyle}
        onChange={(v) => updateForm({ battleStyle: v })}
        maxLength={20}
      />
      <TextareaField
        id="comment"
        label="一言コメント / 自己紹介"
        required
        hint="30〜60文字推奨"
        value={form.comment}
        onChange={(v) => updateForm({ comment: v })}
        maxLength={80}
        rows={3}
      />
      <TextareaField
        id="wantToConnect"
        label="こんな人と繋がりたい！"
        value={form.wantToConnect}
        onChange={(v) => updateForm({ wantToConnect: v })}
        maxLength={60}
        rows={2}
      />
      <TextareaField
        id="oshiCreator"
        label="推しのポケモン活動者"
        value={form.oshiCreator}
        onChange={(v) => updateForm({ oshiCreator: v })}
        maxLength={50}
        rows={2}
      />
      <UrlInput value={form.snsLink} onChange={(v) => updateForm({ snsLink: v })} />
    </section>
  );
}
