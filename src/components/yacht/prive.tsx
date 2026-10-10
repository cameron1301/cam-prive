import { useState, type ReactNode } from "react";
import { GuestLayout, BrandMark } from "@/components/yacht/chrome";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";

const HERO = "/yacht/approved/01_HERO_EXTERIOR_APPROVED.png";
const BRIDGE = "/yacht/approved/02_COMMAND_BRIDGE_APPROVED.png";
const COCKPIT = "/yacht/approved/03_COCKPIT_APPROVED.png";
const EXTERIOR = "/yacht/approved/04_EXTERIOR_GALLERY_APPROVED.png";
const GALLEY = "/yacht/approved/05_GALLEY_KITCHEN_APPROVED.png";
const SALON = "/yacht/approved/06_DINING_SALON_APPROVED.png";

const pill =
  "inline-flex h-12 items-center justify-center gap-2 rounded-[2px] px-6 text-[12px] font-semibold tracking-[0.08em] uppercase no-underline transition-opacity duration-200 hover:opacity-90 lg:text-[13px]";

export function PriveHome() {
  return (
    <div className="bg-white text-[#07141d]">
      <HomeHeader />
      <HomeHero />
      <HomeIntro />
      <HomeFeature />
      <HomeEscape />
      <HomeStay />
      <HomePlan />
      <HomeClose />
      <Welcome />
    </div>
  );
}

function HomeHeader() {
  const [open, setOpen] = useState(false);
  const link = "text-[12px] font-medium tracking-[0.08em] uppercase no-underline";
  return (
    <header className="sticky top-0 z-40 border-b border-[#ded9d0]/80 bg-white">
      <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between px-5 lg:h-[84px] lg:px-12">
        <Link to="/" className="no-underline">
          <BrandMark />
        </Link>
        <nav className="hidden items-center gap-7 lg:flex">
          <Link to="/escape" className={link}>Experiences</Link>
          <Link to="/profile" className={link}>My Invitation</Link>
          <Link to="/stay" className={link}>My Stay</Link>
        </nav>
        <button type="button" className="grid size-11 place-items-center lg:hidden" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((v) => !v)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open ? (
        <div className="border-t border-[#ded9d0] bg-white px-5 py-2 lg:hidden">
          <Link to="/escape" className="block py-3 text-[13px] tracking-[0.08em] uppercase no-underline" onClick={() => setOpen(false)}>Experiences</Link>
          <Link to="/profile" className="block py-3 text-[13px] tracking-[0.08em] uppercase no-underline" onClick={() => setOpen(false)}>My Invitation</Link>
          <Link to="/stay" className="block py-3 text-[13px] tracking-[0.08em] uppercase no-underline" onClick={() => setOpen(false)}>My Stay</Link>
        </div>
      ) : null}
    </header>
  );
}

function HomeHero() {
  return (
    <section className="relative h-[74vh] min-h-[620px] max-h-[820px] overflow-hidden bg-[#07141d] lg:h-[78vh] lg:min-h-[650px]">
      <img src="/yacht/hero-frame.jpg" alt="The Bay Escape at Sierra Point Harbor" className="absolute inset-0 h-full w-full object-cover object-center" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07141d]/55 via-[#07141d]/10 via-40% to-transparent" />
      <div className="absolute right-5 bottom-[38px] left-5 max-w-[600px] text-white lg:right-auto lg:bottom-16 lg:left-12">
        <p className="text-[11px] font-semibold tracking-[0.14em] uppercase">CAM Privé</p>
        <p className="mt-3 text-[11px] font-semibold tracking-[0.14em] uppercase">The Bay Escape</p>
        <h1 className="mt-3 text-[42px] leading-[0.98] text-white lg:text-[66px]">
          <span className="block">Your Weekend</span>
          <span className="block">on the Bay</span>
        </h1>
        <p className="mt-4 max-w-[480px] text-[15px] leading-[1.55] text-white/90 lg:text-[16px] lg:leading-[1.65]">
          A private dockside retreat at Sierra Point Harbor, thoughtfully created for our invited guests.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link to="/escape" className="text-[12px] font-semibold tracking-[0.08em] text-white uppercase no-underline">
            Discover the experience
          </Link>
          <Link to="/book" className="inline-flex h-[46px] items-center rounded-[2px] bg-white px-6 text-[12px] font-semibold tracking-[0.08em] text-[#07141d] uppercase no-underline">
            Check availability
          </Link>
        </div>
      </div>
    </section>
  );
}

