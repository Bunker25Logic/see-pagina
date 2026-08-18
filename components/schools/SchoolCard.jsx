/**
 * SchoolCard — Card de escola para a listagem.
 *
 * @param {{ school: {
 *   id: string,
 *   name: string,
 *   type: string,
 *   principal: string,
 *   phone: string,
 *   address: string,
 *   studentCount: number,
 *   slug: string
 * }}} props
 */
export default function SchoolCard({ school }) {
  const { name, type, principal, phone, address, studentCount } = school;

  return (
    <div className="bg-surface-container-lowest border border-outline-variant p-stack-md flex flex-col gap-stack-sm rounded-sm hover:shadow-md transition-shadow">
      {/* Tipo de ensino */}
      <span className="font-label-caps text-label-caps text-secondary uppercase tracking-wider">
        {type}
      </span>

      {/* Nome */}
      <h2 className="font-headline-md text-headline-md text-primary leading-tight">
        {name}
      </h2>

      {/* Informações */}
      <div className="flex flex-col gap-unit mt-unit border-t border-outline-variant pt-stack-sm">
        <div className="flex items-start gap-stack-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-[18px] mt-0.5 shrink-0" aria-hidden="true">
            person
          </span>
          <div>
            <p className="font-label-caps text-label-caps text-outline uppercase tracking-wider">Diretor(a)</p>
            <p className="font-body-md text-body-md text-on-surface">{principal}</p>
          </div>
        </div>

        <div className="flex items-start gap-stack-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-[18px] mt-0.5 shrink-0" aria-hidden="true">
            call
          </span>
          <div>
            <p className="font-label-caps text-label-caps text-outline uppercase tracking-wider">Telefone</p>
            <a
              href={`tel:${phone.replace(/\D/g, '')}`}
              className="font-body-md text-body-md text-on-surface hover:text-secondary transition-colors"
            >
              {phone}
            </a>
          </div>
        </div>

        <div className="flex items-start gap-stack-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-[18px] mt-0.5 shrink-0" aria-hidden="true">
            location_on
          </span>
          <div>
            <p className="font-label-caps text-label-caps text-outline uppercase tracking-wider">Endereço</p>
            <p className="font-body-md text-body-md text-on-surface">{address}</p>
          </div>
        </div>
      </div>

      {/* Rodapé do card */}
      <div className="flex items-center gap-unit pt-stack-sm border-t border-outline-variant mt-auto">
        <span className="material-symbols-outlined text-[16px] text-secondary" aria-hidden="true">
          groups
        </span>
        <span className="font-caption text-caption text-on-surface-variant">
          {studentCount.toLocaleString('pt-BR')} alunos matriculados
        </span>
      </div>
    </div>
  );
}
