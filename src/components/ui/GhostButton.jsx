import { Link } from 'react-router-dom';

export default function GhostButton({
  children,
  onClick,
  to,
  className = '',
  type = 'button',
  ...props
}) {
  const styles =
    'inline-flex cursor-pointer items-center justify-center rounded-full border-[1.5px] border-heading bg-transparent px-5 py-2 text-sm font-medium text-heading shadow-sm transition-all duration-200 hover:border-[#C4956A] hover:bg-white/60 hover:text-heading hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)] active:scale-[0.98]';

  if (to) {
    return (
      <Link to={to} className={`${styles} ${className}`} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={`${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}
