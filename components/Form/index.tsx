'use client';
import { useAppStore } from '@/lib/store';
import { HandleInput } from './HandleInput';
import { TextareaField } from './TextareaField';
import { AvatarUpload } from './AvatarUpload';

export function Form() {
  const form = useAppStore(s => s.form);
  const updateForm = useAppStore(s => s.updateForm);
  return (
    <section aria-label="入力フォーム" className="space-y-6">
      <HandleInput />
      <AvatarUpload />
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
    </section>
  );
}