function HomeIntro() {
  return (
    <section id="about" className="bg-[#f7f4ee] px-5 py-14 lg:px-12 lg:py-[90px]">
      <div className="mx-auto max-w-[1280px]">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-[#6d6a64] uppercase">CAM Privé</p>
        <h2 className="mt-4 max-w-xl text-[32px] leading-[1.05] lg:text-[48px]">
          A different kind
          <span className="block">of invitation.</span>
        </h2>
        <p className="mt-6 max-w-[560px] text-[15px] leading-[1.6] text-[#6d6a64] lg:text-[16px] lg:leading-[1.65]">
          CAM Privé brings together thoughtfully curated experiences for the people we value. From quiet waterfront escapes to memorable occasions, each invitation is an opportunity to enjoy something special. Our first experience is The Bay Escape.
        </p>
      </div>
    </section>
  );
}

function HomeFeature() {
  return (
    <section id="experiences" className="bg-white px-5 pt-14 lg:px-12 lg:pt-20">
      <div id="bay" className="mx-auto max-w-[1280px]">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-[#6d6a64] uppercase">The first experience</p>
        <h2 className="mt-4 text-[32px] leading-[1.05] lg:text-[48px]">The Bay Escape</h2>
        <p className="mt-4 max-w-[560px] text-[16px] leading-[1.65] text-[#6d6a64]">Your private waterfront retreat.</p>
        <div className="mt-8 grid grid-cols-2 gap-2 lg:mt-10 lg:grid-cols-12 lg:gap-3">
          <HomeShot src={BRIDGE} title="Command bridge" className="col-span-2 lg:col-span-5" imageClass="h-[240px] lg:h-[320px]" />
          <HomeShot src={COCKPIT} title="Cockpit" className="lg:col-span-4" imageClass="h-[168px] lg:h-[320px]" />
          <HomeShot src={EXTERIOR} title="Exterior" video className="lg:col-span-3" imageClass="h-[168px] lg:h-[320px]" />
          <HomeShot src={GALLEY} title="Galley" className="order-5 col-span-2 lg:order-none lg:col-span-6" imageClass="h-[220px] lg:h-[380px]" />
          <HomeShot src={SALON} title="Salon" className="order-4 col-span-2 lg:order-none lg:col-span-6" imageClass="h-[260px] lg:h-[380px]" />
        </div>
      </div>
    </section>
  );
}

function HomeShot({ src, title, video = false, className = "", imageClass = "" }: { src: string; title: string; video?: boolean; className?: string; imageClass?: string }) {
  const [playing, setPlaying] = useState(false);
  const img = "h-full w-full object-cover";
  return (
    <figure className={className}>
      <div className={`relative overflow-hidden ${imageClass}`}>
        {video && playing ? (
          <video src="/yacht/exterior.mp4" poster={src} className={img} controls autoPlay playsInline />
        ) : video ? (
          <button type="button" className="block h-full w-full" aria-label="Play exterior view" onClick={() => setPlaying(true)}>
            <img src={src} alt="" className={img} />
          </button>
        ) : (
          <img src={src} alt={title} className={img} />
        )}
      </div>
      <figcaption className="mt-2 text-[11px] font-semibold tracking-[0.14em] text-[#6d6a64] uppercase">{title}</figcaption>
    </figure>
  );
}

function HomeEscape() {
  return (
    <section className="mt-14 bg-[#07141d] px-5 py-16 text-[#f7f4ee] lg:mt-20 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-[1280px]">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-[#b6a27a] uppercase">The Bay Escape</p>
        <h2 className="mt-4 max-w-xl text-[32px] leading-[1.05] text-[#f7f4ee] lg:text-[48px]">Make it your escape.</h2>
        <p className="mt-5 max-w-xl font-display text-[26px] leading-[1.15] text-[#f7f4ee] lg:text-[32px]">Stay for a night. Linger a little longer.</p>
        <p className="mt-6 max-w-[560px] text-[16px] leading-[1.65] text-white/75">
          Come aboard for a quiet evening by the water, turn it into a weekend away, or settle in for a little longer.
        </p>
        <p className="mt-4 max-w-[560px] text-[16px] leading-[1.65] text-white/75">
          The Bay Escape is available for stays of up to three consecutive nights, subject to availability and your Privé invitation.
        </p>
        <Link to="/book" className="mt-10 inline-flex h-[46px] items-center rounded-[2px] bg-white px-6 text-[12px] font-semibold tracking-[0.08em] text-[#07141d] uppercase no-underline">
          Check availability
        </Link>
      </div>
    </section>
  );
}

function HomeStay() {
  const facts = [
    ["Recommended", "2 adults"],
    ["Maximum stay", "Up to 3 nights"],
    ["Location", "Sierra Point Harbor, Brisbane, California"],
    ["Experience", "Private dockside stay"],
    ["Check-in", "3:00 PM"],
    ["Checkout", "11:00 AM"],
  ];
  return (
    <section className="bg-white px-5 py-16 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-[1280px]">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-[#6d6a64] uppercase">Your stay</p>
        <h2 className="mt-4 max-w-3xl text-[32px] leading-[1.05] lg:text-[48px]">Everything you need for a relaxing stay.</h2>
        <dl className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {facts.map(([title, body]) => (
            <div key={title} className="border-t border-[#ded9d0] pt-4">
              <dt className="text-[12px] font-semibold tracking-[0.12em] text-[#6d6a64] uppercase">{title}</dt>
              <dd className="mt-2 text-[22px] leading-tight lg:text-[26px]">{body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function HomePlan() {
  return (
    <section className="bg-[#f7f4ee] px-5 py-16 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-[1280px]">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-[#6d6a64] uppercase">Availability</p>
        <h2 className="mt-4 text-[32px] leading-[1.05] lg:text-[48px]">Plan your escape</h2>
        <p className="mt-5 max-w-[460px] text-[15px] leading-[1.6] text-[#6d6a64] lg:text-[16px]">
          Choose the dates that work best for you. We'll take care of the details.
        </p>
        <Link to="/book" className="mt-8 inline-flex h-[46px] items-center rounded-[2px] bg-[#07141d] px-6 text-[12px] font-semibold tracking-[0.08em] text-white uppercase no-underline">
          Check availability
        </Link>
      </div>
    </section>
  );
}

function HomeClose() {
  return (
    <section className="relative h-[500px] overflow-hidden bg-[#07141d] lg:h-[600px]">
      <img src="/yacht/hero-frame.jpg" alt="" className="absolute inset-0 h-full w-full object-cover object-[center_40%]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#07141d]/70 via-[#07141d]/15 to-transparent" />
      <div className="absolute right-5 bottom-10 left-5 max-w-[600px] text-white lg:bottom-16 lg:left-12">
        <p className="text-[11px] font-semibold tracking-[0.14em] uppercase">The Bay Escape</p>
        <h2 className="mt-3 text-[32px] leading-[1.05] text-white lg:text-[48px]">Your weekend is waiting.</h2>
        <Link to="/book" className="mt-6 inline-flex h-[46px] items-center rounded-[2px] border border-white px-6 text-[12px] font-semibold tracking-[0.08em] text-white uppercase no-underline">
          Check availability
        </Link>
      </div>
    </section>
  );
}

export function EscapePage() {
  return (
    <GuestLayout>
      <PhotoHero
        eyebrow="The Bay Escape"
        title={"Your Private\nWaterfront Retreat"}
        body="Step aboard The Bay Escape, a peaceful dockside retreat overlooking Sierra Point Harbor. Unwind by the water, enjoy the marina atmosphere, and spend time with someone special. The yacht remains securely docked throughout your visit."
        cta={{ href: "#gallery", label: "View the yacht" }}
      />
      <Gallery />
      <Yacht />
      <Rooms />
      <YourStay />
      <Weekend />
      <Itinerary />
      <Rules />
      <Closing />
    </GuestLayout>
  );
}

export function Showcase({ nav, children }: { nav: "home" | "escape" | "book"; children: ReactNode }) {
  return (
    <div className="text-[#0b1d2a] lg:bg-[#c5d6e4]">
      <img src={HERO} alt="" className="pointer-events-none fixed inset-0 -z-10 hidden h-full w-full scale-110 object-cover opacity-70 blur-md lg:block" />
      <div className="bg-white lg:mx-auto lg:my-5 lg:max-w-6xl lg:overflow-hidden lg:rounded-[1.6rem] lg:shadow-[0_24px_70px_-28px_rgba(7,24,48,0.55)]">
        <ShowcaseHeader nav={nav} />
        {children}
      </div>
    </div>
  );
}

function ShowcaseHeader({ nav }: { nav: "home" | "escape" | "book" }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="bg-white">
      <div className="flex items-center justify-between gap-4 px-4 py-3 lg:px-7 lg:py-4">
        <Link to="/" className="no-underline">
          <BrandMark />
        </Link>
        <nav className="hidden items-center gap-7 text-[13px] font-medium tracking-[0.04em] text-[#1c2b42] lg:flex">
          {nav === "home" ? (
            <>
              <a href="#experiences" className="no-underline">Experiences</a>
              <Link to="/escape" className="no-underline">The Bay Escape</Link>
            </>
          ) : (
            <>
              <Link to="/" className="no-underline">Home</Link>
              <a href="/escape#gallery" className="no-underline">Gallery</a>
              <a href="/escape#yacht" className="no-underline">The Yacht</a>
              <a href="/escape#stay" className="no-underline">Your Stay</a>
              <a href="/escape#before" className="no-underline">Before You Go</a>
            </>
          )}
          <Link to="/book" className={`${pill} bg-[#16324f] text-white`}>Book</Link>
        </nav>
        <div className="flex items-center gap-2">
          <button type="button" className="grid size-11 place-items-center lg:hidden" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((v) => !v)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {open ? (
        <div className="space-y-1 border-t border-[#ded9d0] px-4 py-3 lg:hidden">
          <Link to="/" className="block py-3 no-underline">Home</Link>
          <Link to="/escape" className="block py-3 no-underline">The Bay Escape</Link>
          <Link to="/book" className="block py-3 no-underline">Book</Link>
          <Link to="/stay" className="block py-3 no-underline">Your stay</Link>
        </div>
      ) : null}
    </header>
  );
}

function PhotoHero({
  eyebrow,
  title,
  body,
  cta,
}: {
  eyebrow: string;
  title: string;
  body: string;
  cta: { href: string; label: string };
}) {
  const lines = title.split("\n");
  return (
    <section className="relative h-[70vh] min-h-[520px] max-h-[760px] overflow-hidden bg-[#07141d]">
      <img src="/yacht/hero-frame.jpg" alt="The Bay Escape at Sierra Point Harbor" className="absolute inset-0 h-full w-full object-cover object-center" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07141d]/60 via-[#07141d]/10 via-45% to-transparent" />
      <div className="absolute right-5 bottom-10 left-5 max-w-[640px] text-white lg:bottom-16 lg:left-12">
        <p className="text-[11px] font-semibold tracking-[0.14em] uppercase">{eyebrow}</p>
        <h1 className="mt-3 text-[42px] leading-[0.98] text-white lg:text-[64px]">
          {lines.map((line) => (
            <span key={line} className="block">{line}</span>
          ))}
        </h1>
        <p className="mt-4 max-w-[480px] text-[16px] leading-[1.65] text-white/90">{body}</p>
        <a href={cta.href} className="mt-6 inline-flex h-[46px] items-center rounded-[2px] bg-white px-6 text-[12px] font-semibold tracking-[0.08em] text-[#07141d] uppercase no-underline">
          {cta.label}
        </a>
      </div>
    </section>
  );
}

function Gallery() {
  return (
    <section id="gallery" className="bg-white px-5 py-14 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-[1280px]">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-[#6d6a64] uppercase">Aboard</p>
        <h2 className="mt-4 text-[32px] leading-[1.05] lg:text-[48px]">The yacht</h2>
        <div className="mt-8 grid grid-cols-2 gap-2 lg:mt-10 lg:grid-cols-12 lg:gap-3">
          <Shot src={BRIDGE} title="Command bridge" className="col-span-2 lg:col-span-5" imageClass="h-[240px] lg:h-[320px]" />
          <Shot src={COCKPIT} title="Cockpit" className="lg:col-span-4" imageClass="h-[168px] lg:h-[320px]" />
          <Shot src={EXTERIOR} title="Exterior" video className="lg:col-span-3" imageClass="h-[168px] lg:h-[320px]" />
          <Shot src={GALLEY} title="Galley" className="col-span-2 lg:col-span-6" imageClass="h-[220px] lg:h-[380px]" />
          <Shot src={SALON} title="Salon" className="col-span-2 lg:col-span-6" imageClass="h-[260px] lg:h-[380px]" />
        </div>
      </div>
    </section>
  );
}

function Shot({ src, title, video = false, className = "", imageClass = "" }: { src: string; title: string; video?: boolean; className?: string; imageClass?: string }) {
  const [playing, setPlaying] = useState(false);
  const img = "h-full w-full object-cover";
  return (
    <figure className={className}>
      <div className={`relative overflow-hidden ${imageClass}`}>
        {video && playing ? (
          <video src="/yacht/exterior.mp4" poster={src} className={img} controls autoPlay playsInline />
        ) : video ? (
          <button type="button" className="block h-full w-full" aria-label="Play exterior view" onClick={() => setPlaying(true)}>
            <img src={src} alt="" className={img} />
          </button>
        ) : (
          <img src={src} alt={title} className={img} />
        )}
      </div>
      <figcaption className="mt-2 text-[11px] font-semibold tracking-[0.14em] text-[#6d6a64] uppercase">{title}</figcaption>
    </figure>
  );
}

function Yacht() {
  return (
    <section id="yacht" className="bg-[#f7f4ee] px-5 py-16 lg:px-12 lg:py-24">
      <div className="mx-auto grid max-w-[1280px] items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.14em] text-[#6d6a64] uppercase">Where she lives</p>
          <h2 className="mt-4 text-[32px] leading-[1.05] lg:text-[48px]">Sierra Point Harbor</h2>
          <p className="mt-5 max-w-[520px] text-[16px] leading-[1.65] text-[#6d6a64]">
            Dock 5, Slip 36, Brisbane. The yacht remains securely docked throughout your visit. Engines stay off, and she never leaves the slip.
          </p>
        </div>
        <img src={HERO} alt="" className="aspect-[16/10] w-full object-cover object-[80%_center]" />
      </div>
    </section>
  );
}

function Rooms() {
  const rooms = [
    [BRIDGE, "Command bridge", "The upper deck, with the original helm and wraparound seating. The best seat for sunset."],
    [SALON, "Salon", "An L-shaped seat, a table, and the forward berth just beyond. Two adults sleep comfortably."],
    [GALLEY, "Galley", "A sink, a refrigerator, a microwave, and coffee. Meals are brought aboard or enjoyed ashore."],
    [COCKPIT, "Cockpit", "Outdoor chairs at the stern, beside the door into the cabin and the ladder to the bridge."],
  ] as const;
  return (
    <section className="space-y-16 bg-white px-5 py-16 lg:space-y-24 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-[1280px] space-y-16 lg:space-y-24">
        {rooms.map(([src, title, body], i) => (
          <article key={title} className="grid items-center gap-6 lg:grid-cols-2 lg:gap-16">
            <img src={src} alt="" className={`aspect-[16/10] w-full object-cover ${i % 2 ? "lg:order-2" : ""}`} />
            <div>
              <h2 className="text-[32px] lg:text-[42px]">{title}</h2>
              <p className="mt-4 max-w-[480px] text-[16px] leading-[1.65] text-[#6d6a64]">{body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function YourStay() {
  const facts = [
    ["Recommended", "2 adults"],
    ["Maximum stay", "Up to 3 nights"],
    ["Location", "Sierra Point Harbor, Brisbane, California"],
    ["Experience", "Private dockside stay"],
    ["Check-in", "3:00 PM"],
    ["Checkout", "11:00 AM"],
  ];
  return (
    <section id="stay" className="bg-white px-5 py-16 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-[1280px]">
      <p className="text-[11px] font-semibold tracking-[0.14em] text-[#6d6a64] uppercase">Your stay</p>
      <h2 className="mt-4 text-[32px] leading-[1.05] lg:text-[48px]">Everything you need for a relaxing stay</h2>
      <dl className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {facts.map(([title, body]) => (
          <div key={title} className="border-t border-[#ded9d0] pt-4">
            <dt className="text-[12px] font-semibold tracking-[0.12em] text-[#6d6a64] uppercase">{title}</dt>
            <dd className="mt-2 text-[22px] leading-tight lg:text-[26px]">{body}</dd>
          </div>
        ))}
      </dl>
        <Link to="/book" className={`${pill} mt-10 bg-[#07141d] text-white`}>Check availability</Link>
      </div>
    </section>
  );
}

function Weekend() {
  const items = [
    "Sunset on the command bridge",
    "A quiet afternoon by the water",
    "Waterfront walks",
    "Coffee aboard, overlooking the marina",
    "Dinner ashore, or a meal you bring aboard",
    "Another evening at the same slip",
  ];
  return (
    <section className="bg-[#07141d] px-5 py-16 text-[#f7f4ee] lg:px-12 lg:py-24">
      <div className="mx-auto max-w-[1280px]">
      <p className="text-[11px] font-semibold tracking-[0.14em] text-[#b6a27a] uppercase">Your weekend</p>
      <h2 className="mt-4 text-[32px] leading-[1.05] text-[#f7f4ee] lg:text-[48px]">How the time is spent</h2>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item} className="border-t border-white/15 pt-3 text-[16px]">{item}</li>
        ))}
      </ul>
      </div>
    </section>
  );
}

function Itinerary() {
  return (
    <section className="bg-[#f7f4ee] px-5 py-16 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-[760px]">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-[#6d6a64] uppercase">The Bay Escape</p>
        <h2 className="mt-4 text-[32px] leading-[1.05] lg:text-[48px]">Make it your escape.</h2>
        <p className="mt-5 font-display text-[26px] leading-[1.15] lg:text-[32px]">Stay for a night. Linger a little longer.</p>
        <p className="mt-6 max-w-[560px] text-[16px] leading-[1.7] text-[#6d6a64]">
          Come aboard for a quiet evening by the water, turn it into a weekend away, or settle in for a little longer.
        </p>
        <p className="mt-4 max-w-[560px] text-[16px] leading-[1.7] text-[#6d6a64]">
          The Bay Escape is available for stays of up to three consecutive nights, subject to availability and your Privé invitation.
        </p>
        <Link to="/book" className={`${pill} mt-8 bg-[#07141d] text-white`}>Check availability</Link>
      </div>
    </section>
  );
}

function Rules() {
  return (
    <section id="before" className="bg-white px-5 py-16 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-[1280px]">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-[#6d6a64] uppercase">Stay guide</p>
        <h2 className="mt-4 max-w-xl text-[32px] leading-[1.05] lg:text-[48px]">A few things to know.</h2>
        <p className="mt-5 max-w-xl text-[16px] leading-[1.7] text-[#6d6a64]">
          The Bay Escape is simple, relaxing, and easy to enjoy. A short guide covers arrival, life aboard, the marina, and the morning you leave.
        </p>
        <Link to="/guide" className={`${pill} mt-8 bg-[#07141d] text-white`}>Read the stay guide</Link>
      </div>
    </section>
  );
}

function Closing() {
  return (
    <section className="relative min-h-[28rem]">
      <img src="/yacht/hero-frame.jpg" alt="" className="absolute inset-0 h-full w-full object-cover object-center" />
      <div className="absolute inset-0 bg-[#07141d]/40" />
      <div className="relative flex min-h-[28rem] flex-col justify-end px-5 py-12 lg:px-10">
        <h2 className="max-w-xl text-[35px] text-white lg:text-[48px]">Your weekend is waiting.</h2>
        <Link to="/book" className="mt-6 inline-flex h-[46px] w-fit items-center rounded-[2px] border border-white px-6 text-[12px] font-semibold tracking-[0.08em] text-white uppercase no-underline">Check availability</Link>
      </div>
    </section>
  );
}

function Welcome() {
  return (
    <section className="bg-[#07141d] px-5 py-12 text-[#f7f4ee] lg:px-12 lg:py-16">
      <div className="mx-auto max-w-[720px]">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-[#b6a27a] uppercase">CAM Privé</p>
        <h2 className="mt-3 text-[32px] leading-[1.05] lg:text-[44px]">An invitation</h2>
        <p className="mt-3 max-w-md text-[16px] leading-[1.6] text-white/80">
          Benefits and reservations are private. Open the link we sent you. Names are never listed here.
        </p>
        <Link
          to="/profile"
          className="mt-6 inline-flex h-12 items-center rounded-[2px] border border-white px-6 text-[12px] font-semibold tracking-[0.08em] text-white uppercase no-underline"
        >
          Open your invitation
        </Link>
      </div>
    </section>
  );
}
