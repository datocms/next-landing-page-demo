import { cn } from '@/utils/cn';

type Props = {
  /** Placement (absolute offsets) */
  className?: string;
};

/** Wordless chat card pinned to the Detail photo: an incoming bubble with an avatar, then a reply. Decorative */
const ChatCard = ({ className }: Props) => (
  <div aria-hidden="true" className={cn('cs-chat float tone-3', className)}>
    <div className="cs-chat-row">
      <span className="cs-chat-av tone-1" />
      <span className="cs-chat-b">
        <i />
        <i />
      </span>
    </div>
    <span className="cs-chat-b cs-chat-me">
      <i />
      <i />
    </span>
  </div>
);

export default ChatCard;
