export default function transformDate(dateStr: string) {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
    date,
  );
  const day = date.getDate();
  return `${month} ${day}, ${year}`;
}
