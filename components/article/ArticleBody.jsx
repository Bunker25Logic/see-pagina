/**
 * ArticleBody — Corpo de texto da notícia.
 *
 * Renderiza HTML sanitizado vindo do campo `content`.
 * Quando integrado ao Supabase, o conteúdo virá de um editor
 * rich-text (ex.: TipTap, Quill, Editor.js) salvo como HTML.
 *
 * Os estilos de tipografia estão em globals.css sob .article-body.
 *
 * ⚠️  Em produção, sanitize o HTML com DOMPurify antes de exibir.
 */
export default function ArticleBody({ content }) {
  if (!content) return null;

  return (
    <div
      className="article-body"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
