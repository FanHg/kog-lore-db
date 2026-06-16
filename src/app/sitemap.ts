import { MetadataRoute } from 'next';
import { heroDb, factionDb, eventDb, locationDb } from '@/lib/db';
import { BASE_URL } from '@/lib/utils';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = BASE_URL;
  const now = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/heroes`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/factions`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/events`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/timeline`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/relations`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/locations`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/organizations`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/quotes`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/video-topics`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/search`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ];

  // Hero pages
  const heroPages: MetadataRoute.Sitemap = heroDb.getAll().map(hero => ({
    url: `${baseUrl}/heroes/${hero.id}`,
    lastModified: new Date(hero.updatedAt),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // Faction pages
  const factionPages: MetadataRoute.Sitemap = factionDb.getAll().map(faction => ({
    url: `${baseUrl}/factions/${faction.id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // Event pages
  const eventPages: MetadataRoute.Sitemap = eventDb.getAll().map(event => ({
    url: `${baseUrl}/events/${event.id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // Location pages
  const locationPages: MetadataRoute.Sitemap = locationDb.getAll().map(loc => ({
    url: `${baseUrl}/locations/${loc.id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticPages, ...heroPages, ...factionPages, ...eventPages, ...locationPages];
}
