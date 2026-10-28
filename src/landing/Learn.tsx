import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Clock, KeyRound, Loader2, LogOut, PlayCircle } from "lucide-react";
import { VideoEmbed } from "@/components/ui/VideoEmbed";
import { Seo } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { fetchCourse, fetchLessons, fetchShop, learnerSignIn, learnerSignOut, myGrants, myOrders, redeemPassword } from "./api";
import { GoogleMark } from "./Checkout";
import { CourseCover } from "./Courses";
import { authErrorMessage, useLearner } from "./useLearner";
import { FloatingWhatsApp, LpFooter, lpBtn, lpBtnDark, lpInput, money } from "./ui";
import { Logo } from "@/components/layout/Logo";
import type { Course, Lesson, Order } from "./types";

function Shell({ children, onSignOut }: { children: React.ReactNode; onSignOut?: () => void }) {
  return (
    <>
      <Seo title="My courses" description="Watch the Springs 360 courses you've unlocked." path="/learn" noindex />
      <header className="on-dark bg-deep text-ivory">
        <div className="container-site flex h-20 items-center justify-between gap-4">
          <Link to="/" aria-label="Springs 360 home">
            <Logo />
          </Link>
          <nav className="flex items-center gap-2 text-sm font-semibold">
            <Link to="/training" className="rounded-full px-3 py-2 hover:bg-ivory/10">
              Courses
            </Link>
            {onSignOut && (
              <button type="button" onClick={onSignOut} className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 hover:bg-ivory/10">
                <LogOut size={15} /> Sign out
              </button>
            )}
          </nav>
        </div>
      </header>
      <main id="main" className="min-h-[70svh] bg-ivory-100">
        <div className="container-site py-12 sm:py-16">{children}</div>
      </main>
      <LpFooter />
      <FloatingWhatsApp text="Hi Springs 360, I need help with my course access." />
    </>
  );
}

function SignInCard({ text }: { text: string }) {
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <div className="mx-auto grid max-w-md gap-5 rounded-[1.5rem] border border-ink/10 bg-white p-7 text-center">
      <h1 className="font-display text-display-sm font-bold text-ink">My courses</h1>
      <p className="text-ink-muted">{text}</p>
      <button
        type="button"
        disabled={busy}
        onClick={async () => {
          setErr("");
          setBusy(true);
          try {
            await learnerSignIn();
          } catch (e) {
            setErr(authErrorMessage(e));
          } finally {
            setBusy(false);
          }
        }}
        className="flex min-h-[52px] items-center justify-center gap-3 rounded-full border border-ink/15 bg-white font-semibold text-ink hover:border-ink disabled:opacity-60"
      >
        {busy ? <Loader2 size={18} className="animate-spin" /> : <GoogleMark />} Continue with Google
      </button>
      {err && <p className="text-sm text-[#9B2C2C]">{err}</p>}
    </div>
  );
}

