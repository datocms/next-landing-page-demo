import type { CSSProperties } from 'react';
import DatoStructuredText from '@/components/datocms/DatoStructuredText';
import ProductCard from '@/components/product/ProductCard';
import { FeatureListSectionFragment } from '@/components/sections/FeatureListSection/fragment';
import { stegaOnly } from '@/lib/datocms/contentLink';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';
import { hasStructuredText } from '@/utils/structuredText';

type Props = {
  fragment: FragmentOf<typeof FeatureListSectionFragment>;
  locale: string;
};

type Tone = 'accent' | 'ink' | 'pale' | 'tint';

// The tiles take these fills in turn
const TONES: Tone[] = ['accent', 'pale', 'tint', 'ink', 'pale', 'tint'];

const FILL: Record<Tone, string> = {
  accent: 'bg-accent text-on-accent',
  ink: 'bg-ink text-surface',
  pale: 'bg-subtle',
  tint: 'bg-tint',
};

// A tile without a product card leads with its icon on a chip, inside faint rings
const ICON_CHIP: Record<Tone, string> = {
  accent: 'bg-[rgb(255_255_255/0.16)] text-on-accent',
  ink: 'bg-[rgb(255_255_255/0.1)] text-surface',
  pale: 'bg-surface text-accent',
  tint: 'bg-surface text-accent',
};

const RING: Record<Tone, string> = {
  accent: 'border-[rgb(255_255_255/0.16)]',
  ink: 'border-[rgb(255_255_255/0.1)]',
  pale: 'border-accent/15',
  tint: 'border-accent/15',
};

const TEXT: Record<Tone, string> = {
  accent: 'text-on-accent/90',
  ink: 'text-surface/70',
  pale: 'text-fg-muted',
  tint: 'text-fg-muted',
};

/**
 * `grid` (the default): the features as tiles in four fills (accent, navy and
 * two pale tints), three in a line from 1024px, two from 768px, one on
 * phones. A tile shows its feature's product card above the title and text;
 * without one it leads with the feature's icon on a chip inside faint rings.
 */
const BentoFeatures = ({ fragment, locale }: Props) => {
  const { features } = readFragment(FeatureListSectionFragment, fragment);

  return (
    <section className="section container-page">
      {features.length > 0 && (
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const tone = TONES[index % TONES.length];
            const card = feature.illustration;

            return (
              <li
                key={feature.id}
                className={cn(
                  'group/tile relative flex flex-col overflow-hidden rounded-card p-6',
                  FILL[tone],
                )}
              >
                {(tone === 'accent' || tone === 'ink') && (
                  <span
                    aria-hidden="true"
                    style={
                      {
                        '--loop-time': `${34 + (index % 3) * 8}s`,
                        '--loop-scale': 1.07,
                      } as CSSProperties
                    }
                    className="breathe loop pointer-events-none absolute -top-[70px] -right-[70px] size-[150px] rounded-full shadow-[0_0_0_44px_rgb(255_255_255/0.08),0_0_0_92px_rgb(255_255_255/0.05),0_0_0_144px_rgb(255_255_255/0.03)]"
                  />
                )}
                {card ? (
                  <div
                    aria-hidden="true"
                    className="relative flex flex-1 items-center justify-center pb-6"
                  >
                    <ProductCard
                      card={card}
                      locale={locale}
                      className="w-full transition-[translate,scale] duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] motion-safe:group-hover/tile:-translate-y-1 motion-safe:group-hover/tile:scale-[1.015]"
                    />
                  </div>
                ) : (
                  feature.icon?.url && (
                    <div
                      aria-hidden="true"
                      className="relative mb-9 flex flex-1 items-start"
                    >
                      <span
                        className={cn(
                          'relative grid size-12 place-items-center rounded-control',
                          ICON_CHIP[tone],
                        )}
                      >
                        {[112, 190, 280].map((size, ring) => (
                          <span
                            key={size}
                            style={
                              {
                                width: size,
                                height: size,
                                '--loop-time': `${30 + ring * 9}s`,
                                '--loop-scale': 1.05,
                              } as CSSProperties
                            }
                            className={cn(
                              'breathe loop pointer-events-none absolute top-1/2 left-1/2 -translate-1/2 rounded-full border',
                              RING[tone],
                            )}
                          />
                        ))}
                        {/* The icon is used as a mask, so it takes the chip's colour whatever its own */}
                        <span
                          data-datocms-content-link-source={
                            stegaOnly(feature.icon.alt) || undefined
                          }
                          className="relative size-6 bg-current"
                          style={{
                            mask: `url("${feature.icon.url}") center / contain no-repeat`,
                            WebkitMask: `url("${feature.icon.url}") center / contain no-repeat`,
                          }}
                        />
                      </span>
                    </div>
                  )
                )}
                <div className="relative">
                  <h2 className="text-h3">{feature.title}</h2>
                  {hasStructuredText(feature.description) && (
                    <div
                      className={cn(
                        'mt-2 max-w-[27.5rem] text-small leading-[1.55] [&_p+p]:mt-2',
                        TEXT[tone],
                      )}
                    >
                      <DatoStructuredText data={feature.description} />
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

export default BentoFeatures;
