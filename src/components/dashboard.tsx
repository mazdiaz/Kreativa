export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header style={{ marginBottom: "1.5rem" }}>
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{description}</p>
    </header>
  );
}

export function StatGrid({ items }: { items: Array<{ label: string; value: string; detail: string }> }) {
  return (
    <section className="grid grid-4" aria-label="Metrik utama">
      {items.map((item) => (
        <article className="card" key={item.label}>
          <div className="metric">{item.value}</div>
          <h3>{item.label}</h3>
          <p>{item.detail}</p>
        </article>
      ))}
    </section>
  );
}

export function ActionList({ items }: { items: Array<{ href: string; label: string; description: string }> }) {
  return (
    <section className="grid grid-3" aria-label="Aksi utama">
      {items.map((item) => (
        <a className="card" href={item.href} key={item.href}>
          <h3>{item.label}</h3>
          <p>{item.description}</p>
        </a>
      ))}
    </section>
  );
}

export function DataTable({
  headers,
  rows,
  emptyMessage = "Belum ada data.",
}: {
  headers: string[];
  rows: Array<Array<string | number | React.ReactNode>>;
  emptyMessage?: string;
}) {
  return (
    <div className="table-wrap card">
      <table>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header} scope="col">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length ? (
            rows.map((row, index) => (
              <tr key={index}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headers.length}>{emptyMessage}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
