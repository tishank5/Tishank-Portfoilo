interface TypedLinkProps {
  href: string;
  text: string;
  className?: string;
}

export const TypedLink = ({ href, text, className = "" }: TypedLinkProps) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {text}
    </a>
  );
};
