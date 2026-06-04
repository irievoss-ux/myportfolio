"use client";

import { useEffect, useMemo, useState } from "react";
import { galleryData, type GalleryItem } from "@/components/irieos/content/galleryData";
import { profileData } from "@/components/irieos/content/profileData";
import { projectData, type PortfolioProject } from "@/components/irieos/content/projectData";
import { contactEmail, socialLinks } from "@/components/irieos/content/socialLinks";
import { twitchData } from "@/components/irieos/content/twitchData";
import { useOSStore } from "@/components/irieos/store/useOSStore";
import type { AppId, ThemeId, WallpaperId } from "@/components/irieos/types";

const cardClass =
  "rounded-2xl border border-white/60 bg-white/58 p-4 shadow-[0_16px_38px_rgba(176,123,184,0.14)] backdrop-blur-xl";
const tinyButtonClass =
  "rounded-2xl border border-white/60 bg-white/62 px-3 py-2 text-xs font-black text-[#80598a] shadow-sm transition hover:-translate-y-0.5 hover:bg-white active:translate-y-0";

interface NoteRecord {
  id: string;
  title: string;
  body: string;
  updatedAt: number;
}

interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  stamp: string;
  createdAt: number;
}

type FileItem = {
  name: string;
  kind: "folder" | "text" | "note" | "image" | "project" | "gallery";
  content?: string;
  projectId?: string;
  galleryId?: string;
  opens?: AppId;
};

const defaultNotes: NoteRecord[] = [
  {
    id: "welcome",
    title: "Welcome note",
    body: "Today in IrieOS:\n- add portfolio depth\n- keep the voice soft\n- make every app worth a peek",
    updatedAt: Date.now(),
  },
  {
    id: "stream",
    title: "Stream ideas",
    body: twitchData.schedule.map((slot) => `${slot.day}: ${slot.topic}`).join("\n"),
    updatedAt: Date.now() - 1000,
  },
];

const fakeTracks = [
  { title: "Cotton Candy Boot", artist: "IrieOS System", length: "2:14", mood: "sparkly" },
  { title: "Moon Milk Idle", artist: "Dream Build", length: "3:08", mood: "soft focus" },
  { title: "Starry Lilac Clicks", artist: "Tiny UI Orchestra", length: "1:46", mood: "glitter" },
  { title: "Guestbook at Dusk", artist: "Local Only", length: "2:52", mood: "cozy" },
];

function readNotes() {
  if (typeof window === "undefined") return defaultNotes;
  const stored = localStorage.getItem("irieos-notes-v2");
  if (!stored) return defaultNotes;

  try {
    const parsed = JSON.parse(stored) as NoteRecord[];
    return parsed.length ? parsed : defaultNotes;
  } catch {
    return defaultNotes;
  }
}

function readGuestbook() {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("irieos-guestbook");
  if (!stored) return [];

  try {
    return JSON.parse(stored) as GuestbookEntry[];
  } catch {
    return [];
  }
}

function MiniModal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#80558a]/18 p-5 backdrop-blur-sm">
      <section className="max-h-full w-[min(92%,560px)] overflow-auto rounded-[28px] border border-white/75 bg-white/82 p-5 text-[#6f5277] shadow-[0_24px_70px_rgba(123,82,139,0.24)]">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-black text-[#7f548a]">{title}</h2>
          <button type="button" onClick={onClose} className={tinyButtonClass}>
            close
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}

function PlaceholderArt({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div className={`rounded-3xl bg-[linear-gradient(135deg,#ffd8ef,#d7e8ff,#fff0c7)] p-3 shadow-inner ${className}`}>
      <div className="flex h-full min-h-20 items-end justify-between rounded-2xl bg-white/35 p-3 text-xs font-black text-[#8b6897]">
        <span>{label}</span>
        <span>✦</span>
      </div>
    </div>
  );
}

