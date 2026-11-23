import { AppImage as Image } from "@/components/ui/AppImage";
import { Crown, Shield, Users } from "lucide-react";
import type { Team } from "@/types";
import { teamHasRoster, teams } from "@/data/teams";
import { cn } from "@/lib/utils";

const faces = [
  { src: "/brand/mascote-face-1.webp", w: 207, h: 199 },
  { src: "/brand/mascote-face-2.webp", w: 208, h: 203 },
  { src: "/brand/mascote-face-3.webp", w: 215, h: 195 },
];

export function teamFace(team: Team) {
  return faces[Math.max(0, teams.findIndex((t) => t.id === team.id)) % faces.length];
}

/** Bolinha de cor da equipe com borda visível em fundos claros e escuros. */
export function TeamSwatch({ team, className }: { team: Team; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("inline-block size-3.5 shrink-0 rounded-full ring-2 ring-navy/80", className)}
      style={{ backgroundColor: team.color }}
    />
  );
}

export function TeamChip({ team, className }: { team: Team; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-semibold", className)}>
      <TeamSwatch team={team} />
      {team.name}
    </span>
  );
}

export function TeamCard({ team }: { team: Team }) {
  const face = teamFace(team);
  const hasRoster = teamHasRoster(team);
  const light = team.id === "grace";

  return (
    <article
      id={team.id}
      aria-labelledby={`${team.id}-nome`}
      className="group scroll-mt-28 overflow-hidden rounded-[1.75rem] border-2 border-navy bg-paper-50 shadow-[0_4px_0_0_var(--color-navy)] transition-[transform,box-shadow] duration-300 ease-[var(--ease-out-quart)] hover:-translate-y-1 hover:shadow-[0_8px_0_0_var(--color-navy)]"
    >
      <div
        className={cn("relative h-48 overflow-hidden border-b-2 border-navy px-5 pt-4 sm:h-52", light && "bg-white")}
        style={{ backgroundColor: team.color, color: team.onColor }}
      >
        {/* listras diagonais discretas */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: `repeating-linear-gradient(-45deg, ${team.onColor} 0 2px, transparent 2px 14px)`,
          }}
        />
        <div className="relative flex items-center justify-between text-sm font-semibold">
          <span
            className="rounded-full border-2 px-2.5 py-0.5 text-xs"
            style={{ borderColor: team.onColor }}
          >
            Equipe {team.colorName.toLowerCase()}
          </span>
          {team.members.length > 0 && <span className="tabular">{team.members.length} integrantes</span>}
        </div>
        <h3
          id={`${team.id}-nome`}
          className={cn(
            "relative mt-6 font-extrabold leading-none tracking-[-0.045em]",
            team.name.length > 9 ? "text-[2.1rem] sm:text-[2.35rem]" : "text-[2.6rem] sm:text-5xl",
          )}
        >
          {team.name}
        </h3>
        <div
          aria-hidden
          className="absolute -bottom-6 right-3 grid size-32 place-items-center rounded-full border-2 border-navy bg-paper-50 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-2 group-hover:rotate-[-6deg]"
        >
          <Image src={face.src} alt="" width={face.w} height={face.h} className="h-24 w-auto" />
        </div>
      </div>

      <div className="space-y-4 p-5">
        <p className="text-sm text-ink-soft">
          Nome inspirado em <span className="font-semibold text-navy">{team.namesake.person}</span>. {team.namesake.note}
        </p>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl border border-navy/12 bg-white/60 p-3">
            <dt className="flex items-center gap-1.5 text-xs font-semibold text-navy-500">
              <Crown aria-hidden className="size-3.5" /> Líder
            </dt>
            <dd className={cn("mt-1 font-semibold", !team.leader && "text-navy-500/80 font-medium italic")}>
              {team.leader ? (
                <>
                  {team.leader.name}
                  {team.leader.turma && <span className="block text-xs font-medium text-navy-500">Turma {team.leader.turma}</span>}
                </>
              ) : (
                "A divulgar"
              )}
            </dd>
          </div>
          <div className="rounded-xl border border-navy/12 bg-white/60 p-3">
            <dt className="flex items-center gap-1.5 text-xs font-semibold text-navy-500">
              <Shield aria-hidden className="size-3.5" /> Vice-líder
            </dt>
            <dd className={cn("mt-1 font-semibold", !team.viceLeader && "text-navy-500/80 font-medium italic")}>
              {team.viceLeader ? (
                <>
                  {team.viceLeader.name}
                  {team.viceLeader.turma && <span className="block text-xs font-medium text-navy-500">Turma {team.viceLeader.turma}</span>}
                </>
              ) : (
                "A divulgar"
              )}
            </dd>
          </div>
        </dl>
        <div>
          <h4 className="flex items-center gap-1.5 text-xs font-semibold text-navy-500">
            <Users aria-hidden className="size-3.5" /> Integrantes
            {team.members.length > 0 && <span className="tabular">({team.members.length})</span>}
          </h4>
          {team.members.length > 0 ? (
            <ul className="mt-2 divide-y divide-navy/8 text-sm">
              {team.members.map((m) => (
                <li key={m.name} className="py-1.5">
                  {m.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 rounded-xl border border-dashed border-navy/25 px-3 py-2.5 text-sm text-ink-soft">
              {hasRoster
                ? "Lista de integrantes em atualização."
                : "A relação de integrantes será divulgada pela organização e nos murais do curso."}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
