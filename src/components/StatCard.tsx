export function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="stat-card">
      <p className="stat-card__title">{title}</p>
      <p className="stat-card__value">{value}</p>
    </div>
  );
}
