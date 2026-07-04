import { typographyTokens, colorTokens, radiusTokens } from './tokens';

export function Badge({ label }: { label: string }) {
  return (
    <div className="badge" style={{ background: colorTokens.surface, borderRadius: radiusTokens.pill }}>
      {label}
    </div>
  );
}
