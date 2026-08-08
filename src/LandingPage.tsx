// File: src/LandingPage.tsx
import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import "./landing.css";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  LinkIcon,
  QrCodeIcon,
  GlobeAltIcon,
  ChartBarIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  ArrowRightIcon,
  BoltIcon,
  ShieldCheckIcon,
  CursorArrowRaysIcon,
  UsersIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import Loading from "./Loading";
import Footer from "./Footer";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profileImg: string;
  links: string[];
}

const navigation = (isLoggedIn: boolean) => [
  { name: "Home", href: "/", current: true },
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "Links", href: "/links", current: false },
  ...(!isLoggedIn
    ? [
        { name: "Sign In", href: "/login", current: false },
        { name: "Sign Up", href: "/signup", current: false },
      ]
    : []),
];

function classNames(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/* ---------------------------------------------------------------------- */
/* Reveal-on-scroll wrapper — lightweight IntersectionObserver, no deps.   */
/* ---------------------------------------------------------------------- */

const Reveal: React.FC<{
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}> = ({ children, className = "", as = "div" }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const Tag = as as unknown as React.ElementType;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={classNames("sl-reveal", inView && "sl-in", className)}>
      {children}
    </Tag>
  );
};

/* ---------------------------------------------------------------------- */
/* Interactive URL-shortening demo — the centerpiece of the hero.         */
/* ---------------------------------------------------------------------- */

const DEMO_LONG_URLS = [
  "https://www.example.com/blog/posts/how-modern-teams-plan-quarterly-roadmaps",
  "https://accounts.example.com/dashboard/settings/notifications?ref=email",
  "https://shop.example.com/products/wireless-noise-cancelling-headphones",
];

const DEMO_SHORT_URLS = [
  "scissors.sh/qTr8Lm",
  "scissors.sh/nX2vPq",
  "scissors.sh/kD91Zw",
];

type DemoPhase = "typing" | "loading" | "done";