export function MyCourses() {
  const learner = useLearner();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [unlockText, setUnlockText] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const user = learner.status === "signed-in" ? learner.user : null;

  const load = useCallback(async () => {
    if (!user) return;
    const [grants, os] = await Promise.all([myGrants(user.uid).catch(() => []), myOrders(user.uid).catch(() => [])]);
    const list = await Promise.all(grants.map((g) => fetchCourse(g.courseSlug)));
    setCourses(list.filter(Boolean) as Course[]);
    setOrders(os);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    fetchShop().then((s) => setUnlockText(s.unlockText));
  }, []);

  async function unlock(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    setErr("");
    setBusy(true);
    try {
      const slug = await redeemPassword(user.uid, user.email ?? "", pw);
      navigate(`/learn/${slug}`);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "That didn't work. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (learner.status === "loading")
    return (
      <Shell>
        <Loader2 className="mx-auto animate-spin text-ink-soft" />
      </Shell>
    );
  if (!user)
    return (
      <Shell>
        <SignInCard text="Sign in with the Google account you used to buy. Then enter the password we sent you." />
      </Shell>
    );

  const owned = new Set((courses ?? []).map((c) => c.slug));
  const pending = orders.filter((o) => o.status === "pending" && !owned.has(o.courseSlug));

  return (
    <Shell onSignOut={() => learnerSignOut()}>
      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="min-w-0">
          <h1 className="font-display text-display-md font-bold text-ink">My courses</h1>
          <p className="mt-2 text-ink-muted">Signed in as {user.email}</p>
          {pending.length > 0 && (
            <div className="mt-6 grid gap-2">
              {pending.map((o) => (
                <p key={o.id} className="rounded-xl bg-gold/15 px-4 py-3 text-sm text-ink">
                  <b>{o.courseTitle}</b> · {money(o.amount, o.currency)} by {o.methodLabel}: we're verifying your payment. Your password will arrive on WhatsApp.
                </p>
              ))}
            </div>
          )}
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {courses === null ? (
              <Loader2 className="animate-spin text-ink-soft" />
            ) : courses.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-ink/20 p-8 text-ink-muted sm:col-span-2">
                No courses unlocked yet. Enter your password to unlock one, or{" "}
                <Link to="/training" className="font-semibold text-forest underline">
                  browse the courses
                </Link>
                .
              </p>
            ) : (
              courses.map((c) => (
                <Link key={c.slug} to={`/learn/${c.slug}`} className="group overflow-hidden rounded-[1.25rem] border border-ink/10 bg-white">
                  <div className="aspect-video overflow-hidden bg-deep">
                    <CourseCover course={c} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                  </div>
                  <div className="flex items-center justify-between gap-3 p-5">
                    <span className="font-bold text-ink">{c.title}</span>
                    <PlayCircle className="shrink-0 text-forest-500" />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
        <form onSubmit={unlock} noValidate className="grid h-fit gap-4 rounded-[1.5rem] border border-ink/10 bg-white p-6">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sage-100 text-forest">
            <KeyRound size={20} />
          </span>
          <h2 className="text-xl font-bold text-ink">Unlock a course</h2>
          {unlockText && <p className="text-sm text-ink-muted">{unlockText}</p>}
          <label className="grid gap-1.5 text-sm font-semibold text-ink">
            Email
            <input id="unlock-email" className={cn(lpInput, "bg-ivory-100")} value={user.email ?? ""} readOnly />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold text-ink">
            Password
            <input id="unlock-password" className={cn(lpInput, "font-mono uppercase tracking-wider")} autoComplete="one-time-code" autoCapitalize="characters" placeholder="S360-XXXX-XXXX-XXXX" value={pw} onChange={(e) => setPw(e.target.value)} />
          </label>
          {err && (
            <p role="alert" className="text-sm text-[#9B2C2C]">
              {err}
            </p>
          )}
          <button type="submit" disabled={busy || !pw.trim()} className={lpBtn}>
            {busy && <Loader2 size={18} className="animate-spin" />} Unlock
          </button>
        </form>
      </div>
    </Shell>
  );
}

export function CoursePlayer() {
  const { slug = "" } = useParams();
  const learner = useLearner();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[] | null>(null);
  const [denied, setDenied] = useState(false);
  const [i, setI] = useState(0);
  const user = learner.status === "signed-in" ? learner.user : null;

  useEffect(() => {
    if (!user) return;
    fetchCourse(slug).then(setCourse);
    fetchLessons(slug)
      .then(setLessons)
      .catch(() => setDenied(true));
  }, [user, slug]);

  if (learner.status === "loading")
    return (
      <Shell>
        <Loader2 className="mx-auto animate-spin text-ink-soft" />
      </Shell>
    );
  if (!user)
    return (
      <Shell>
        <SignInCard text="Sign in with the Google account you used to buy this course." />
      </Shell>
    );
  if (denied)
    return (
      <Shell onSignOut={() => learnerSignOut()}>
        <div className="mx-auto grid max-w-md gap-5 rounded-[1.5rem] border border-ink/10 bg-white p-7 text-center">
          <h1 className="text-2xl font-bold text-ink">This course isn't unlocked yet</h1>
          <p className="text-ink-muted">Enter the password we sent you on the My courses page. You're signed in as {user.email}.</p>
          <Link to="/learn" className={lpBtnDark}>
            Go to My courses
          </Link>
          {course && (
            <Link to={`/courses/${course.slug}`} className="text-sm font-semibold text-forest underline">
              Buy this course
            </Link>
          )}
        </div>
      </Shell>
    );

  const lesson = lessons?.[i];
  return (
    <Shell onSignOut={() => learnerSignOut()}>
      <Link to="/learn" className="text-sm font-semibold text-forest hover:underline">
        ← My courses
      </Link>
      <h1 className="mt-3 font-display text-display-md font-bold text-ink">{course?.title ?? ""}</h1>
      {!lessons ? (
        <Loader2 className="mt-8 animate-spin text-ink-soft" />
      ) : lessons.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-ink/20 p-8 text-ink-muted">Lessons are being uploaded. Check back soon.</p>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="min-w-0">
            <div className="overflow-hidden rounded-[1.25rem] bg-black">{lesson?.video ? <VideoEmbed key={lesson.video} src={lesson.video} title={lesson.title} /> : <p className="p-10 text-center text-ivory/70">Video coming soon.</p>}</div>
            <h2 className="mt-5 text-2xl font-bold text-ink">
              {i + 1}. {lesson?.title}
            </h2>
            {lesson?.notes && <p className="mt-3 max-w-prose whitespace-pre-line text-ink-muted">{lesson.notes}</p>}
            <div className="mt-6 flex gap-3">
              <button type="button" disabled={i === 0} onClick={() => setI(i - 1)} className="min-h-[44px] rounded-full border border-ink/15 px-5 font-semibold text-ink disabled:opacity-40">
                Previous
              </button>
              <button type="button" disabled={i >= lessons.length - 1} onClick={() => setI(i + 1)} className="min-h-[44px] rounded-full bg-forest px-5 font-semibold text-ivory disabled:opacity-40">
                Next lesson
              </button>
            </div>
          </div>
          <ol className="h-fit divide-y divide-ink/10 overflow-hidden rounded-[1.25rem] border border-ink/10 bg-white">
            {lessons.map((l, j) => (
              <li key={j}>
                <button type="button" onClick={() => setI(j)} className={cn("flex w-full items-center gap-3 px-4 py-3.5 text-left", j === i ? "bg-sage-100" : "hover:bg-ink/[0.03]")}>
                  <span className="w-6 shrink-0 text-sm font-semibold tabular-nums text-ink-soft">{j + 1}</span>
                  <span className={cn("min-w-0 flex-1 text-[0.95rem]", j === i ? "font-semibold text-ink" : "text-ink")}>{l.title}</span>
                  {l.duration && (
                    <span className="inline-flex shrink-0 items-center gap-1 text-xs tabular-nums text-ink-soft">
                      <Clock size={12} /> {l.duration}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ol>
        </div>
      )}
    </Shell>
  );
}
