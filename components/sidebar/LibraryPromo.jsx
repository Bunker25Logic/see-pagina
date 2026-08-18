/**
 * LibraryPromo — Banner promocional da Biblioteca Virtual.
 * Componente estático de CTA na sidebar.
 * Futuramente pode ser configurável via painel administrativo.
 */
export default function LibraryPromo() {
  return (
    <div className="bg-primary text-on-primary p-stack-md rounded text-center flex flex-col gap-stack-sm items-center">
      <span
        className="material-symbols-outlined text-[48px]"
        aria-hidden="true"
      >
        menu_book
      </span>

      <h3 className="font-headline-md text-headline-md">
        Biblioteca Virtual
      </h3>

      <p className="font-body-md text-body-md opacity-90">
        Acesse milhares de títulos gratuitamente pelo portal do aluno.
      </p>

      <a
        href="https://biblioteca.ac.gov.br"
        target="_blank"
        rel="noopener noreferrer"
        className="
          bg-on-primary text-primary
          font-label-caps text-label-caps uppercase tracking-wider
          px-margin-mobile py-stack-sm rounded
          hover:bg-surface-container-highest
          transition-colors mt-stack-sm
          inline-block
        "
      >
        Acessar Agora
      </a>
    </div>
  );
}
