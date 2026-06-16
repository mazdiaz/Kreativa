/* eslint-disable @next/next/no-img-element */
import { ArrowRight, BarChart3, ClipboardList, Inbox, type LucideIcon } from "lucide-react";

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
    <header className="page-header">
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
        <article className="metric-card" key={item.label}>
          <div className="metric-icon">
            <BarChart3 aria-hidden="true" size={20} />
          </div>
          <div className="metric">{item.value}</div>
          <h3>{item.label}</h3>
          <p>{item.detail}</p>
        </article>
      ))}
    </section>
  );
}

export function ActionList({
  items,
}: {
  items: Array<{ href: string; label: string; description: string; icon?: LucideIcon }>;
}) {
  return (
    <section className="action-grid" aria-label="Aksi utama">
      {items.map((item) => {
        const Icon = item.icon ?? ClipboardList;
        return (
          <a className="action-card" href={item.href} key={item.href}>
            <span className="action-icon">
              <Icon aria-hidden="true" size={20} />
            </span>
            <span>
              <h3>{item.label}</h3>
              <p>{item.description}</p>
            </span>
            <ArrowRight aria-hidden="true" className="action-arrow" size={18} />
          </a>
        );
      })}
    </section>
  );
}

export function WorkflowList({ items }: { items: Array<{ title: string; detail: string }> }) {
  return (
    <section className="workflow-card" aria-label="Alur kerja utama">
      <div className="workflow-heading">
        <Inbox aria-hidden="true" size={20} />
        <h2>Langkah Kerja</h2>
      </div>
      <ol className="workflow-list">
        {items.map((item) => (
          <li key={item.title}>
            <strong>{item.title}</strong>
            <span>{item.detail}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function StatusBadge({ children }: { children: React.ReactNode }) {
  return <span className="badge">{children}</span>;
}

export function EmptyState({ message = "Belum ada data." }: { message?: string }) {
  return (
    <div className="empty-state">
      <ClipboardList aria-hidden="true" size={24} />
      <p>{message}</p>
    </div>
  );
}

export function FormPanel({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <section className="form-panel">
      {title ? <h2>{title}</h2> : null}
      {children}
    </section>
  );
}

export function ProductGrid({
  actionLabel,
  products,
}: {
  actionLabel: string;
  products: Array<{ id: string; name: string; category: string; description: string; imageUrl: string; participant?: string }>;
}) {
  return (
    <section className="product-grid">
      {products.map((product) => (
        <article className="product-card" key={product.id}>
          <img className="product-image" src={product.imageUrl} alt="" />
          <div className="product-body">
            <span className="badge">{product.category}</span>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            {product.participant ? <p className="product-maker">Karya {product.participant}</p> : null}
            <a className="button secondary compact" href={`/showcase/${product.id}`}>
              {actionLabel}
              <ArrowRight aria-hidden="true" size={16} />
            </a>
          </div>
        </article>
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
    <div className="table-wrap">
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
              <td colSpan={headers.length}>
                <EmptyState message={emptyMessage} />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
