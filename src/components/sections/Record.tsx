import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { achievements, coursework, education, extracurricular, programmes } from "@/content/profile";

/** Education, scholastic achievements and extracurriculars — compact by design. */
export function Record() {
  return (
    <section id="record" aria-labelledby="record-title" className="relative py-24 md:py-32">
      <div className="shell">
        <SectionHeader id="record-title" index="07" label="Record" meta="Education · achievements" title="The record" />

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <p className="label-sm mb-3 text-fog">Education</p>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse text-left text-[0.88rem]">
                <thead>
                  <tr className="border-b border-line-strong">
                    {["Degree / examination", "Institute", "Year", "CPI / %"].map((h) => (
                      <th key={h} scope="col" className="label-sm py-2 pr-4 font-normal text-fog">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {education.map((e) => (
                    <tr key={e.degree} className="border-b border-line">
                      <td className="py-3 pr-4 text-paper">
                        {e.degree}
                        <span className="block text-[0.78rem] text-fog">{e.board}</span>
                      </td>
                      <td className="py-3 pr-4 text-mist">{e.institute}</td>
                      <td className="py-3 pr-4 font-mono text-[0.78rem] whitespace-nowrap text-mist">{e.year}</td>
                      <td className="py-3 font-mono text-[0.78rem] whitespace-nowrap text-cyan">{e.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {programmes.map((p) => (
                <li key={p.label} className="border border-line bg-ink-900/60 px-4 py-3">
                  <span className="label-sm text-violet">{p.label}</span>
                  <span className="mt-1 block text-[0.86rem] text-mist">{p.detail}</span>
                </li>
              ))}
            </ul>

            <p className="label-sm mt-10 mb-3 text-fog">Key coursework</p>
            <dl className="grid gap-4 sm:grid-cols-[7rem_1fr]">
              {Object.entries(coursework).map(([k, list]) => (
                <div key={k} className="contents">
                  <dt className="label-sm pt-1 text-mist">{k}</dt>
                  <dd className="text-[0.86rem] leading-relaxed text-mist">{list.join(" · ")}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <div className="space-y-8 lg:col-span-5">
            <Reveal delay={0.1}>
              <p className="label-sm mb-3 text-fog">Scholastic achievements</p>
              <ul className="grid grid-cols-2 gap-2">
                {achievements.map((a) => (
                  <li key={a.label} className="border border-line bg-ink-900/60 p-4">
                    <p className="display text-4xl text-paper">
                      {a.value}
                      <span className="ml-1 font-sans text-xs text-fog">{a.unit}</span>
                    </p>
                    <p className="label-sm mt-2 text-cyan">{a.label}</p>
                    <p className="mt-1 text-[0.78rem] text-fog">
                      {a.detail} · {a.year}
                    </p>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="label-sm mb-3 text-fog">Extracurricular</p>
              <ul className="divide-y divide-line border-y border-line">
                {extracurricular.map((x) => (
                  <li key={x.domain} className="grid grid-cols-[1fr_auto] gap-3 py-3">
                    <span>
                      <span className="label-sm text-lime">{x.domain}</span>
                      <span className="mt-1 block text-[0.86rem] text-mist">{x.text}</span>
                    </span>
                    <span className="font-mono text-[0.72rem] text-fog">{x.year}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
