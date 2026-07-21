'use client';

import { Fragment } from 'react';
import { ChevronUp, ChevronDown, Trash2, Plus } from 'lucide-react';
import type { SchemaField } from '@/lib/page-content-schema';
import ImageUploadField from './ImageUploadField';

const inputCls = 'w-full bg-[#0B0B0B] border border-white/[0.08] text-white/80 font-display text-sm px-4 py-2.5 focus:outline-none focus:border-[#E10600]/40 placeholder:text-white/20';
const textareaCls = `${inputCls} resize-none`;

function FieldLabel({ children }: { children: string }) {
  return <label className="block text-[10px] font-display tracking-widest uppercase text-white/30 mb-1.5">{children}</label>;
}

const POSITIONS = [
  'top left', 'top', 'top right',
  'left', 'center', 'right',
  'bottom left', 'bottom', 'bottom right',
];

function FocalPointPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const current = value || 'center';
  return (
    <div className="grid grid-cols-3 gap-1 w-24">
      {POSITIONS.map((pos) => (
        <button
          key={pos}
          type="button"
          title={pos}
          onClick={() => onChange(pos)}
          className={`aspect-square border transition-colors ${current === pos ? 'bg-[#E10600] border-[#E10600]' : 'bg-[#0B0B0B] border-white/[0.12] hover:border-white/30'}`}
        />
      ))}
    </div>
  );
}

function FieldRenderer({
  field, value, onChange,
}: { field: SchemaField; value: unknown; onChange: (v: unknown) => void }) {
  switch (field.type) {
    case 'text':
      return (
        <div>
          <FieldLabel>{field.label}</FieldLabel>
          <input value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value)} className={inputCls} />
        </div>
      );

    case 'textarea':
      return (
        <div>
          <FieldLabel>{field.label}</FieldLabel>
          <textarea rows={3} value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value)} className={textareaCls} />
        </div>
      );

    case 'boolean':
      return (
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input type="checkbox" checked={(value as boolean) ?? false} onChange={(e) => onChange(e.target.checked)} className="accent-[#E10600]" />
          <span className="text-[12px] font-display text-white/50">{field.label}</span>
        </label>
      );

    case 'image':
      return (
        <div>
          <FieldLabel>{field.label}</FieldLabel>
          <ImageUploadField value={(value as string) ?? ''} onChange={onChange} />
        </div>
      );

    case 'imagePosition':
      return (
        <div>
          <FieldLabel>{field.label}</FieldLabel>
          <p className="text-[10px] text-white/25 font-display mb-2">Which part of the photo should stay visible when it's cropped.</p>
          <FocalPointPicker value={(value as string) ?? 'center'} onChange={onChange} />
        </div>
      );

    case 'stringlist': {
      const arr = Array.isArray(value) ? (value as string[]) : [];
      return (
        <div>
          <FieldLabel>{field.label}</FieldLabel>
          <textarea
            rows={Math.max(3, arr.length)}
            value={arr.join('\n')}
            onChange={(e) => onChange(e.target.value.split('\n').map((s) => s.trimEnd()).filter((s, i, all) => s !== '' || i < all.length - 1))}
            className={textareaCls}
          />
        </div>
      );
    }

    case 'group': {
      const obj = (value as Record<string, unknown>) ?? {};
      return (
        <div className="border border-white/[0.06] p-4 space-y-4">
          <div className="text-[10px] font-display tracking-widest uppercase text-[#E10600]">{field.label}</div>
          {field.fields.map((sub) => (
            <FieldRenderer
              key={sub.key}
              field={sub}
              value={obj[sub.key]}
              onChange={(v) => onChange({ ...obj, [sub.key]: v })}
            />
          ))}
        </div>
      );
    }

    case 'list': {
      const arr = Array.isArray(value) ? (value as Record<string, unknown>[]) : [];

      const updateItem = (idx: number, newItem: Record<string, unknown>) => {
        const next = [...arr];
        next[idx] = newItem;
        onChange(next);
      };
      const removeItem = (idx: number) => onChange(arr.filter((_, i) => i !== idx));
      const moveItem = (idx: number, dir: -1 | 1) => {
        const target = idx + dir;
        if (target < 0 || target >= arr.length) return;
        const next = [...arr];
        [next[idx], next[target]] = [next[target], next[idx]];
        onChange(next);
      };
      const addItem = () => onChange([...arr, field.newItem]);

      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-display tracking-widest uppercase text-[#E10600]">{field.label}</div>
            <button type="button" onClick={addItem} className="flex items-center gap-1 text-[9px] font-display text-white/40 hover:text-white transition-colors border border-white/[0.08] px-2 py-1">
              <Plus size={10} /> Add
            </button>
          </div>
          <div className="space-y-3">
            {arr.map((item, idx) => (
              <div key={idx} className="border border-white/[0.06] p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-display text-white/50">
                    {String(item[field.itemLabelKey] ?? `Item ${idx + 1}`)}
                  </span>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => moveItem(idx, -1)} disabled={idx === 0} className="text-white/25 hover:text-white disabled:opacity-20 transition-colors"><ChevronUp size={13} /></button>
                    <button type="button" onClick={() => moveItem(idx, 1)} disabled={idx === arr.length - 1} className="text-white/25 hover:text-white disabled:opacity-20 transition-colors"><ChevronDown size={13} /></button>
                    <button type="button" onClick={() => removeItem(idx)} className="text-white/25 hover:text-red-400 transition-colors ml-1"><Trash2 size={13} /></button>
                  </div>
                </div>
                {field.itemFields.map((sub) => (
                  <FieldRenderer
                    key={sub.key}
                    field={sub}
                    value={item[sub.key]}
                    onChange={(v) => updateItem(idx, { ...item, [sub.key]: v })}
                  />
                ))}
              </div>
            ))}
            {arr.length === 0 && <p className="text-[11px] text-white/20 font-display">No items yet.</p>}
          </div>
        </div>
      );
    }

    default:
      return null;
  }
}

export default function PageContentEditor({
  schema, value, onChange,
}: { schema: SchemaField[]; value: Record<string, unknown>; onChange: (v: Record<string, unknown>) => void }) {
  return (
    <div className="space-y-5">
      {schema.map((field) => (
        <Fragment key={field.key}>
          <FieldRenderer
            field={field}
            value={value[field.key]}
            onChange={(v) => onChange({ ...value, [field.key]: v })}
          />
        </Fragment>
      ))}
    </div>
  );
}
