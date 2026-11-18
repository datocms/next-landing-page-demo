import type { CSSProperties } from 'react';
import { SharedElement } from '@/components/layout/PageTransition';
import { TeamSectionFragment } from '@/components/sections/TeamSection/fragment';
import AppLink from '@/components/ui/AppLink';
import Avatar from '@/components/ui/Avatar';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import { authorUrl } from '@/utils/routes';
import styles from './TeamOrbit.module.css';

type Props = {
  fragment: FragmentOf<typeof TeamSectionFragment>;
  globalPageProps: ResolvedGlobalPageProps;
};

/** Up to this many members sit around the hub; more simply fill the grid */
const MAX_ORBIT = 10;
/** The ellipse the cards sit on, from the stage's centre (1024px and up) */
const RADIUS_X = 38; // % of the stage's width
const RADIUS_Y = 200; // px (the stage is 560px tall)

/** The stage's height from 1024px (TeamOrbit.module.css), for the lines' end points */
const STAGE_HEIGHT = 560;

/** The angle of card `index` of `count`: evenly round the ellipse, none straight above the hub */
const orbitAngle = (index: number, count: number) =>
  (-90 + 180 / count + (index * 360) / count) * (Math.PI / 180);

/** Where card `index` sits, from the stage's centre */
const orbitPosition = (index: number, count: number) => {
  const angle = orbitAngle(index, count);
  return {
    '--x': `${(Math.cos(angle) * RADIUS_X).toFixed(2)}%`,
    '--y': `${Math.round(Math.sin(angle) * RADIUS_Y)}px`,
  };
};

/** The same point in the stage's own percentages, for an SVG line's end */
const orbitPoint = (index: number, count: number) => {
  const angle = orbitAngle(index, count);
  return {
    x: `${(50 + Math.cos(angle) * RADIUS_X).toFixed(2)}%`,
    y: `${(50 + ((Math.sin(angle) * RADIUS_Y) / STAGE_HEIGHT) * 100).toFixed(2)}%`,
  };
};

/**
 * `cards` (the default): a tinted panel where the members sit as small white
 * cards (a round 48px avatar, the name, the role) around a hub, an accent disc
 * in the site's faint rings, each card tied to it by a dotted line whose dots
 * flow outwards. From 1024px the cards are spread on an ellipse
 * round it and each one hovers on its own slow rhythm; below, they stack two
 * across, then one. Each card opens the member's author page, where the bio is;
 * the avatar travels there (SharedElement).
 */
const TeamCards = ({ fragment, globalPageProps }: Props) => {
  const { showcasedMembers: members } = readFragment(
    TeamSectionFragment,
    fragment,
  );
  const orbit = members.length >= 3 && members.length <= MAX_ORBIT;

  return (
    <section className="panel panel-tint relative overflow-hidden py-14 sm:py-16 lg:py-10">
      <div className="container-page">
        <ul
          className={
            orbit
              ? `${styles.stage} grid gap-3 sm:grid-cols-2 lg:block`
              : 'grid gap-3 sm:grid-cols-2 lg:grid-cols-4'
          }
        >
          {orbit && (
            // A dotted line from the hub to each card, under the cards
            <li aria-hidden="true" className={styles.lines}>
              <svg aria-hidden="true">
                {members.map((member, index) => {
                  const end = orbitPoint(index, members.length);
                  return (
                    <line
                      key={member.id}
                      x1="50%"
                      y1="50%"
                      x2={end.x}
                      y2={end.y}
                      className={styles.line}
                      style={{ '--i': index } as CSSProperties}
                    />
                  );
                })}
              </svg>
            </li>
          )}
          {orbit && (
            <li aria-hidden="true" className={`${styles.hub} reveal`} />
          )}
          {members.map((member, index) => {
            const href = authorUrl(globalPageProps, member.slug);
            const style = {
              ...(orbit ? orbitPosition(index, members.length) : {}),
              // Each card on its own rhythm, so they never move together
              '--float-time': `${8 + (index % 4) * 1.3}s`,
              '--float-delay': `${-index * 1.7}s`,
            } as CSSProperties;

            return (
              <li
                key={member.id}
                style={style}
                className={orbit ? `${styles.card} reveal` : 'reveal'}
              >
                <div className={styles.float}>
                  <AppLink
                    href={href}
                    className="group flex items-center gap-3.5 rounded-card bg-surface p-3 pr-5 shadow-float transition-transform duration-200 ease-[cubic-bezier(0.2,0.7,0.2,1)] motion-safe:hover:-translate-y-1"
                  >
                    <SharedElement kind="portrait" href={href}>
                      <Avatar
                        image={member.avatar?.responsiveImage}
                        name={member.name}
                        size={48}
                      />
                    </SharedElement>
                    <span className="min-w-0">
                      <span className="block truncate font-semibold text-[0.9375rem] text-fg leading-snug tracking-[-0.01em] transition-colors duration-150 group-hover:text-accent-ink">
                        {member.name}
                      </span>
                      {member.role && (
                        <span className="block truncate text-small text-fg-muted">
                          {member.role}
                        </span>
                      )}
                    </span>
                  </AppLink>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default TeamCards;
