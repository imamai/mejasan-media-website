'use client';

const POSITIONS = [
  'top left', 'top', 'top right',
  'left', 'center', 'right',
  'bottom left', 'bottom', 'bottom right',
];

export default function FocalPointPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
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
