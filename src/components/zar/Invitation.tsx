import { motion, useReducedMotion } from "motion/react";
import { ExternalLink, MapPin, Phone } from "lucide-react";
import type { ZarContact, ZarContent } from "@/lib/zar/types";
import { digitsOnly, formatDateTime, galleryUrls, splitDate, text } from "@/lib/zar/format";
import { WarpField } from "./WarpField";
import { WovenBorder } from "./WovenBorder";
import { Medallion } from "./Medallion";
import { Panel, Section, SectionTitle } from "./Panel";
import { Rsvp } from "./Rsvp";
import { MusicToggle } from "./MusicToggle";

import { useInView } from "./useInView";

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const reduced = useReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>(0.2);
  return (
    <motion.div
      ref={ref}
      initial={reduced ? false : { opacity: 0, y: 18 }}
      animate={inView || reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Invitation({ content }: { content: ZarContent }) {
  const reduced = useReducedMotion();
  const groom = text(content.groom_name);
  const bride = text(content.bride_name);
  const invocation = text(content.invocation);
  const date = splitDate(content.wedding_date);
  const events = (content.events ?? []).filter((e) => text(e?.name) || text(e?.title));
  const venue = content.venue ?? null;
  const gallery = galleryUrls(content.gallery);
  const contacts = (content.contacts ?? []).filter((c) => text(c?.phone)).slice(0, 2);
  const musicEnabled = content.music_enabled !== false;
  const musicUrl = text(content.music_url);

  const groomParents = text(content.groom_parents);
  const brideParents = text(content.bride_parents);
  const message = text(content.message);
  const relatives = text(content.relatives);
  const venueMaps = text(venue?.maps_url);

  return (
    <main className="relative min-h-svh overflow-x-hidden">
      <WarpField />
      {musicEnabled ? <MusicToggle url={musicUrl} /> : null}

      {/* 1. Warp introduction */}
      <section className="flex min-h-svh flex-col items-center justify-center px-6 text-center">
        <motion.p
          initial={reduced ? false : { opacity: 0, letterSpacing: "0.6em" }}
          animate={{ opacity: 1, letterSpacing: "0.34em" }}
          transition={{ duration: 1.6, delay: 0.6 }}
          className="zar-eyebrow text-zar-cream/85"
        >
          Some stories are woven, not written
        </motion.p>
        <motion.div
          initial={reduced ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 1.4 }}
          className="zar-gold-rule my-8 h-px w-40"
        />
        <motion.p
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 2 }}
          className="zar-eyebrow text-zar-cream/45"
        >
          A new beginning is being woven
        </motion.p>
      </section>

      {/* 2. First border */}
      <Section className="!py-6">
        <WovenBorder units={22} height={16} />
      </Section>

      {/* 3. Hero medallion + names */}
      <Section className="!py-8">
        {invocation ? (
          <Reveal>
            <p className="mb-6 text-center font-display text-lg leading-relaxed text-zar-cream/80">
              {invocation}
            </p>
          </Reveal>
        ) : null}

        <Medallion>
          <div className="text-center text-zar-ink">
            {groom ? (
              <p className="font-display text-[clamp(1.9rem,9vw,2.7rem)] leading-tight text-zar-burgundy">
                {groom}
              </p>
            ) : null}
            {groom && bride ? (
              <p className="my-2 font-display text-2xl text-zar-gold">&amp;</p>
            ) : null}
            {bride ? (
              <p className="font-display text-[clamp(1.9rem,9vw,2.7rem)] leading-tight text-zar-burgundy">
                {bride}
              </p>
            ) : null}
          </div>
        </Medallion>

        <CoupleDetails content={content} />
      </Section>

      {/* 4. Date */}
      {date ? (
        <Section>
          <Reveal>
            <Panel tone="dark">
              <div className="text-center">
                <p className="zar-eyebrow text-zar-gold">Together with our families</p>
                <p className="mt-4 font-display text-lg text-zar-cream/85">
                  We cordially invite you to celebrate our wedding
                </p>
                <p className="zar-eyebrow mt-6 text-zar-cream/70">{date.weekday}</p>
                <div className="mt-3 flex items-end justify-center gap-4">
                  <span className="zar-eyebrow pb-2 text-zar-saffron">{date.month}</span>
                  <span className="font-display text-6xl leading-none text-zar-cream">
                    {date.day}
                  </span>
                  <span className="zar-eyebrow pb-2 text-zar-saffron">{date.year}</span>
                </div>
              </div>
            </Panel>
          </Reveal>
        </Section>
      ) : null}

      {/* 5. Family / message */}
      {groomParents || brideParents || message || relatives ? (
        <Section>
          <Reveal>
            <Panel>
              <SectionTitle>Our families</SectionTitle>
              <div className="mt-6 grid grid-cols-2 gap-4 text-center text-sm">
                {groomParents ? (
                  <div>
                    <p className="zar-eyebrow text-zar-burgundy">Groom's parents</p>
                    <p className="mt-2 font-display text-base whitespace-pre-line">
                      {groomParents}
                    </p>
                  </div>
                ) : null}
                {brideParents ? (
                  <div>
                    <p className="zar-eyebrow text-zar-burgundy">Bride's parents</p>
                    <p className="mt-2 font-display text-base whitespace-pre-line">
                      {brideParents}
                    </p>
                  </div>
                ) : null}
              </div>
              {relatives ? (
                <p className="mt-6 text-center font-display text-base whitespace-pre-line">
                  {relatives}
                </p>
              ) : null}
              {message ? (
                <p className="mt-6 text-center font-display text-lg italic leading-relaxed">
                  {message}
                </p>
              ) : null}
            </Panel>
          </Reveal>
        </Section>
      ) : null}

      {/* 6. Events as smaller woven panels */}
      {events.length ? (
        <Section>
          <SectionTitle>Wedding events</SectionTitle>
          <div className="mt-6 space-y-4">
            {events.map((event, i) => {
              const when = formatDateTime(event.date, event.time);
              return (
                <Reveal key={i} delay={i * 0.05}>
                  <Panel>
                    <div className="flex items-start gap-4">
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-sm bg-zar-burgundy text-zar-cream">
                        <span className="font-display text-lg">{i + 1}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="zar-eyebrow text-zar-burgundy">
                          {text(event.name) ?? text(event.title)}
                        </p>
                        {when ? <p className="mt-2 text-sm">{when}</p> : null}
                        {text(event.venue) ? (
                          <p className="mt-1 text-sm opacity-75">{event.venue}</p>
                        ) : null}
                        {text(event.note) ? (
                          <p className="mt-1 text-sm opacity-75">{event.note}</p>
                        ) : null}
                      </div>
                    </div>
                  </Panel>
                </Reveal>
              );
            })}
          </div>
        </Section>
      ) : null}

      {/* 7. Venue as a framed textile plaque */}
      {venue && (text(venue.name) || text(venue.address) || text(venue.city)) ? (
        <Section>
          <SectionTitle>Venue</SectionTitle>
          <Reveal>
            <Panel className="mt-6">
              {text(venue.image_url) ? (
                <img
                  src={venue.image_url as string}
                  alt={text(venue.name) ?? "Venue"}
                  loading="lazy"
                  className="mb-5 h-44 w-full rounded-sm border border-zar-burgundy/30 object-cover"
                />
              ) : null}
              <div className="text-center">
                {text(venue.name) ? (
                  <p className="font-display text-2xl text-zar-burgundy">{venue.name}</p>
                ) : null}
                {text(venue.address) ? <p className="mt-2 text-sm">{venue.address}</p> : null}
                {text(venue.city) ? <p className="text-sm">{venue.city}</p> : null}
                {venueMaps ? (
                  <a
                    href={venueMaps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="zar-eyebrow mt-5 inline-flex items-center gap-2 rounded-sm bg-zar-burgundy px-5 py-3 text-zar-cream"
                  >
                    <MapPin size={13} /> View on maps <ExternalLink size={12} />
                  </a>
                ) : null}
              </div>
            </Panel>
          </Reveal>
        </Section>
      ) : null}

      {/* 8. Gallery woven into the border */}
      {gallery.length ? (
        <Section>
          <SectionTitle>Gallery</SectionTitle>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {gallery.slice(0, 8).map((url, i) => (
              <Reveal key={url + i} delay={i * 0.06}>
                <div className="overflow-hidden rounded-sm border border-zar-gold/40">
                  <img
                    src={url}
                    alt=""
                    loading="lazy"
                    className="h-40 w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </Section>
      ) : null}

      {/* Contacts */}
      {contacts.length ? (
        <Section>
          <SectionTitle>Contact us</SectionTitle>
          <div className="mt-6 space-y-3">
            {contacts.map((contact, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <ContactRow contact={contact} />
              </Reveal>
            ))}
          </div>
        </Section>
      ) : null}

      {/* 9. RSVP */}
      <Section>
        <Rsvp />
      </Section>

      {/* QR intentionally omitted on the live public invitation (PUBLIC_INVITATION_INTEGRATION §Design requirements) */}

      {/* 10. Completed carpet */}
      <section className="px-5 pb-20 pt-6">
        <WovenBorder units={24} height={16} />
        <div className="mx-auto mt-10 max-w-md text-center">
          <p className="font-display text-4xl text-zar-cream">Thank You</p>
          <p className="zar-eyebrow mt-4 text-zar-cream/60">For being a part of our story</p>
          {groom || bride ? (
            <p className="mt-5 font-display text-xl text-zar-saffron">
              {[groom, bride].filter(Boolean).join(" & ")}
            </p>
          ) : null}
          {date ? <p className="zar-eyebrow mt-2 text-zar-cream/50">{date.full}</p> : null}
          <p className="mt-8 font-display text-base italic text-zar-cream/60">
            “Some bonds are woven for eternity”
          </p>
        </div>
        <WovenBorder units={24} height={16} className="mt-10" />
      </section>
    </main>
  );
}

function CoupleDetails({ content }: { content: ZarContent }) {
  const items: { photo: string | null; name: string | null; lines: string[] }[] = [
    {
      photo: text(content.groom_photo_url),
      name: text(content.groom_name),
      lines: [text(content.groom_qualification), text(content.groom_occupation)].filter(
        (v): v is string => Boolean(v),
      ),
    },
    {
      photo: text(content.bride_photo_url),
      name: text(content.bride_name),
      lines: [text(content.bride_qualification), text(content.bride_occupation)].filter(
        (v): v is string => Boolean(v),
      ),
    },
  ].filter((item) => item.photo || item.lines.length);

  if (!items.length) return null;

  return (
    <div className="mt-8 grid grid-cols-2 gap-4">
      {items.map((item, i) => (
        <Reveal key={i} delay={i * 0.08}>
          <div className="text-center">
            {item.photo ? (
              <img
                src={item.photo}
                alt={item.name ?? ""}
                loading="lazy"
                className="mx-auto h-28 w-28 rounded-full border border-zar-gold/50 object-cover"
              />
            ) : null}
            {item.lines.map((line) => (
              <p key={line} className="mt-2 text-xs text-zar-cream/70">
                {line}
              </p>
            ))}
          </div>
        </Reveal>
      ))}
    </div>
  );
}

function ContactRow({ contact }: { contact: ZarContact }) {
  const phone = text(contact.phone) as string;
  const waUrl =
    text(contact.whatsapp_url) ?? text(contact.whatsapp) ?? `https://wa.me/${digitsOnly(phone)}`;

  return (
    <div className="zar-parchment flex items-center justify-between gap-3 rounded-sm border border-zar-gold/40 px-4 py-3">
      <div className="min-w-0">
        {text(contact.name) ? (
          <p className="truncate font-display text-lg text-zar-burgundy">{contact.name}</p>
        ) : null}
        <p className="text-sm text-zar-ink/75">{phone}</p>
      </div>
      <div className="flex shrink-0 gap-2">
        <a
          href={`tel:${phone}`}
          aria-label={`Call ${text(contact.name) ?? phone}`}
          className="grid h-10 w-10 place-items-center rounded-full bg-zar-ink text-zar-cream"
        >
          <Phone size={15} />
        </a>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`WhatsApp ${text(contact.name) ?? phone}`}
          className="grid h-10 w-10 place-items-center rounded-full bg-zar-teal text-zar-cream"
        >
          <span className="text-sm font-semibold">W</span>
        </a>
      </div>
    </div>
  );
}
