import Image from "next/image";
import Logo from "@/components/Logo";

// Split card shared by the Login and Register Stitch screens: decorative photo panel left, form right.
export default function AuthLayout({ badge, badgeAside, eyebrow, headline, text, title, subtitle, children }) {
  return (
    <main className="flex flex-1 items-center justify-center bg-surface p-4 md:p-6">
      <div className="grid w-full max-w-content overflow-hidden rounded-xl bg-white shadow-modal lg:min-h-[720px] lg:grid-cols-12">
        {/* Decorative panel; hidden on small screens. */}
        <div className="relative hidden flex-col justify-between overflow-hidden p-12 text-white lg:col-span-5 lg:flex">
          <Image
            src="/images/auth-panel.jpg"
            alt=""
            fill
            // object-cover crops this wide photo to a tall panel, so it needs ~1320px of width to stay sharp.
            // Below lg the panel is hidden; "1px" makes the browser fetch only the tiniest variant there.
            sizes="(min-width: 1024px) 1320px, 1px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/40 to-ink/25" />
          <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />

          <div className="relative flex items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 backdrop-blur-md">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#9cf2e8]" />
              <span className="text-xs font-medium uppercase tracking-widest">{badge}</span>
            </span>
            {badgeAside && (
              <span className="text-xs font-semibold uppercase tracking-widest text-white/70">{badgeAside}</span>
            )}
          </div>

          <div className="relative">
            <p className="text-xs font-medium uppercase tracking-wider text-[#9cf2e8]">{eyebrow}</p>
            <h2 className="mt-2 text-4xl font-bold leading-tight tracking-tight">{headline}</h2>
            {text && <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/85">{text}</p>}
          </div>
        </div>

        <div className="flex flex-col justify-center px-6 py-10 sm:px-12 lg:col-span-7">
          <div className="mx-auto flex w-full max-w-[460px] flex-col gap-6">
            <div className="flex flex-col items-center text-center">
              <Logo />
              <h1 className="mt-4 text-2xl font-semibold tracking-tight text-ink">{title}</h1>
              <p className="mt-1 text-sm text-muted">{subtitle}</p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
