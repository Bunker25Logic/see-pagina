import UpdatesFeed from './UpdatesFeed';

/**
 * Sidebar — Barra lateral do portal com widgets de apoio.
 * Agrupa: Acesso Rápido, Atualizações e Banner da Biblioteca Virtual.
 *
 * @param {{ updates: Array }} props
 */
export default function Sidebar({ updates }) {
  return (
    <aside
      className="md:col-span-4 lg:col-span-3 flex flex-col gap-stack-lg border-t md:border-t-0 md:border-l border-outline-variant pt-stack-lg md:pt-0 md:pl-gutter"
      aria-label="Barra lateral"
    >
      <UpdatesFeed updates={updates} />

    </aside>
  );
}
