import Link from 'next/link';

const Button = ({ children, href, ...props }) => {
  if (href) {
    return (
      <Link href={href} {...props}>
        { children }
      </Link>
    );
  }

  return <button {...props}>{ children }</button>;
};

export default Button;
