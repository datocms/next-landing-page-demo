type Props = {
  name: string;
  title?: string | null;
};

/** The reviewer's name over their title (when set). Place inside a grid so the lines stack */
const ReviewerByline = ({ name, title }: Props) => (
  <>
    <span className="text-[15px] leading-[1.6] font-medium text-ink">
      {name}
    </span>
    {title && (
      <span className="text-caption leading-[1.6] text-ink-3">{title}</span>
    )}
  </>
);

export default ReviewerByline;
