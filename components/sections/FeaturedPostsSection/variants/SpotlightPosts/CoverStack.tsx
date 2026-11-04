import PostCover from '@/components/posts/PostCover';
import { cn } from '@/utils/cn';
import type { SpotlightPost } from './types';

type Props = {
  posts: SpotlightPost[];
  activeIndex: number;
};

/** Every post's cover stacked in one frame: only the active one shows, and they crossfade on a change */
const CoverStack = ({ posts, activeIndex }: Props) => (
  <div className="photo aspect-[16/10]">
    {posts.map((post, index) => (
      <div
        key={post.id}
        aria-hidden={index !== activeIndex}
        className={cn(
          'absolute inset-0 transition-opacity duration-300 ease-standard',
          index === activeIndex ? 'opacity-100' : 'opacity-0',
        )}
      >
        <PostCover
          cover={post.cover}
          title={post.title}
          sizes="(min-width: 1024px) 620px, 100vw"
          zoom={false}
        />
      </div>
    ))}
  </div>
);

export default CoverStack;
