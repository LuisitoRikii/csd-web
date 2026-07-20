import { useQuery } from '@tanstack/react-query'
import { settingsService } from '@/services'
import { resolveMediaUrl } from '@/config'

const parse = (v, fallback) => {
  if (v == null || v === '') return fallback
  try {
    return JSON.parse(v)
  } catch {
    return fallback
  }
}

/**
 * useSiteSettings — fetches /settings/public and exposes typed accessors for
 * site-level content stored as JSON in SiteSettings (WhyUs reasons, Process steps,
 * BeforeAfter pairs, Videos list, Marquee items, hero/about media, etc.).
 *
 * Each accessor returns a sensible fallback so the UI never breaks when the
 * backend is empty or a setting is missing.
 */
export function useSiteSettings() {
  const { data, isLoading } = useQuery({
    queryKey: ['settings-public'],
    queryFn: () => settingsService.public(),
    staleTime: 1000 * 60 * 5,
  })

  const get = (key, fallback = null) => (data && key in data ? data[key] : fallback)

  return {
    raw: data,
    isLoading,

    hero: {
      videoUrl: resolveMediaUrl(get('hero_video_url', '')),
      imageUrl: resolveMediaUrl(get('hero_image_url', '')),
      fallbackImage: resolveMediaUrl(get('hero_fallback_image', '/logo.png')),
    },

    about: {
      imageUrl: resolveMediaUrl(get('about_image_url', '')),
      editorialQuoteEn: get('home_about_quote_en', ''),
      editorialQuoteEs: get('home_about_quote_es', ''),
      sideNoteEn: get('home_about_side_note_en', ''),
      sideNoteEs: get('home_about_side_note_es', ''),
    },

    whyUs: {
      reasons: parse(get('home_why_us_reasons'), []),
    },

    process: {
      steps: parse(get('home_process_steps'), []),
    },

    beforeAfter: {
      pairs: parse(get('home_before_after_pairs'), []).map((pair) => ({
        ...pair,
        before: resolveMediaUrl(pair.before),
        after: resolveMediaUrl(pair.after),
      })).filter((pair) => pair.before && pair.after),
    },

    videos: {
      list: parse(get('home_videos_list'), []).map((video) => ({
        ...video,
        src: resolveMediaUrl(video.src),
        poster: resolveMediaUrl(video.poster),
      })).filter((video) => video.src),
    },

    marquee: {
      items: parse(get('home_marquee_items'), []),
    },

    maps: {
      embed: get('google_maps_embed', ''),
    },

    seo: {
      titleEn: get('seo_meta_title_en', ''),
      titleEs: get('seo_meta_title_es', ''),
      descriptionEn: get('seo_meta_description_en', ''),
      descriptionEs: get('seo_meta_description_es', ''),
    },
  }
}
