"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { Menu, X } from "lucide-react";

export const navItems = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Properties" },
  { href: "/projects", label: "Projects" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function DesktopNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Primary" className="hidden lg:block">
      <ul className="flex items-center gap-1">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative inline-flex min-h-11 items-center px-3 text-[0.9375rem] transition-colors hover:text-ink ${
                  active ? "text-ink" : "text-ink-2/80"
                }`}
              >
                {item.label}
                <span
                  aria-hidden
                  className={`absolute inset-x-3 bottom-2 h-px origin-left bg-ink transition-transform duration-300 ${
                    active ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function MobileNav({ brand, phone }: { brand: string; phone: { href: string; label: string } | null }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();
  const close = () => dialogRef.current?.close();

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="inline-flex size-12 items-center justify-center rounded-[2px] text-ink hover:bg-paper-2"
        aria-haspopup="dialog"
      >
        <Menu aria-hidden className="size-6" />
        <span className="sr-only">Open menu</span>
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Site menu"
        className="m-0 ml-auto h-dvh max-h-none w-full max-w-sm bg-paper p-0 text-ink backdrop:backdrop-blur-[1px] open:flex open:flex-col"
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
      >
        <div className="flex h-18 items-center justify-between border-b border-line px-4">
          <span className="font-display text-2xl">{brand}</span>
          <button
            type="button"
            onClick={close}
            className="inline-flex size-12 items-center justify-center rounded-[2px] hover:bg-paper-2"
          >
            <X aria-hidden className="size-6" />
            <span className="sr-only">Close menu</span>
          </button>
        </div>
        <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-4 py-6">
          <ul>
            {navItems.map((item, i) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href} className="border-b border-line">
                  <Link
                    href={item.href}
                    onClick={close}
                    aria-current={active ? "page" : undefined}
                    className="flex min-h-16 items-baseline gap-4 py-4 font-display text-3xl"
                  >
                    <span className="w-6 font-sans text-xs text-muted tabular-nums">0{i + 1}</span>
                    <span className={active ? "underline decoration-1 underline-offset-8" : ""}>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="grid gap-3 border-t border-line p-4">
          <Link
            href="/contact"
            onClick={close}
            className="inline-flex min-h-12 items-center justify-center rounded-[2px] bg-forest px-6 font-medium text-paper"
          >
            Enquire now
          </Link>
          {phone && (
            <a
              href={phone.href}
              className="inline-flex min-h-12 items-center justify-center rounded-[2px] border border-ink/80 px-6 font-medium"
            >
              Call {phone.label}
            </a>
          )}
        </div>
      </dialog>
    </div>
  );
}
