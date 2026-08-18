import NewsCard from './NewsCard';

/**
 * NewsGrid — Grade responsiva de notícias secundárias.
 * Renderiza 3 colunas no desktop e 1 coluna no mobile.
 *
 * @param {{ news: Array }} props - Array de objetos de notícia
 */
export default function NewsGrid({ news }) {
  if (!news || news.length === 0) return null;

  return (
    <section aria-label="Outras notícias">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {news.map((item) => (
          <NewsCard key={item.id} news={item} />
        ))}
      </div>
    </section>
  );
}
