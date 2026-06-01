import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  FLOATING_SCRIPTS,
  INDIAN_LANGUAGES,
  LANGUAGE_REGIONS,
  getLanguagesByRegion,
} from '../../constants/indianLanguages';
import {
  getRegionForState,
  getRegionMeta,
  getStatesForRegion,
} from '../../constants/indiaMapRegions';
import IndiaMapSVG from './IndiaMapSVG';

gsap.registerPlugin(ScrollTrigger);

function clampTooltipPosition(x, y, wrapWidth, wrapHeight) {
  const padX = 130;
  const padTop = 56;
  const padBottom = 80;
  return {
    x: Math.min(Math.max(x, padX), wrapWidth - padX),
    y: Math.min(Math.max(y, padTop), wrapHeight - padBottom),
  };
}

export default function IndiaLanguageMap({ className = '', id = 'languages' }) {
  const sectionRef = useRef(null);
  const mapContainerRef = useRef(null);
  const mapApiRef = useRef(null);
  const listRef = useRef(null);
  const tagRefs = useRef([]);
  const hoverTweenRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [search, setSearch] = useState('');
  const [activeRegionId, setActiveRegionId] = useState(null);
  const [selectedLangId, setSelectedLangId] = useState(null);
  const [tooltip, setTooltip] = useState(null);

  const filteredLanguages = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return INDIAN_LANGUAGES;
    return INDIAN_LANGUAGES.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.native.toLowerCase().includes(q) ||
        l.tags?.some((t) => t.includes(q)),
    );
  }, [search]);

  const pulseRegionStates = useCallback((regionId, scale = 1.015) => {
    if (!regionId) return;
    getStatesForRegion(regionId).forEach((stateId) => {
      const el = mapApiRef.current?.getPath?.(stateId);
      if (!el) return;
      gsap.to(el, {
        scale,
        duration: 0.3,
        ease: 'power2.out',
        transformOrigin: 'center center',
        transformBox: 'fill-box',
      });
    });
  }, []);

  const highlightRegion = useCallback(
    (regionId) => {
      if (!regionId) return;
      setActiveRegionId(regionId);
      pulseRegionStates(regionId, 1.012);
    },
    [pulseRegionStates],
  );

  const clearHighlight = useCallback(() => {
    setActiveRegionId(null);
    setSelectedLangId(null);
    setTooltip(null);

    const paths = mapApiRef.current?.paths;
    if (paths) {
      Object.values(paths).forEach((el) => {
        if (!el) return;
        gsap.to(el, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out',
          transformOrigin: 'center center',
          transformBox: 'fill-box',
        });
      });
    }
  }, []);

  const showTooltipAtEvent = useCallback((title, subtitle, event) => {
    const wrap = mapContainerRef.current;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    const localX = event.clientX - rect.left;
    const localY = event.clientY - rect.top;
    const { x, y } = clampTooltipPosition(localX, localY, rect.width, rect.height);
    setTooltip({ title, subtitle, x, y });
  }, []);

  const handleLocationEnter = useCallback(
    (location, _el, event) => {
      const regionId = getRegionForState(location.id);
      const region = getRegionMeta(regionId);
      const langs = getLanguagesByRegion(regionId);
      const langNames =
        langs.length > 2
          ? `${langs
              .slice(0, 3)
              .map((l) => l.name)
              .join(', ')} +${langs.length - 3}`
          : langs.map((l) => l.name).join(' · ');

      highlightRegion(regionId);
      showTooltipAtEvent(langNames || region?.label, `${location.name} · ${region?.label}`, event);

      hoverTweenRef.current?.kill();
      hoverTweenRef.current = gsap.to(_el, {
        scale: 1.02,
        duration: 0.25,
        ease: 'power2.out',
        transformOrigin: 'center center',
        transformBox: 'fill-box',
      });
    },
    [highlightRegion, showTooltipAtEvent],
  );

  const handleLocationLeave = useCallback(
    (_location, el) => {
      hoverTweenRef.current?.kill();
      gsap.to(el, {
        scale: 1,
        duration: 0.25,
        ease: 'power2.out',
        transformOrigin: 'center center',
        transformBox: 'fill-box',
      });

      if (!selectedLangId) {
        clearHighlight();
      } else {
        const sel = INDIAN_LANGUAGES.find((l) => l.id === selectedLangId);
        if (sel) highlightRegion(sel.regionId);
      }
    },
    [clearHighlight, highlightRegion, selectedLangId],
  );

  const handleLanguageClick = (lang) => {
    setSelectedLangId(lang.id);
    const region = getRegionMeta(lang.regionId);
    highlightRegion(lang.regionId);
    document.getElementById(`lang-chip-${lang.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    const wrap = mapContainerRef.current;
    if (wrap) {
      const { x, y } = clampTooltipPosition(wrap.clientWidth / 2, wrap.clientHeight * 0.35, wrap.clientWidth, wrap.clientHeight);
      setTooltip({
        title: lang.name,
        subtitle: region ? `${lang.native} · ${region.label}` : lang.native,
        x,
        y,
      });
    }
  };

  const handleMapReady = useCallback((api) => {
    mapApiRef.current = api;
    setMapReady(true);
  }, []);

  useEffect(() => {
    if (!mapReady || !mapContainerRef.current) return undefined;

    const paths = Object.values(mapApiRef.current?.paths ?? {}).filter(Boolean);
    if (paths.length === 0) return undefined;

    const ctx = gsap.context(() => {
      gsap.from(mapContainerRef.current, {
        opacity: 0,
        scale: 0.94,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });

      gsap.from(paths, {
        opacity: 0,
        duration: 0.45,
        stagger: 0.012,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 82%',
        },
      });

      if (listRef.current) {
        gsap.from(listRef.current, {
          opacity: 0,
          x: 20,
          duration: 0.65,
          delay: 0.2,
          ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        });
      }

      tagRefs.current.forEach((tag, i) => {
        if (!tag) return;
        gsap.from(tag, {
          opacity: 0,
          y: 10,
          duration: 0.4,
          delay: 0.35 + i * 0.06,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
        });
        gsap.to(tag, {
          y: '+=5',
          duration: 2.2 + i * 0.2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [mapReady]);

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`relative overflow-hidden rounded-3xl border border-black/[0.06] bg-gradient-to-br from-white via-[#FAF6F0] to-[#EDE8E4] shadow-[0_12px_48px_rgba(0,0,0,0.07)] ${className}`}
    >
      <div className="pointer-events-none absolute -right-20 top-0 h-56 w-56 rounded-full bg-[#C4956A]/12 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-[#D4A8C7]/12 blur-3xl" />

      <div className="border-b border-black/[0.05] px-6 py-8 md:px-10 md:py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-flex rounded-full bg-[#F0E6D8] px-3 py-1 text-xs font-medium text-accent">
              22 Official Languages + English
            </span>
            <h2 className="mt-3 font-serif text-3xl text-heading md:text-4xl">
              Supports All Indian Languages
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-body md:text-base">
              Hover any state on the map to see supported languages — geographically accurate,
              proportionally scaled SVG of India.
            </p>
          </div>
          <p className="rounded-2xl bg-white/80 px-4 py-2 text-center text-xs text-body shadow-sm">
            <span className="font-semibold text-heading">{INDIAN_LANGUAGES.length}</span> languages
            <br />
            supported
          </p>
        </div>
      </div>

      <div className="grid gap-8 p-6 md:grid-cols-2 md:gap-10 md:p-10 lg:gap-14">
        <div className="relative flex flex-col">
          <div
            ref={mapContainerRef}
            className="relative mx-auto aspect-[612/696] w-full max-w-lg rounded-2xl border border-white/80 bg-gradient-to-br from-[#FAF8F5] to-[#F0EBE3] p-3 shadow-[0_12px_40px_rgba(28,20,16,0.08)] md:p-5"
            onMouseLeave={() => {
              if (!selectedLangId) clearHighlight();
            }}
          >
            {FLOATING_SCRIPTS.map((tag, i) => (
              <span
                key={tag.text}
                ref={(el) => {
                  tagRefs.current[i] = el;
                }}
                className="pointer-events-none absolute z-20 rounded-full border border-white/90 bg-white/95 px-2.5 py-1 text-[10px] font-medium text-heading shadow-md backdrop-blur-sm md:text-xs"
                style={{ left: `${tag.x}%`, top: `${tag.y}%` }}
              >
                {tag.text}
              </span>
            ))}

            <IndiaMapSVG
              onMapReady={handleMapReady}
              activeRegionId={activeRegionId}
              onLocationEnter={handleLocationEnter}
              onLocationLeave={handleLocationLeave}
              onLocationClick={(location, _el, event) => {
                const regionId = getRegionForState(location.id);
                highlightRegion(regionId);
                showTooltipAtEvent(
                  getLanguagesByRegion(regionId)
                    .map((l) => l.name)
                    .join(' · '),
                  location.name,
                  event,
                );
              }}
              className="h-full min-h-0"
            />

            {tooltip && (
              <div
                className="pointer-events-none absolute z-30 max-w-[220px] -translate-x-1/2 -translate-y-full rounded-xl bg-heading px-3.5 py-2.5 text-center shadow-lg"
                style={{ left: tooltip.x, top: tooltip.y }}
                role="tooltip"
              >
                <p className="text-sm font-semibold leading-snug text-white">{tooltip.title}</p>
                <p className="mt-0.5 text-[11px] leading-snug text-[#C4956A]">{tooltip.subtitle}</p>
                <span
                  className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 translate-y-1/2 rotate-45 bg-heading"
                  aria-hidden
                />
              </div>
            )}
          </div>

          <p className="mt-2 text-center text-[10px] text-body/50">
            Map data © MapSVG · CC BY 4.0
          </p>

          <div className="mt-3 flex flex-wrap justify-center gap-1.5 px-1">
            {LANGUAGE_REGIONS.filter((r) => r.id !== 'pan_india').map((r) => (
              <button
                key={r.id}
                type="button"
                onMouseEnter={() => highlightRegion(r.id)}
                onMouseLeave={() => !selectedLangId && clearHighlight()}
                onClick={() => highlightRegion(r.id)}
                className={`inline-flex cursor-pointer items-center gap-1 rounded-full px-2 py-0.5 text-[10px] transition-all ${
                  activeRegionId === r.id
                    ? 'bg-heading text-white shadow-sm'
                    : 'bg-white/90 text-body hover:bg-white'
                }`}
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: r.color }} />
                {r.label.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        <div ref={listRef} className="flex min-h-0 flex-col">
          <div className="relative mb-4">
            <label htmlFor="lang-search" className="sr-only">
              Search languages
            </label>
            <input
              id="lang-search"
              type="search"
              placeholder="Search languages (e.g. Tamil, हिन्दी)…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-[#E0D8CE] bg-white/90 py-3 pl-10 pr-4 text-sm text-heading shadow-sm outline-none transition-colors placeholder:text-body/60 focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
            <svg
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-body/50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path d="M21 21l-4.35-4.35M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" />
            </svg>
          </div>

          {search && (
            <p className="mb-3 text-xs text-body">
              {filteredLanguages.length} of {INDIAN_LANGUAGES.length} languages
            </p>
          )}

          <div className="max-h-[320px] flex-1 overflow-y-auto rounded-2xl border border-[#E8E0D4] bg-white/60 p-3 shadow-inner md:max-h-[400px]">
            <div className="grid gap-2 sm:grid-cols-2">
              {filteredLanguages.map((lang) => {
                const isSelected = selectedLangId === lang.id;
                const region = getRegionMeta(lang.regionId);
                return (
                  <button
                    key={lang.id}
                    id={`lang-chip-${lang.id}`}
                    type="button"
                    onClick={() => handleLanguageClick(lang)}
                    onMouseEnter={() => {
                      highlightRegion(lang.regionId);
                      const wrap = mapContainerRef.current;
                      if (wrap) {
                        const { x, y } = clampTooltipPosition(
                          wrap.clientWidth / 2,
                          wrap.clientHeight * 0.32,
                          wrap.clientWidth,
                          wrap.clientHeight,
                        );
                        setTooltip({
                          title: lang.name,
                          subtitle: `${lang.native} · ${region?.label ?? ''}`,
                          x,
                          y,
                        });
                      }
                    }}
                    onMouseLeave={() => {
                      if (!selectedLangId) clearHighlight();
                      else if (selectedLangId === lang.id) {
                        const sel = INDIAN_LANGUAGES.find((l) => l.id === selectedLangId);
                        if (sel) highlightRegion(sel.regionId);
                      }
                    }}
                    className={`flex cursor-pointer flex-col items-start rounded-xl border px-3 py-2.5 text-left transition-all duration-200 ${
                      isSelected
                        ? 'border-heading bg-heading text-white shadow-md'
                        : 'border-transparent bg-white hover:border-accent/40 hover:shadow-sm'
                    }`}
                  >
                    <span className="flex w-full items-center justify-between gap-2">
                      <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-heading'}`}>
                        {lang.name}
                      </span>
                      {lang.linkLanguage && (
                        <span
                          className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-[#F0E6D8] text-accent'
                          }`}
                        >
                          Link
                        </span>
                      )}
                    </span>
                    <span
                      className={`mt-0.5 text-base leading-snug ${isSelected ? 'text-white/90' : 'text-body'}`}
                      dir="auto"
                    >
                      {lang.native}
                    </span>
                    {region && (
                      <span
                        className={`mt-1.5 inline-flex items-center gap-1 text-[10px] ${
                          isSelected ? 'text-white/70' : 'text-body/70'
                        }`}
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: isSelected ? '#fff' : region.color }}
                        />
                        {region.label}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {filteredLanguages.length === 0 && (
              <p className="py-8 text-center text-sm text-body">No languages match your search.</p>
            )}
          </div>

          <button
            type="button"
            onClick={clearHighlight}
            className={`mt-4 cursor-pointer self-start text-xs font-medium text-accent underline-offset-2 hover:underline ${
              activeRegionId ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
          >
            Clear map highlight
          </button>
        </div>
      </div>
    </section>
  );
}
