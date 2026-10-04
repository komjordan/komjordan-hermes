import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { projects } from '../data/projects';
export function GET(context: APIContext) {
  return rss({
    title: 'Projets — Axel KAMGAING KOM',
    description: 'Laboratoires et projets en systèmes, réseaux et cybersécurité.',
    site: context.site ?? 'https://komjordan.fr',
    items: projects.map((project) => ({
      title: project.title,
      description: project.summary,
      pubDate: new Date(project.date),
      link: `/projets/${project.slug}/`,
    })),
    customData: '<language>fr-fr</language>',
  });
}