const UrlShortenerDemo: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<DemoPhase>("typing");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    if (phase === "typing") {
      timers.push(setTimeout(() => setPhase("loading"), 1400));
    } else if (phase === "loading") {
      timers.push(setTimeout(() => setPhase("done"), 900));
    } else if (phase === "done") {
      timers.push(
        setTimeout(() => {
          setIndex((i) => (i + 1) % DEMO_LONG_URLS.length);
          setPhase("typing");
        }, 2800)
      );
    }

    return () => timers.forEach(clearTimeout);
  }, [phase]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`https://${DEMO_SHORT_URLS[index]}`);
    } catch {
      /* clipboard not available — fail silently, purely cosmetic demo */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="sl-demo-stage">
      <div
        className="sl-orb sl-orb--green"
        style={{ width: 340, height: 340, top: "-8%", right: "-10%" }}
        aria-hidden="true"
      />
      <div
        className="sl-orb sl-orb--emerald"
        style={{ width: 260, height: 260, bottom: "-6%", left: "-8%" }}
        aria-hidden="true"
      />

      <div className="sl-float-chip sl-float-chip--one" aria-hidden="true">
        <CheckIcon /> Link created
      </div>
      <div className="sl-float-chip sl-float-chip--two" aria-hidden="true">
        <ChartBarIcon /> 1,204 clicks tracked
      </div>
      <div className="sl-float-chip sl-float-chip--three" aria-hidden="true">
        <QrCodeIcon /> QR code ready
      </div>

      <div className="sl-demo-card" role="group" aria-label="Interactive URL shortening demo">
        <div className="sl-demo-card-head">
          <div className="sl-demo-dots">
            <span />
            <span />
            <span />
          </div>
          <div className="sl-demo-badge">
            <span className="sl-demo-dot-live" /> Live preview
          </div>
        </div>

        <div className="sl-demo-field-label">Paste your long URL</div>
        <div className="sl-demo-input-row">
          <span className="sl-demo-input-text">
            {DEMO_LONG_URLS[index]}
            {phase === "typing" && <span className="sl-demo-caret" />}
          </span>
        </div>

        <div className="sl-demo-arrow-divider">
          <span className="sl-demo-arrow-line" />
          {phase === "loading" ? (
            <span className="sl-demo-spinner" />
          ) : (
            <LinkIcon width={14} height={14} />
          )}
          <span className="sl-demo-arrow-line" />
        </div>

        <div className="sl-demo-field-label">Your short link</div>
        <div className={classNames("sl-demo-result", phase === "done" && "sl-glow")}>
          <span className="sl-demo-result-text">
            {phase === "done" ? `https://${DEMO_SHORT_URLS[index]}` : "Waiting for it…"}
          </span>
          <button
            type="button"
            className="sl-demo-copy-btn"
            onClick={handleCopy}
            aria-label="Copy demo short link"
            disabled={phase !== "done"}
          >
            {copied ? <CheckIcon /> : <ClipboardDocumentIcon />}
          </button>
        </div>

        <div className="sl-demo-meta-row">
          <div className="sl-demo-meta-card">
            <div className="sl-demo-qr" aria-hidden="true">
              {Array.from({ length: 36 }).map((_, i) => (
                <span
                  key={i}
                  style={{
                    opacity: [0, 3, 5, 9, 14, 18, 21, 26, 30, 34].includes(i) ? 0.15 : 0.95,
                  }}
                />
              ))}
            </div>
            <div className="sl-demo-meta-label">QR code</div>
          </div>
          <div className="sl-demo-meta-card">
            <ChartBarIcon className="sl-demo-meta-icon" />
            <div className="sl-demo-meta-value">Live</div>
            <div className="sl-demo-meta-label">Analytics</div>
          </div>
          <div className="sl-demo-meta-card">
            <GlobeAltIcon className="sl-demo-meta-icon" />
            <div className="sl-demo-meta-value">Custom</div>
            <div className="sl-demo-meta-label">Alias</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------------- */
/* Animated stat — counts up once it scrolls into view.                   */
/* ---------------------------------------------------------------------- */

const AnimatedStat: React.FC<{ target: number; suffix?: string; prefix?: string }> = ({
  target,
  suffix = "",
  prefix = "",
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            const duration = 1400;
            const start = performance.now();
            const step = (now: number) => {
              const progress = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              setValue(Math.round(eased * target));
              if (progress < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
};

/* ---------------------------------------------------------------------- */
/* Landing page                                                           */
/* ---------------------------------------------------------------------- */

const LandingPage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const storedUserData = localStorage.getItem("user");

      if (storedUserData) {
        const user = JSON.parse(storedUserData);
        setUser(user);
      } else {
        console.error("Failed to fetch user data or no user data found");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleSignOut = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    window.location.reload();
  };

  if (loading) {
    return <Loading />;
  }

  const avatarSrc =
    isLoggedIn && user && user.profileImg
      ? user.profileImg
      : "https://cdn-icons-png.flaticon.com/512/847/847969.png";

  return (
    <div className="sl">
      <div className="sl-noise" aria-hidden="true" />

      {/* ---------------------------------------------------------------- */}
      {/* Navigation                                                      */}
      {/* ---------------------------------------------------------------- */}
      <Disclosure as="div" className="sl-nav-wrap" style={{ zIndex: 1200 }}>
        {({ open }) => (
          <>
            <nav className="sl-nav" aria-label="Primary">
              <Link to="/" className="sl-nav-brand">
                <img alt="Scissors" src="/Scissors_logo.png" />
                Scissors
              </Link>

              <div className="sl-nav-links">
                {navigation(isLoggedIn).map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    aria-current={item.current ? "page" : undefined}
                    className={classNames(
                      "sl-nav-link",
                      item.current && "sl-nav-link--current"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              <div className="sl-nav-actions">
                <button
                  type="button"
                  className="sl-nav-icon-btn"
                  aria-label="View notifications"
                >
                  <BellIcon aria-hidden="true" />
                </button>

                <Menu as="div" style={{ position: "relative" }}>
                  <MenuButton className="sl-nav-avatar-btn">
                    <span className="sr-only">Open user menu</span>
                    <img alt="User profile" src={avatarSrc} className="sl-nav-avatar" />
                  </MenuButton>
                  <MenuItems transition className="sl-menu-items">
                    <MenuItem>
                      <Link to="/profile" className="sl-menu-item">
                        Your Profile
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link to="/settings" className="sl-menu-item">
                        Settings
                      </Link>
                    </MenuItem>
                    {isLoggedIn && (
                      <MenuItem>
                        <a href="#" className="sl-menu-item" onClick={handleSignOut}>
                          Sign out
                        </a>
                      </MenuItem>
                    )}
                  </MenuItems>
                </Menu>

                <DisclosureButton
                  className="sl-mobile-toggle"
                  aria-label="Toggle main menu"
                >
                  {open ? (
                    <XMarkIcon aria-hidden="true" />
                  ) : (
                    <Bars3Icon aria-hidden="true" />
                  )}
                </DisclosureButton>
              </div>
            </nav>

            <DisclosurePanel transition className="sl-mobile-panel">
              {navigation(isLoggedIn).map((item) => (
                <DisclosureButton
                  key={item.name}
                  as={Link}
                  to={item.href}
                  aria-current={item.current ? "page" : undefined}
                  className="sl-mobile-link"
                >
                  {item.name}
                </DisclosureButton>
              ))}
            </DisclosurePanel>
          </>
        )}
      </Disclosure>

      <main>
        {/* -------------------------------------------------------------- */}
        {/* Hero                                                          */}
        {/* -------------------------------------------------------------- */}
        <section className="sl-hero">
          <div className="sl-grid-overlay" aria-hidden="true" />
          <div
            className="sl-orb sl-orb--green"
            style={{ width: 480, height: 480, top: "-14%", left: "-10%" }}
            aria-hidden="true"
          />

          <div className="sl-container sl-hero-grid">
            <div className="sl-hero-copy sl-fade-up">
              <span className="sl-eyebrow">
                <SparklesIcon width={14} height={14} /> URL shortening, reimagined
              </span>
              <h1 className="sl-heading sl-heading--xl">
                Create faster
                <br />
                digital connections
              </h1>
              <p className="sl-subtext sl-hero-sub">
                Shorten any link, craft a custom alias, and generate a QR code in
                seconds. Scissors gives you one fast, focused workspace to create,
                brand, and track every connection to your content.
              </p>

              <div className="sl-hero-actions">
                <Link to="/signup" className="sl-btn sl-btn--primary">
                  Get started free <ArrowRightIcon className="sl-arrow" />
                </Link>
                <Link to="/login" className="sl-btn sl-btn--ghost">
                  Log in
                </Link>
              </div>

              <div className="sl-hero-trust">
                <div className="sl-hero-trust-item">
                  <span className="sl-hero-trust-num">10M+</span>
                  <span className="sl-hero-trust-label">Global customers</span>
                </div>
                <span className="sl-hero-trust-divider" />
                <div className="sl-hero-trust-item">
                  <span className="sl-hero-trust-num">390M</span>
                  <span className="sl-hero-trust-label">Links created monthly</span>
                </div>
                <span className="sl-hero-trust-divider" />
                <div className="sl-hero-trust-item">
                  <span className="sl-hero-trust-num">15B</span>
                  <span className="sl-hero-trust-label">Clicks &amp; scans monthly</span>
                </div>
              </div>
            </div>

            <UrlShortenerDemo />
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* Platform / feature cards                                      */}
        {/* -------------------------------------------------------------- */}
        <section className="sl-section">
          <div className="sl-container">
            <Reveal className="sl-section-head sl-section-head--center">
              <span className="sl-eyebrow">Platform</span>
              <h2 className="sl-heading sl-heading--lg">
                The Scissors Connections Platform
              </h2>
              <p className="sl-subtext sl-subtext--center" style={{ marginTop: 16 }}>
                Understanding how your clicks and scans are performing should be as
                simple as making them. Manage, assess, and enhance every connection
                from one place.
              </p>
            </Reveal>

            <div className="sl-features-grid">
              <Reveal className="sl-card">
                <div className="sl-card-icon">
                  <LinkIcon />
                </div>
                <h3 className="sl-card-title">URL Shortener</h3>
                <p className="sl-card-text">
                  Turn long, unwieldy links into clean, memorable URLs. A full
                  service approach to strengthen every point of contact your
                  audience has with your content.
                </p>
                <Link to="/signup" className="sl-card-link">
                  Get started <ArrowRightIcon />
                </Link>
              </Reveal>

              <Reveal className="sl-card">
                <div className="sl-card-icon">
                  <QrCodeIcon />
                </div>
                <h3 className="sl-card-title">QR Codes</h3>
                <p className="sl-card-text">
                  Generate a scannable QR code for every link in one click.
                  Reliable, on-brand codes for every business and customer
                  interaction, online or off.
                </p>
                <Link to="/signup" className="sl-card-link">
                  Get started <ArrowRightIcon />
                </Link>
              </Reveal>

              <Reveal className="sl-card">
                <div className="sl-card-icon">
                  <GlobeAltIcon />
                </div>
                <h3 className="sl-card-title">Custom Links</h3>
                <p className="sl-card-text">
                  Type the alias you want, and if it&apos;s available, it&apos;s
                  yours. A unique, memorable URL that strengthens your brand and
                  makes it easier for people to find you.
                </p>
                <Link to="/signup" className="sl-card-link">
                  Get started <ArrowRightIcon />
                </Link>
              </Reveal>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* Stats band                                                    */}
        {/* -------------------------------------------------------------- */}
        <section className="sl-stats-band">
          <div className="sl-container" style={{ padding: "88px 24px" }}>
            <Reveal>
              <p className="sl-subtext" style={{ maxWidth: 640, fontSize: "1rem" }}>
                Adopted and cherished by users worldwide
              </p>
              <h2 className="sl-heading sl-heading--lg" style={{ marginTop: 8 }}>
                Trusted at every scale
              </h2>
            </Reveal>

            <Reveal className="sl-stats-grid">
              <div className="sl-stat">
                <UsersIcon className="sl-stat-icon" />
                <div className="sl-stat-num">
                  <AnimatedStat target={10} suffix="M+" />
                </div>
                <div className="sl-stat-label">Global customers</div>
              </div>
              <div className="sl-stat">
                <LinkIcon className="sl-stat-icon" />
                <div className="sl-stat-num">
                  <AnimatedStat target={390} suffix="M" />
                </div>
                <div className="sl-stat-label">Links &amp; QR codes created monthly</div>
              </div>
              <div className="sl-stat">
                <BoltIcon className="sl-stat-icon" />
                <div className="sl-stat-num">
                  <AnimatedStat target={12} suffix="k+" />
                </div>
                <div className="sl-stat-label">App integrations</div>
              </div>
              <div className="sl-stat">
                <ChartBarIcon className="sl-stat-icon" />
                <div className="sl-stat-num">
                  <AnimatedStat target={15} suffix="B" />
                </div>
                <div className="sl-stat-label">Connections tracked monthly</div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* Analytics teaser                                              */}
        {/* -------------------------------------------------------------- */}
        <section className="sl-section">
          <div className="sl-container sl-analytics-grid">
            <Reveal>
              <span className="sl-eyebrow">Analytics</span>
              <h2 className="sl-heading sl-heading--lg">
                More than a link shortener
              </h2>
              <p className="sl-subtext" style={{ marginTop: 16 }}>
                Understanding how your clicks and scans are performing should be
                as simple as making them. Manage, assess, and enhance all your
                connections in one location.
              </p>

              <div className="sl-analytics-points">
                <div className="sl-analytics-point">
                  <ChartBarIcon />
                  <div>
                    <div className="sl-analytics-point-title">Real-time click tracking</div>
                    <div className="sl-analytics-point-text">
                      See exactly when and where your links get clicked, as it happens.
                    </div>
                  </div>
                </div>
                <div className="sl-analytics-point">
                  <ShieldCheckIcon />
                  <div>
                    <div className="sl-analytics-point-title">Reliable, secure redirects</div>
                    <div className="sl-analytics-point-text">
                      Every link is served through infrastructure built for uptime.
                    </div>
                  </div>
                </div>
                <div className="sl-analytics-point">
                  <CursorArrowRaysIcon />
                  <div>
                    <div className="sl-analytics-point-title">One dashboard for everything</div>
                    <div className="sl-analytics-point-text">
                      Links, QR codes, and performance data, organized in a single view.
                    </div>
                  </div>
                </div>
              </div>

              <Link to="/signup" className="sl-btn sl-btn--primary" style={{ marginTop: 34 }}>
                Get started <ArrowRightIcon className="sl-arrow" />
              </Link>
            </Reveal>

            <Reveal>
              <div className="sl-panel">
                <div className="sl-panel-head">
                  <div>
                    <div className="sl-panel-title">Link performance</div>
                    <div className="sl-panel-sub">Last 8 weeks</div>
                  </div>
                  <ChartBarIcon width={20} height={20} color="#86efac" />
                </div>
                <div className="sl-chart">
                  {[38, 52, 44, 68, 58, 74, 63, 88].map((h, i) => (
                    <div key={i} className="sl-chart-bar" style={{ height: `${h}%` }} />
                  ))}
                </div>
                <div className="sl-panel-legend">
                  <span>Wk 1</span>
                  <span>Wk 8</span>
                </div>
                <div className="sl-panel-foot">
                  <div className="sl-panel-foot-item">
                    <span className="sl-panel-foot-num sl-panel-foot-num--up">+38%</span>
                    <span className="sl-panel-foot-label">Click growth</span>
                  </div>
                  <div className="sl-panel-foot-item">
                    <span className="sl-panel-foot-num">2.4s</span>
                    <span className="sl-panel-foot-label">Avg. redirect time</span>
                  </div>
                  <div className="sl-panel-foot-item">
                    <span className="sl-panel-foot-num">99.9%</span>
                    <span className="sl-panel-foot-label">Uptime</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* Final CTA                                                     */}
        {/* -------------------------------------------------------------- */}
        <section className="sl-section" style={{ paddingBottom: 140 }}>
          <div className="sl-container">
            <Reveal>
              <div className="sl-cta">
                <div
                  className="sl-orb sl-orb--green"
                  style={{
                    width: 400,
                    height: 300,
                    top: "-20%",
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                  aria-hidden="true"
                />
                <h2 className="sl-cta-heading">Ready to create faster connections?</h2>
                <p className="sl-cta-sub">
                  Join the people already using Scissors to shorten, brand, and
                  track every link they share.
                </p>
                <div className="sl-cta-actions">
                  <Link to="/signup" className="sl-btn sl-btn--primary">
                    Get started free <ArrowRightIcon className="sl-arrow" />
                  </Link>
                  <Link to="/login" className="sl-btn sl-btn--ghost">
                    Log in
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;