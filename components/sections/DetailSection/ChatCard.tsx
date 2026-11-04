import { cn } from '@/utils/cn';

type Props = {
  /** Placement (absolute offsets) */
  className?: string;
};

/** Wordless chat card pinned to the Detail photo: an incoming bubble with an avatar, then a reply. Decorative */
const ChatCard = ({ className }: Props) => (
  <div aria-hidden="true" className={cn('chat-card float tone-3', className)}>
    <div className="chat-card-row">
      <span className="chat-card-avatar tone-1" />
      <span className="chat-card-bubble">
        <i />
        <i />
      </span>
    </div>
    <span className="chat-card-bubble chat-card-reply">
      <i />
      <i />
    </span>
  </div>
);

export default ChatCard;
