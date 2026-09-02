import { ArrowUpRight } from 'lucide-react';
import { unsplash } from '../../lib/utils';
import { useSectionScroll } from '../../hooks/useSectionScroll';

const intents = [
  {
    href: '/?category=women#collection',
    kicker: 'Womenswear',
    title: 'Turn every head',
    copy: 'Evening silhouettes, silk, and coats that finish a room.',
    image: unsplash('photo-1515886657613-9f3515b0c78f', 1200),
    featured: true,
  },
  {
    href: '/?category=men#collection',
    kicker: 'Menswear',
    title: 'Command the city',
    copy: 'Tailoring and layers cut for movement, not just the mirror.',
    image: unsplash('photo-1506794778202-cad84cf45f1d', 900),
    featured: false,
  },
  {
    href: '/?category=accessories#collection',
    kicker: 'Movement',
    title: 'Finish the line',
    copy: 'Shoes, belts, and pieces that lock a look in place.',
    image: unsplash('photo-1542291026-7eec264c27ff', 900),
    featured: false,
  },
];

export default function ShopByIntent() {
  const ref = useSectionScroll<HTMLElement>();

  return (
    <section
      id="start-here"
      ref={ref}
      className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6 md:py-24"
    >
      <div className="flex max-w-2xl flex-col">
        <p data-reveal className="text-[10px] font-medium tracking-[0.22em] text-accent-cyan uppercase sm:text-[11px]">
          03  —  Start here
        </p>
        <h2
          data-reveal
          className="mt-3 text-2xl font-bold tracking-tight text-snow uppercase sm:text-4xl lg:text-[44px] lg:leading-[1.08]"
        >
          Shop by how you want to feel.
        </h2>
        <p data-reveal className="mt-4 max-w-lg text-sm leading-relaxed text-mist sm:text-base">
          Skip the endless grid. Choose an intention — we’ll take you to the pieces that match it.
        </p>
      </div>

      <div data-stagger className="mt-10 grid gap-4 md:grid-cols-3 md:grid-rows-2 md:gap-5">
        {intents.map((intent) => (
          <a
            key={intent.title}
            href={intent.href}
            data-reveal
            className={`group relative min-h-[16rem] overflow-hidden rounded-[24px] ${
              intent.featured ? 'md:col-span-2 md:row-span-2 md:min-h-[28rem]' : ''
            }`}
          >
            <img
              src={intent.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-[#0b0e14]/35 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-7">
              <p className="text-[10px] tracking-[0.2em] text-accent-cyan uppercase">{intent.kicker}</p>
              <div className="mt-2 flex items-end justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-snow uppercase sm:text-2xl">{intent.title}</h3>
                  <p className="mt-1 max-w-sm text-sm text-fog">{intent.copy}</p>
                </div>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 bg-white/5 text-snow transition group-hover:border-accent-cyan/40 group-hover:bg-accent-cyan/15">
                  <ArrowUpRight size={18} />
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
