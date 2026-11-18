import type { ResponsiveImageFragment } from '@/components/datocms/DatoImage/fragment';
import Avatar, { type AvatarSize } from '@/components/ui/Avatar';
import type { FragmentOf } from '@/lib/datocms/graphql';
import { cn } from '@/utils/cn';

type Props = {
  image?: FragmentOf<typeof ResponsiveImageFragment> | null;
  name: string;
  role?: string | null;
  avatarSize?: AvatarSize;
  /** Centres the avatar and the text (the spotlight quote) */
  centered?: boolean;
  className?: string;
};

/** Who said it: the round avatar, then the name (semibold) over the muted role */
const ReviewPerson = ({
  image,
  name,
  role,
  avatarSize = 40,
  centered = false,
  className,
}: Props) => (
  <div
    className={cn(
      'flex items-center gap-3 leading-[1.35]',
      centered && 'justify-center text-left',
      className,
    )}
  >
    <Avatar image={image} name={name} size={avatarSize} />
    <div className="min-w-0">
      <p className="font-semibold text-[0.90625rem] text-fg">{name}</p>
      {role && <p className="text-[0.84375rem] text-fg-muted">{role}</p>}
    </div>
  </div>
);

export default ReviewPerson;
