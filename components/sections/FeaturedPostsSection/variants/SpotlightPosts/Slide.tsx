import { stripStega } from '@datocms/content-link';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import AuthorAvatar from '@/components/posts/AuthorAvatar';
import PostMeta from '@/components/posts/PostMeta';
import { cn } from '@/utils/cn';
import type { ItemHeadingLevel } from '@/utils/headingLevel';
import type { SpotlightPost } from './types';

type Author = NonNullable<SpotlightPost['author']>;

type Props = {
  post: SpotlightPost;
  isActive: boolean;
  /** The slide's accessible name, such as "2 of 5" */
  label: string;
  /** The slide's aria-roledescription ("slide") */
  roleDescription: string;
  readMoreLabel: string;
  headingLevel: ItemHeadingLevel;
};

// The outgoing slide fades out first, then the incoming one fades (and, with motion allowed, rises) in
const ENTER_TRANSITION =
  'opacity 200ms var(--ease-out-quint) 100ms, translate 200ms var(--ease-out-quint) 100ms';
const EXIT_TRANSITION =
  'opacity 100ms var(--ease-standard), translate 0s linear 100ms';

/** The author's avatar in a tone ring, the name linking to the author page, and the bio */
const Byline = ({ author }: { author: Author }) => (
  <div className="mt-6 flex min-w-0 items-center gap-3">
    {author.picture && (
      <AuthorAvatar
        image={author.picture}
        sizes="40px"
        ringName={author.name}
        className="size-10 shrink-0"
        photoClassName="block"
      />
    )}
    <div className="min-w-0">
      <Link
        href={author.href}
        className="hit-44 block w-fit text-[15px] leading-snug font-medium text-ink underline decoration-transparent underline-offset-[3px] transition-[text-decoration-color] duration-200 hover:decoration-current"
      >
        {author.name}
      </Link>
      {author.bio && <p className="text-caption text-ink-3">{author.bio}</p>}
    </div>
  </div>
);

/**
 * One post's story: meta, title, description, byline and a read more button.
 * Every slide shares one grid cell; the inactive ones turn invisible and inert.
 */
const Slide = ({
  post,
  isActive,
  label,
  roleDescription,
  readMoreLabel,
  headingLevel: Heading,
}: Props) => {
  return (
    // biome-ignore lint/a11y/useSemanticElements: a carousel slide is an ARIA group, not a form fieldset
    <div
      role="group"
      aria-roledescription={roleDescription}
      aria-label={label}
      inert={!isActive}
      style={{
        transition: isActive ? ENTER_TRANSITION : EXIT_TRANSITION,
      }}
      className={cn(
        'flex flex-col items-start [grid-area:1/1]',
        isActive
          ? 'opacity-100'
          : 'pointer-events-none opacity-0 motion-safe:translate-y-2',
      )}
    >
      <PostMeta tag={post.tag} date={post.date} />

      <Heading className="mt-4 text-balance text-h3-lg text-ink">
        <Link
          href={post.href}
          data-slide-title
          className="underline decoration-transparent decoration-1 underline-offset-[3px] transition-[text-decoration-color] duration-200 hover:decoration-current"
        >
          {post.title}
        </Link>
      </Heading>

      {post.description && (
        <p className="mt-3 line-clamp-3 text-lead text-ink-2">
          {post.description}
        </p>
      )}

      {post.author && <Byline author={post.author} />}

      <Link
        href={post.href}
        className="btn btn-ink mt-7 max-md:h-12 max-md:w-full"
      >
        {readMoreLabel}
        <span className="sr-only">: {stripStega(post.title)}</span>
        <ArrowRight
          aria-hidden="true"
          strokeWidth={1.75}
          className="btn-arrow rtl:rotate-180"
        />
      </Link>
    </div>
  );
};

export default Slide;
