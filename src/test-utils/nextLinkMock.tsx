import React from "react";

type LinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string | { pathname?: string };
  children: React.ReactNode;
};

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, children, ...props }, ref) => {
    const resolvedHref = typeof href === "string" ? href : href.pathname;
    return (
      <a ref={ref} href={resolvedHref} {...props}>
        {children}
      </a>
    );
  },
);

Link.displayName = "NextLinkMock";

export default Link;
