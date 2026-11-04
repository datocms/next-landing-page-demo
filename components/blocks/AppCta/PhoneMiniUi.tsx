import { Squiggle } from '@/components/ui/Ornaments';

/** Wordless phone mini-UI for the in-article app CTA. Decorative */
const PhoneMiniUi = () => (
  <div
    aria-hidden="true"
    className="zone grid min-h-[260px] place-items-center self-stretch max-md:hidden"
  >
    <div className="flex h-[224px] w-[116px] flex-col items-center rounded-[24px] border border-line bg-white p-2.5 shadow-card">
      <span className="h-[5px] w-9 rounded-full bg-surface" />
      <span className="mt-3 grid h-16 w-full place-items-center rounded-[12px] bg-g-100">
        <Squiggle variant="sweep" className="h-5 w-12" />
      </span>
      <span className="mt-3.5 grid w-full gap-2 px-0.5">
        <span className="sk w-[80%]" />
        <span className="sk w-[64%]" />
        <span className="sk w-[72%]" />
      </span>
      <span className="mt-auto h-6 w-[72px] rounded-full bg-grad" />
    </div>
  </div>
);

export default PhoneMiniUi;
