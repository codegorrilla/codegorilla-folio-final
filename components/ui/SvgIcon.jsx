// components/ui/SvgIcon.jsx
/* eslint-disable @next/next/no-img-element */

/**
 * SvgIcon — thin wrapper for SVG icons served from /public.
 *
 * pointer-events-none is NOT applied by default so toolkit icons can receive
 * hover events for the custom cursor. Decorative/animated icons that should
 * not intercept mouse events must pass className="pointer-events-none" explicitly.
 */
const SvgIcon = ({ src, size = 32, className = "", ...props }) => (
  <img
    src={src}
    width={size}
    height={size}
    alt=""
    aria-hidden="true"
    className={`select-none ${className}`}
    {...props}
  />
);

export default SvgIcon;