export function AboutApp() {
  return (
    <div className="relative h-full overflow-auto bg-[#fff8ff] p-5 text-[#6c5272]">
      <div className="pointer-events-none absolute right-7 top-5 text-[#e8b5e8]">✦ ✧ ✦</div>
      <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
        <section className={cardClass}>
          <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-[34px] bg-[linear-gradient(135deg,#ffd6ef,#dcd0ff,#c8f3ff)] text-6xl shadow-inner">
            ✿
          </div>
          <h2 className="mt-4 text-center text-2xl font-black text-[#8f5f9c]">{profileData.name}</h2>
          <p className="mx-auto mt-2 w-fit rounded-full bg-[#ecfff8] px-3 py-1 text-center text-xs font-black text-[#4f8b74]">
            {profileData.status}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {profileData.stats.map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-white/62 p-3 text-center shadow-inner">
                <div className="text-lg font-black text-[#80598a]">{value}</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#b789bf]">{label}</div>
              </div>
            ))}
          </div>
        </section>
        <div className="grid gap-4">
          <section className={cardClass}>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#bd8fc9]">Profile dashboard</p>
            <h1 className="mt-2 text-2xl font-black text-[#765082]">Soft systems, bright stories.</h1>
            <p className="mt-3 text-sm leading-6">{profileData.intro}</p>
            <p className="mt-3 text-sm leading-6">{profileData.aesthetic}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {profileData.personalityTags.map((item) => (
                <span key={item} className="rounded-full bg-[#fff3fb] px-3 py-1 text-xs font-black text-[#94649e] shadow-sm">
                  {item}
                </span>
              ))}
            </div>
          </section>
          <div className="grid gap-4 md:grid-cols-2">
            <section className={cardClass}>
              <h2 className="text-lg font-black text-[#80558a]">Favorite games</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {profileData.favoriteGames.map((game) => (
                  <span key={game} className="rounded-full bg-white/68 px-3 py-1 text-xs font-black text-[#7f5e8a]">
                    {game}
                  </span>
                ))}
              </div>
            </section>
            <section className={cardClass}>
              <h2 className="text-lg font-black text-[#80558a]">Cats and desk magic</h2>
              <p className="mt-2 text-sm leading-6">{profileData.pets.body}</p>
            </section>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Streaming interests", profileData.streamingInterests],
              ["Creative interests", profileData.creativeInterests],
              ["Currently working on", profileData.currentlyWorkingOn],
            ].map(([title, items]) => (
              <section key={title as string} className={cardClass}>
                <h2 className="text-sm font-black text-[#80558a]">{title as string}</h2>
                <ul className="mt-2 space-y-2 text-sm font-semibold">
                  {(items as string[]).map((item) => (
                    <li key={item} className="rounded-2xl bg-white/54 px-3 py-2">
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function TwitchApp() {
  const showToast = useOSStore((state) => state.showToast);

  return (
    <div className="h-full overflow-auto bg-[#fff9fd] p-5 text-[#6b5274]">
      <div className="grid gap-4 lg:grid-cols-[1fr_250px]">
        <section className={cardClass}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c58bd1]">Streamer panel</p>
              <h1 className="mt-1 text-2xl font-black text-[#81518f]">{twitchData.offlineTitle}</h1>
            </div>
            <span className="rounded-full bg-[#e8fff4] px-3 py-1 text-xs font-bold text-[#43816c]">offline / cozy soon</span>
          </div>
          <div className="mt-4 rounded-3xl bg-[linear-gradient(135deg,#ffe5f5,#ddd9ff,#d8f6ff)] p-5 shadow-inner">
            <p className="text-sm font-bold text-[#73517d]">Offline screen</p>
            <p className="mt-2 text-3xl font-black text-[#7f548c]">The room is quiet, but the lights are warm.</p>
            <p className="mt-2 text-sm leading-6 text-[#87688d]">{twitchData.offlineMessage}</p>
          </div>
          <p className="mt-4 text-sm leading-6">{twitchData.intro}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {socialLinks.filter((link) => ["Twitch", "TikTok", "YouTube", "Instagram"].includes(link.label)).map((link) => (
              <button key={link.label} type="button" onClick={() => showToast(`${link.label} is a safe placeholder for now.`)} className={tinyButtonClass}>
                {link.label}
              </button>
            ))}
          </div>
          <section className={`${cardClass} mt-4`}>
            <h2 className="text-lg font-black text-[#80558a]">Clips shelf</h2>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              {twitchData.clipPlaceholders.map((clip) => (
                <PlaceholderArt key={clip} label={clip} className="aspect-video" />
              ))}
            </div>
          </section>
        </section>
        <aside className="grid gap-4">
          <section className={cardClass}>
            <h2 className="text-lg font-black text-[#80558a]">Schedule</h2>
            {twitchData.schedule.map((slot) => (
              <div key={slot.day} className="mt-2 rounded-2xl bg-white/58 px-3 py-2 text-sm font-bold text-[#7b5d84]">
                <span className="block text-xs uppercase tracking-[0.12em] text-[#aa82b3]">{slot.day} · {slot.time}</span>
                {slot.topic}
              </div>
            ))}
          </section>
          <section className={cardClass}>
            <h2 className="text-lg font-black text-[#80558a]">Games and categories</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {[...twitchData.categories, ...twitchData.favoriteGames].map((game) => (
                <span key={game} className="rounded-full bg-white/62 px-3 py-1 text-xs font-black text-[#856090]">
                  {game}
                </span>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

export function ProjectsApp() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const showToast = useOSStore((state) => state.showToast);
  const categories = ["All", ...Array.from(new Set(projectData.map((project) => project.category)))];
  const filteredProjects = projectData.filter((project) => {
    const q = query.trim().toLowerCase();
    return (
      (category === "All" || project.category === category) &&
      (!q || `${project.title} ${project.description} ${project.tags.join(" ")} ${project.tools.join(" ")}`.toLowerCase().includes(q))
    );
  });

  return (
    <div className="relative h-full overflow-auto bg-[#fffaf6] p-5 text-[#725c72]">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c397c7]">Portfolio browser</p>
          <h1 className="text-2xl font-black text-[#7f5989]">Projects</h1>
        </div>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects..." className="w-full rounded-2xl border border-[#efd0e8] bg-white/72 px-4 py-2 text-sm font-semibold outline-none placeholder:text-[#b996bd] focus:border-[#d79ad4] sm:w-64" />
      </header>
      <div className="mt-4 flex flex-wrap gap-2">
        {categories.map((item) => (
          <button key={item} type="button" onClick={() => setCategory(item)} className={`${tinyButtonClass} ${category === item ? "bg-[#ffe2f5]" : ""}`}>
            {item}
          </button>
        ))}
      </div>
      {filteredProjects.length === 0 ? (
        <div className={`${cardClass} mt-5 text-center`}>
          <p className="text-lg font-black text-[#80598a]">No matching project yet.</p>
          <p className="mt-1 text-sm">Try a softer search. The archive may be whispering.</p>
        </div>
      ) : (
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <article key={project.id} className={`${cardClass} transition hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(176,123,184,0.2)]`}>
              <PlaceholderArt label={project.image} className="mb-4 h-28" />
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#c397c7]">{project.category}</p>
                <span className="rounded-full bg-[#ecfff8] px-2 py-1 text-[10px] font-black text-[#4f8b74]">{project.status}</span>
              </div>
              <h2 className="mt-1 text-lg font-black text-[#7f5989]">{project.title}</h2>
              <p className="mt-2 text-sm leading-5">{project.description}</p>
              <p className="mt-2 text-xs font-bold text-[#9a759f]">Role: {project.role}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-white/68 px-2 py-1 text-[10px] font-black text-[#93679b]">{tag}</span>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <button type="button" onClick={() => setSelectedProject(project)} className={tinyButtonClass}>Details</button>
                <button type="button" onClick={() => showToast("Project link placeholder selected.")} className={tinyButtonClass}>Links</button>
              </div>
            </article>
          ))}
        </div>
      )}
      {selectedProject && (
        <MiniModal title={selectedProject.title} onClose={() => setSelectedProject(null)}>
          <PlaceholderArt label={selectedProject.image} className="mt-4 h-36" />
          <p className="mt-4 text-sm leading-6">{selectedProject.details}</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl bg-white/58 p-3">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#aa82b3]">Tools</p>
              <p className="mt-2 text-sm font-semibold">{selectedProject.tools.join(", ")}</p>
            </div>
            <div className="rounded-2xl bg-white/58 p-3">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#aa82b3]">Links</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedProject.links.map((link) => (
                  <button key={link.label} type="button" onClick={() => showToast(`${link.label} is a placeholder.`)} className={tinyButtonClass}>{link.label}</button>
                ))}
              </div>
            </div>
          </div>
        </MiniModal>
      )}
    </div>
  );
}

export function GalleryApp() {
  const [category, setCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const categories = ["All", ...Array.from(new Set(galleryData.map((item) => item.category)))];
  const visibleItems = galleryData.filter((item) => category === "All" || item.category === category);

  return (
    <div className="relative h-full overflow-auto bg-[#fbfdff] p-5 text-[#6f5b7a]">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b995c8]">Dream gallery</p>
          <h1 className="text-2xl font-black text-[#76558a]">Creative archive</h1>
        </div>
        <span className="rounded-full bg-white/65 px-3 py-1 text-xs font-black text-[#8a6798]">{visibleItems.length} soft entries</span>
      </header>
      <div className="mt-4 flex flex-wrap gap-2">
        {categories.map((item) => (
          <button key={item} type="button" onClick={() => setCategory(item)} className={`${tinyButtonClass} ${category === item ? "bg-[#e9f6ff]" : ""}`}>{item}</button>
        ))}
      </div>
      {visibleItems.length === 0 ? (
        <div className={`${cardClass} mt-5 text-center`}>No images in this category yet. The gallery shelf is ready.</div>
      ) : (
        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          {visibleItems.map((item) => (
            <button key={item.id} type="button" onClick={() => setSelectedImage(item)} className="group rounded-3xl border border-white/70 bg-white/42 p-2 text-left shadow-[0_14px_28px_rgba(128,105,160,0.12)] transition hover:-translate-y-1">
              <PlaceholderArt label={item.image} className="aspect-square" />
              <p className="mt-2 truncate px-1 text-xs font-black text-[#8b6897]">{item.title}</p>
            </button>
          ))}
        </div>
      )}
      {selectedImage && (
        <MiniModal title={selectedImage.title} onClose={() => setSelectedImage(null)}>
          <PlaceholderArt label={selectedImage.image} className="mt-4 aspect-video" />
          <p className="mt-4 text-sm leading-6">{selectedImage.caption}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedImage.tags.map((tag) => <span key={tag} className="rounded-full bg-[#fff1fb] px-3 py-1 text-xs font-black text-[#8c5d96]">{tag}</span>)}
          </div>
        </MiniModal>
      )}
    </div>
  );
}

export function ContactApp() {
  const [form, setForm] = useState({ name: "", email: "", message: "", reason: "collab" });
  const [error, setError] = useState("");
  const showToast = useOSStore((state) => state.showToast);
  const updateField = (field: keyof typeof form, value: string) => setForm((current) => ({ ...current, [field]: value }));
  const submit = () => {
    if (!form.name.trim() || !form.email.includes("@") || form.message.trim().length < 8) {
      setError("Add a name, valid email, and a slightly longer message so the dream mailbox knows where to place it.");
      return;
    }
    setError("");
    // Future backend hook: replace this local-only success path with a server action or API route.
    showToast("Dream mailbox checked. Message saved softly.");
  };

  return (
    <div className="h-full overflow-auto bg-[#fff8fd] p-5 text-[#765878]">
      <div className="grid min-h-full gap-4 lg:grid-cols-[190px_1fr_240px]">
        <aside className={`${cardClass} hidden lg:block`}>
          <h2 className="text-lg font-black text-[#855590]">Dream Mail</h2>
          {["Business", "Collab", "Stream", "Soft hello"].map((item) => (
            <button key={item} type="button" onClick={() => updateField("reason", item.toLowerCase())} className={`mt-3 block w-full rounded-xl px-3 py-2 text-left text-sm font-black ${form.reason === item.toLowerCase() ? "bg-[#fff0fb]" : "bg-white/62"} text-[#80608a] hover:bg-white`}>
              {item}
            </button>
          ))}
        </aside>
        <form className={cardClass}>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c78fce]">Contact composer</p>
          <div className="mt-4 grid gap-3">
            <label className="text-sm font-semibold text-[#875b91]">Name<input value={form.name} onChange={(event) => updateField("name", event.target.value)} className="mt-1 w-full rounded-2xl border border-[#efc9ee] bg-white/80 px-3 py-2 outline-none focus:border-[#d996dc]" /></label>
            <label className="text-sm font-semibold text-[#875b91]">Email<input value={form.email} onChange={(event) => updateField("email", event.target.value)} className="mt-1 w-full rounded-2xl border border-[#efc9ee] bg-white/80 px-3 py-2 outline-none focus:border-[#d996dc]" /></label>
            <label className="text-sm font-semibold text-[#875b91]">Message<textarea value={form.message} onChange={(event) => updateField("message", event.target.value)} className="mt-1 h-32 w-full resize-none rounded-2xl border border-[#efc9ee] bg-white/80 p-3 outline-none focus:border-[#d996dc]" /></label>
            {error && <p className="rounded-2xl bg-[#fff0f3] px-3 py-2 text-xs font-black text-[#a74773]">{error}</p>}
            <button type="button" onClick={submit} className="rounded-2xl bg-[#f5a9d9] px-4 py-3 text-sm font-black text-white shadow-lg shadow-pink-200/60 transition hover:-translate-y-0.5">Save to dream mailbox</button>
          </div>
        </form>
        <aside className={cardClass}>
          <h2 className="text-lg font-black text-[#855590]">Socials</h2>
          <button type="button" onClick={() => navigator.clipboard?.writeText(contactEmail).then(() => showToast("Email copied to the soft clipboard."))} className={`${tinyButtonClass} mt-3 w-full`}>Copy email</button>
          {socialLinks.map((link) => (
            <button key={link.label} type="button" onClick={() => showToast(`${link.label} link is prepared as a placeholder.`)} className="mt-3 block w-full rounded-xl bg-white/70 px-3 py-2 text-left text-sm font-semibold text-[#80608a] hover:bg-white">
              <span className="font-black">{link.label}</span><span className="block text-xs text-[#a17aa7]">{link.note}</span>
            </button>
          ))}
        </aside>
      </div>
    </div>
  );
}

export function NotesApp() {
  const [notes, setNotes] = useState<NoteRecord[]>(readNotes);
  const [selectedNoteId, setSelectedNoteId] = useState(() => (typeof window === "undefined" ? readNotes()[0]?.id : localStorage.getItem("irieos-selected-note")) ?? "welcome");
  const showToast = useOSStore((state) => state.showToast);
  const selectedNote = notes.find((note) => note.id === selectedNoteId) ?? notes[0];

  useEffect(() => localStorage.setItem("irieos-notes-v2", JSON.stringify(notes)), [notes]);
  useEffect(() => { if (selectedNote?.id) localStorage.setItem("irieos-selected-note", selectedNote.id); }, [selectedNote?.id]);

  const updateSelectedNote = (patch: Partial<NoteRecord>) => {
    setNotes((current) => current.map((note) => (note.id === selectedNote?.id ? { ...note, ...patch, updatedAt: Date.now() } : note)));
  };
  const createNote = () => {
    const id = `note-${Date.now()}`;
    setNotes((current) => [{ id, title: "Untitled dream", body: "", updatedAt: Date.now() }, ...current]);
    setSelectedNoteId(id);
    showToast("New note created.");
  };
  const deleteNote = () => {
    if (!selectedNote || notes.length === 1) return showToast("Keep at least one note tucked in.");
    const remaining = notes.filter((note) => note.id !== selectedNote.id);
    setNotes(remaining);
    setSelectedNoteId(remaining[0].id);
    showToast("Note moved to soft paper dust.");
  };

  return (
    <div className="flex h-full bg-[#fff9df] text-[#73603d]">
      <aside className="w-48 border-r border-[#f4df9f] bg-[#fff3bf]/70 p-3">
        <button type="button" onClick={createNote} className="mb-3 w-full rounded-2xl bg-white/72 px-3 py-2 text-xs font-black text-[#8c6d27] shadow-sm transition hover:-translate-y-0.5">New note</button>
        <div className="space-y-2">{notes.map((note) => <button key={note.id} type="button" onClick={() => setSelectedNoteId(note.id)} className={`w-full rounded-2xl px-3 py-2 text-left transition ${selectedNote?.id === note.id ? "bg-white text-[#78602d] shadow-inner" : "bg-white/45 hover:bg-white/72"}`}><span className="block truncate text-sm font-black">{note.title || "Untitled dream"}</span><span className="text-[10px] font-bold text-[#a98b44]">{new Date(note.updatedAt).toLocaleDateString()}</span></button>)}</div>
      </aside>
      <section className="flex min-w-0 flex-1 flex-col p-4">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <input value={selectedNote?.title ?? ""} onChange={(event) => updateSelectedNote({ title: event.target.value })} className="min-w-0 flex-1 rounded-2xl border border-[#f4df9f] bg-[#fffcef] px-4 py-2 text-lg font-black text-[#77623c] outline-none focus:border-[#e8bd63]" />
          <button type="button" onClick={() => showToast("Note saved. Stationery sparkle secured.")} className={tinyButtonClass}>Save</button>
          <button type="button" onClick={deleteNote} className={tinyButtonClass}>Delete</button>
        </div>
        <textarea value={selectedNote?.body ?? ""} onChange={(event) => updateSelectedNote({ body: event.target.value })} className="min-h-0 flex-1 resize-none rounded-3xl border border-[#f4df9f] bg-[#fffcef] p-5 text-sm leading-6 text-[#77623c] shadow-inner outline-none focus:border-[#e8bd63]" spellCheck />
      </section>
    </div>
  );
}

function buildFileSystem(): Record<string, FileItem[]> {
  return {
    Desktop: [
      { name: "About", kind: "folder" },
      { name: "Projects", kind: "folder", opens: "projects" },
      { name: "Gallery", kind: "folder", opens: "gallery" },
      { name: "Stream", kind: "folder", opens: "twitch" },
      { name: "Guestbook.note", kind: "note", opens: "guestbook", content: "Local-only guestbook lives in its own app." },
    ],
    About: [
      { name: "profile-intro.txt", kind: "text", content: profileData.intro },
      { name: "aesthetic.txt", kind: "text", content: profileData.aesthetic },
      { name: "cat-desk-energy.txt", kind: "text", content: profileData.pets.body },
    ],
    Projects: projectData.map((project) => ({ name: `${project.title}.project`, kind: "project", projectId: project.id, content: project.description })),
    Gallery: galleryData.map((item) => ({ name: `${item.title}.png`, kind: "gallery", galleryId: item.id, content: item.caption })),
    Stream: [
      { name: "stream-intro.txt", kind: "text", content: twitchData.intro },
      { name: "schedule.note", kind: "note", opens: "notes", content: twitchData.schedule.map((slot) => `${slot.day}: ${slot.topic}`).join("\n") },
      { name: "panels.folder", kind: "folder" },
    ],
    "panels.folder": socialLinks.map((link) => ({ name: `${link.label}.panel`, kind: "text", content: `${link.label}: ${link.note}` })),
    Pictures: galleryData.filter((item) => item.category === "Screenshots").map((item) => ({ name: `${item.title}.png`, kind: "gallery", galleryId: item.id, content: item.caption })),
    Documents: [
      { name: "portfolio-map.txt", kind: "text", content: "Projects, Gallery, Stream, About, Guestbook. Everything is local-first and soft-edged." },
      { name: "project-ideas.folder", kind: "folder" },
    ],
    Downloads: [{ name: "sticker-pack.zip", kind: "text", content: "A decorative future download. It is mostly tiny stars." }],
    Secrets: [
      { name: "secret-sparkle.txt", kind: "text", content: "You found the little hidden file. It sparkles politely." },
      { name: "cat-mode.sys", kind: "text", content: "Cat mode is always watching the warmest pixel." },
    ],
    "Recycle Bin": [{ name: "old-sparkle.tmp", kind: "text", content: "A retired sparkle. Still cute." }],
    "project-ideas.folder": projectData.map((project) => ({ name: `${project.id}.txt`, kind: "project", projectId: project.id, content: project.details })),
  };
}

export function FileExplorerApp() {
  const [path, setPath] = useState("Desktop");
  const [query, setQuery] = useState("");
  const [preview, setPreview] = useState<FileItem | null>(null);
  const openApp = useOSStore((state) => state.openApp);
  const openMenu = useOSStore((state) => state.openMenu);
  const openDialog = useOSStore((state) => state.openDialog);
  const showToast = useOSStore((state) => state.showToast);
  const fileSystem = useMemo(() => buildFileSystem(), []);
  const folders = ["Desktop", "About", "Projects", "Gallery", "Stream", "Documents", "Pictures", "Downloads", "Secrets", "Recycle Bin"];
  const items = (fileSystem[path] ?? []).filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));
  const openItem = (item: FileItem) => {
    if (item.kind === "folder") return setPath(item.name);
    if (item.opens) openApp(item.opens);
    setPreview(item);
  };
  const itemMenu = (event: React.MouseEvent, item: FileItem) => {
    event.preventDefault();
    event.stopPropagation();
    openMenu({ x: event.clientX, y: event.clientY, items: [
      { id: "open", label: "Open", action: () => openItem(item) },
      { id: "preview", label: "Preview", action: () => setPreview(item), disabled: item.kind === "folder" },
      { id: "related", label: "Open related app", action: () => item.opens ? openApp(item.opens) : showToast("This file prefers a quiet preview."), disabled: !item.opens },
      { id: "sep-file", separator: true },
      { id: "info", label: "Properties", action: () => openDialog({ title: item.name, message: `Kind: ${item.kind}. Location: ${path}. Portfolio content lives here as soft filesystem lore.`, tone: "info" }) },
    ]});
  };
  const project = preview?.projectId ? projectData.find((item) => item.id === preview.projectId) : null;
  const gallery = preview?.galleryId ? galleryData.find((item) => item.id === preview.galleryId) : null;

  return (
    <div className="flex h-full bg-[#fbfdff] text-[#6b5878]">
      <aside className="w-44 border-r border-white/70 bg-white/45 p-3">
        <p className="mb-3 text-[10px] font-black uppercase tracking-[0.18em] text-[#9a79a6]">Places</p>
        {folders.map((folder) => <button key={folder} type="button" onClick={() => setPath(folder)} className={`mb-2 flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm font-black transition ${path === folder ? "bg-[#e9f6ff] text-[#5e7890]" : "bg-white/45 hover:bg-white/72"}`}><span>{folder === "Recycle Bin" ? "♻" : "▣"}</span>{folder}</button>)}
      </aside>
      <section className="flex min-w-0 flex-1 flex-col p-4">
        <div className="flex flex-wrap items-center gap-2"><div className="rounded-2xl bg-white/62 px-3 py-2 text-sm font-black text-[#785083]">IrieOS / {path}</div><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search this folder..." className="min-w-44 flex-1 rounded-2xl border border-[#d8e9f5] bg-white/72 px-3 py-2 text-sm font-semibold outline-none focus:border-[#9bcdf3]" /></div>
        {items.length === 0 ? <div className={`${cardClass} mt-4 text-center`}>This folder is quiet. Future content has room to arrive.</div> : <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">{items.map((item) => <button key={item.name} type="button" onDoubleClick={() => openItem(item)} onContextMenu={(event) => itemMenu(event, item)} className="group rounded-3xl border border-white/70 bg-white/52 p-3 text-left shadow-sm transition hover:-translate-y-1 hover:bg-white/78"><div className="flex h-16 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#ffe5f5,#ddf3ff)] text-2xl shadow-inner">{item.kind === "folder" ? "▣" : item.kind === "image" || item.kind === "gallery" ? "▧" : item.kind === "note" ? "✎" : item.kind === "project" ? "✦" : "txt"}</div><p className="mt-2 truncate text-xs font-black text-[#765080]">{item.name}</p><p className="text-[10px] font-bold text-[#9d7fa6]">{item.kind}</p></button>)}</div>}
      </section>
      {preview && <MiniModal title={preview.name} onClose={() => setPreview(null)}>{gallery ? <><PlaceholderArt label={gallery.image} className="mt-4 aspect-video" /><p className="mt-4 text-sm leading-6">{gallery.caption}</p></> : project ? <><PlaceholderArt label={project.image} className="mt-4 h-36" /><p className="mt-4 text-sm leading-6">{project.details}</p></> : <pre className="mt-4 whitespace-pre-wrap rounded-3xl bg-[#fffcef] p-4 text-sm leading-6 text-[#745f3d] shadow-inner">{preview.content}</pre>}</MiniModal>}
    </div>
  );
}

export function BrowserApp() {
  const [url, setUrl] = useState("irie://home");
  const showToast = useOSStore((state) => state.showToast);
  const openApp = useOSStore((state) => state.openApp);
  const page = url.toLowerCase();
  const internalButtons = [
    ["irie://about", "About"],
    ["irie://projects", "Projects"],
    ["irie://gallery", "Gallery"],
  ];

  return (
    <div className="flex h-full flex-col bg-[#f9fdff] text-[#6b5878]">
      <div className="flex gap-2 border-b border-white/70 bg-white/45 p-3"><input value={url} onChange={(event) => setUrl(event.target.value)} className="flex-1 rounded-2xl border border-[#d8e9f5] bg-white/75 px-3 py-2 text-sm font-black outline-none" /><button type="button" onClick={() => showToast("External navigation is placeholder-safe.")} className={tinyButtonClass}>go</button></div>
      <main className="flex-1 overflow-auto p-5">
        <section className={cardClass}>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8aa0bd]">Irie Browser</p>
          <h1 className="mt-2 text-3xl font-black text-[#6a638d]">{page.includes("projects") ? "Projects portal" : page.includes("gallery") ? "Gallery portal" : page.includes("about") ? "About Irie" : "Soft start page"}</h1>
          <p className="mt-3 text-sm leading-6">{page.includes("about") ? profileData.intro : page.includes("projects") ? "Browse project case notes and dreamy build plans from the Projects app." : page.includes("gallery") ? "A portal into chibi, edits, stream graphics, screenshots, and experiments." : "Welcome to the IrieOS browser. Bookmarks are safe placeholders unless real links are added."}</p>
          <div className="mt-4 flex flex-wrap gap-2">{internalButtons.map(([nextUrl, label]) => <button key={nextUrl} type="button" onClick={() => setUrl(nextUrl)} className={tinyButtonClass}>{label}</button>)}</div>
        </section>
        <section className={`${cardClass} mt-4`}>
          <h2 className="text-lg font-black text-[#80558a]">Bookmarks</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">{socialLinks.map((link) => <button key={link.label} type="button" onClick={() => link.label === "Email" ? showToast(`Email: ${contactEmail}`) : showToast(`${link.label} bookmark is waiting for a real URL.`)} className={tinyButtonClass}>{link.label}</button>)}</div>
          <div className="mt-3 flex gap-2"><button type="button" onClick={() => openApp("projects")} className={tinyButtonClass}>Open Projects app</button><button type="button" onClick={() => openApp("gallery")} className={tinyButtonClass}>Open Gallery app</button></div>
        </section>
      </main>
    </div>
  );
}

export function MusicApp() {
  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(68);
  const track = fakeTracks[trackIndex];
  return (
    <div className="h-full overflow-auto bg-[#fff8ff] p-5 text-[#6c5272]">
      <div className="grid gap-4 md:grid-cols-[220px_1fr]">
        <section className={cardClass}><PlaceholderArt label={track.title} className="aspect-square" /><h1 className="mt-4 text-xl font-black text-[#80558a]">{track.title}</h1><p className="text-sm font-bold text-[#9a759f]">{track.artist}</p><div className="mt-4 h-3 overflow-hidden rounded-full bg-white/70"><div className={`h-full rounded-full bg-[#e8b9f2] ${playing ? "w-2/3" : "w-1/4"}`} /></div><div className="mt-3 flex gap-2"><button type="button" onClick={() => setPlaying(!playing)} className={tinyButtonClass}>{playing ? "Pause" : "Play"}</button><button type="button" onClick={() => setTrackIndex((trackIndex + 1) % fakeTracks.length)} className={tinyButtonClass}>Next</button></div><label className="mt-4 block text-xs font-black">Volume<input type="range" min="0" max="100" value={volume} onChange={(event) => setVolume(Number(event.target.value))} className="mt-2 w-full" /></label></section>
        <section className={cardClass}><h2 className="text-lg font-black text-[#80558a]">Playlist: Dream Build Loops</h2><div className="mt-3 space-y-2">{fakeTracks.map((item, index) => <button key={item.title} type="button" onClick={() => setTrackIndex(index)} className={`flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left text-sm font-black ${index === trackIndex ? "bg-[#fff0fb]" : "bg-white/58 hover:bg-white"}`}><span>{item.title}<span className="block text-xs font-bold text-[#a17aa7]">{item.mood}</span></span><span>{item.length}</span></button>)}</div></section>
      </div>
    </div>
  );
}

export function GuestbookApp() {
  const [entries, setEntries] = useState<GuestbookEntry[]>(readGuestbook);
  const [form, setForm] = useState({ name: "", message: "", stamp: "star" });
  const showToast = useOSStore((state) => state.showToast);
  useEffect(() => localStorage.setItem("irieos-guestbook", JSON.stringify(entries)), [entries]);
  const submit = () => {
    if (!form.name.trim() || form.message.trim().length < 3) return showToast("Guestbook needs a name and a tiny message.");
    setEntries((current) => [{ id: `entry-${Date.now()}`, ...form, createdAt: Date.now() }, ...current]);
    setForm({ name: "", message: "", stamp: form.stamp });
    showToast("Guestbook entry saved locally.");
  };
  return (
    <div className="h-full overflow-auto bg-[#fffaf6] p-5 text-[#725c72]">
      <div className="grid gap-4 md:grid-cols-[260px_1fr]">
        <section className={cardClass}><p className="text-xs font-black uppercase tracking-[0.18em] text-[#c397c7]">Local-only</p><h1 className="mt-1 text-2xl font-black text-[#7f5989]">Guestbook</h1><input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Name" className="mt-4 w-full rounded-2xl border border-[#efd0e8] bg-white/72 px-3 py-2 text-sm outline-none" /><textarea value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} placeholder="Leave a soft note..." className="mt-3 h-28 w-full resize-none rounded-2xl border border-[#efd0e8] bg-white/72 p-3 text-sm outline-none" /><div className="mt-3 flex gap-2">{["star", "cat", "moon"].map((stamp) => <button key={stamp} type="button" onClick={() => setForm({ ...form, stamp })} className={`${tinyButtonClass} ${form.stamp === stamp ? "bg-[#fff0fb]" : ""}`}>{stamp}</button>)}</div><button type="button" onClick={submit} className={`${tinyButtonClass} mt-3 w-full`}>Sign locally</button></section>
        <section className={cardClass}><h2 className="text-lg font-black text-[#80558a]">Visitor notes</h2>{entries.length === 0 ? <div className="mt-4 rounded-2xl bg-white/58 p-6 text-center text-sm font-bold">No entries yet. The page is quietly holding space.</div> : <div className="mt-3 space-y-3">{entries.map((entry) => <article key={entry.id} className="rounded-2xl bg-white/62 p-3 text-sm"><div className="flex items-center justify-between"><p className="font-black text-[#7f5989]">{entry.name}</p><span className="rounded-full bg-[#fff0fb] px-2 py-1 text-xs font-black">{entry.stamp}</span></div><p className="mt-2 leading-6">{entry.message}</p><p className="mt-2 text-[10px] font-bold text-[#aa82b3]">{new Date(entry.createdAt).toLocaleString()}</p></article>)}</div>}</section>
      </div>
    </div>
  );
}

export function SettingsApp() {
  const [tab, setTab] = useState("theme");
  const theme = useOSStore((state) => state.theme);
  const wallpaper = useOSStore((state) => state.wallpaper);
  const reducedMotion = useOSStore((state) => state.reducedMotion);
  const uiSounds = useOSStore((state) => state.uiSounds);
  const glitterMode = useOSStore((state) => state.glitterMode);
  const screensaverTimeout = useOSStore((state) => state.screensaverTimeout);
  const setTheme = useOSStore((state) => state.setTheme);
  const setWallpaper = useOSStore((state) => state.setWallpaper);
  const setReducedMotion = useOSStore((state) => state.setReducedMotion);
  const setUISounds = useOSStore((state) => state.setUISounds);
  const setGlitterMode = useOSStore((state) => state.setGlitterMode);
  const setScreensaverTimeout = useOSStore((state) => state.setScreensaverTimeout);
  const themeOptions: { id: ThemeId; label: string; description: string }[] = [
    { id: "cotton-candy", label: "Cotton Candy", description: "Pink, lilac, sky blue, and soft cream glow." },
    { id: "moon-milk", label: "Moon Milk", description: "Warm cream, pearl, and low-contrast bedtime softness." },
    { id: "starry-lilac", label: "Starry Lilac", description: "Lilac, blue, and extra star shimmer." },
  ];
  const wallpaperOptions: { id: WallpaperId; label: string }[] = [
    { id: "cotton-candy", label: "Cotton Candy" },
    { id: "moon-milk", label: "Moon Milk" },
    { id: "starry-lilac", label: "Starry Lilac" },
  ];
  return (
    <div className="flex h-full bg-[#fbf8ff] text-[#6e5479]"><nav className="w-44 border-r border-white/70 bg-white/45 p-3">{["theme", "wallpaper", "magic", "sound", "accessibility"].map((item) => <button key={item} type="button" onClick={() => setTab(item)} className={`mb-2 w-full rounded-2xl px-3 py-2 text-left text-sm font-bold capitalize transition ${tab === item ? "bg-[#f4d7ff] text-[#7a4d8a]" : "hover:bg-white/70"}`}>{item}</button>)}</nav><section className="flex-1 overflow-auto p-5"><h1 className="text-2xl font-black capitalize text-[#7d538b]">{tab}</h1><p className="mt-2 text-sm">Settings save locally and apply across the desktop immediately where possible.</p>{tab === "theme" && <div className="mt-5 grid gap-3 sm:grid-cols-3">{themeOptions.map((item) => <button key={item.id} type="button" onClick={() => setTheme(item.id)} className={`rounded-2xl border p-4 text-left text-sm font-bold text-[#80598a] transition hover:-translate-y-0.5 hover:bg-white ${theme === item.id ? "border-[#d795df] bg-white" : "border-[#ecd1f3] bg-white/70"}`}><span className={`mb-3 block h-14 rounded-xl irie-theme-swatch-${item.id}`} /><span className="block text-base font-black">{item.label}</span><span className="mt-1 block text-xs font-semibold text-[#9b789f]">{item.description}</span></button>)}</div>}{tab === "wallpaper" && <div className="mt-5 grid gap-3 sm:grid-cols-3">{wallpaperOptions.map((item) => <button key={item.id} type="button" onClick={() => setWallpaper(item.id)} className={`rounded-2xl border bg-white/70 p-3 text-left text-sm font-black text-[#80598a] transition hover:-translate-y-0.5 hover:bg-white ${wallpaper === item.id ? "border-[#d795df]" : "border-[#ecd1f3]"}`}><span className={`mb-3 block h-24 rounded-xl irie-wallpaper-preview-${item.id}`} />{item.label}</button>)}</div>}{tab === "sound" && <div className={`${cardClass} mt-5 flex items-center justify-between gap-4`}><div><h2 className="font-black text-[#80558a]">UI sounds</h2><p className="mt-1 text-sm">Tiny browser-made chimes for clicks, apps, and notifications.</p></div><button type="button" onClick={() => setUISounds(!uiSounds)} className={`${tinyButtonClass} ${uiSounds ? "bg-[#ecfff8]" : ""}`}>{uiSounds ? "on" : "off"}</button></div>}{tab === "magic" && <div className="mt-5 grid gap-3"><div className={`${cardClass} flex items-center justify-between gap-4`}><div><h2 className="font-black text-[#80558a]">Glitter Mode</h2><p className="mt-1 text-sm">Adds extra sparkle density and a soft cursor trail.</p></div><button type="button" onClick={() => setGlitterMode(!glitterMode)} className={`${tinyButtonClass} ${glitterMode ? "bg-[#fff0fb]" : ""}`}>{glitterMode ? "sparkling" : "soft"}</button></div><div className={`${cardClass}`}><h2 className="font-black text-[#80558a]">Dream screensaver</h2><p className="mt-1 text-sm">Choose how long IrieOS waits before drifting into dreams.</p><div className="mt-3 flex flex-wrap gap-2">{[30, 60, 90, 180].map((seconds) => <button key={seconds} type="button" onClick={() => setScreensaverTimeout(seconds)} className={`${tinyButtonClass} ${screensaverTimeout === seconds ? "bg-[#ecfff8]" : ""}`}>{seconds}s</button>)}<button type="button" onClick={() => setScreensaverTimeout(0)} className={`${tinyButtonClass} ${screensaverTimeout === 0 ? "bg-[#ecfff8]" : ""}`}>off</button></div></div></div>}{tab === "accessibility" && <div className={`${cardClass} mt-5 flex items-center justify-between gap-4`}><div><h2 className="font-black text-[#80558a]">Reduced motion</h2><p className="mt-1 text-sm">Softens decorative animations while keeping the OS usable.</p></div><button type="button" onClick={() => setReducedMotion(!reducedMotion)} className={`${tinyButtonClass} ${reducedMotion ? "bg-[#ecfff8]" : ""}`}>{reducedMotion ? "on" : "off"}</button></div>}</section></div>
  );
}

export function RecycleBinApp() {
  const [items, setItems] = useState(["old sparkle.tmp", "draft cloud.url", "sleepy screenshot.png"]);
  const showToast = useOSStore((state) => state.showToast);
  const openDialog = useOSStore((state) => state.openDialog);
  const emptyBin = () => openDialog({ title: "Empty Recycle Bin?", message: "This will clear the decorative deleted items list with a tiny shimmer.", tone: "confirm", confirmLabel: "Empty softly", onConfirm: () => { setItems([]); showToast("Recycle Bin emptied with a tiny shimmer."); } });
  return <div className="h-full overflow-auto bg-[#fbfffd] p-6 text-[#75907f]"><div className="mx-auto max-w-xl rounded-[28px] border border-[#d7f3e3] bg-white/70 p-6 shadow-[0_18px_40px_rgba(106,160,128,0.14)]"><div className="text-center"><div className="text-6xl">♻</div><h1 className="mt-4 text-2xl font-black text-[#5f8a70]">{items.length ? "Softly deleted things" : "Nothing here but fresh air."}</h1><p className="mt-2 text-sm">{items.length ? "A tiny list of decorative deleted things." : "Recycle Bin is empty and feeling very accomplished."}</p></div><div className="mt-5 space-y-2">{items.map((item) => <div key={item} className="flex items-center justify-between rounded-2xl bg-white/70 px-3 py-2 text-sm font-bold"><span>{item}</span><button type="button" onClick={() => showToast(`${item} restore is decorative for now.`)} className={tinyButtonClass}>Restore</button></div>)}</div><div className="mt-5 flex justify-center gap-2"><button type="button" onClick={emptyBin} className={tinyButtonClass}>Empty bin</button><button type="button" onClick={() => showToast("The bin says: thank you for tidying gently.")} className={tinyButtonClass}>Inspect</button></div></div></div>;
}
