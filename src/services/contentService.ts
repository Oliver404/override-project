import matter from 'gray-matter'
import { marked } from 'marked'

const renderer = new marked.Renderer();
const originalPara = renderer.paragraph;
renderer.paragraph = (text) => {
  if (text.text.startsWith('---COMPONENT---')) {
    const json = text.text.replace(/---COMPONENT---/g, '').trim();
    try {
      const data = JSON.parse(json);
      return `<div data-component="${data.component}" data-props='${JSON.stringify(data.props)}'></div>`;
    } catch (e) {
      console.error('Failed to parse component JSON:', e);
      return '';
    }
  }
  return originalPara.call(renderer, text);
};

marked.setOptions({ renderer, headerIds: true });

interface Post {
  slug: string;
  title: string;
  date: string;
  content: string;
}

// interface Doc {
//   slug: string;
//   title: string;
//   content: string;
//   createdAt?: string;
//   updatedAt?: string;
//   children?: Doc[];
// }

// Define Doc (para archivos sueltos) y Grupo (para agrupaciones)
interface Doc {
  slug: string
  title: string
  content: string
  createdAt?: string
  updatedAt?: string
}

interface DocGroup {
  slug: string // Slug del grupo (opcional/generado)
  title: string
  children: Doc[]
}

import navConfig from '../../docs/nav.json'

// Helper function to get the slug from the path
const getSlug = (path: string) => {
  return path.split('/').pop()?.replace('.md', '') || ''
}

export const getBlogPosts = async (locale: string): Promise<Post[]> => {
  const files = import.meta.glob('/blog/**/*.md', { query: '?raw', import: 'default' })
  const posts: Post[] = []

  for (const path in files) {
    if (path.includes(`/blog/${locale}/`)) {
      const importer = files[path]
      if (importer) {
        const rawContent = (await importer()) as string
        const { data, content } = matter(rawContent)
        posts.push({
          slug: getSlug(path),
          title: data.title,
          date: data.date,
          content: marked(content) as string,
        })
      }
    }
  }

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

const allDocs = import.meta.glob('/docs/**/*.md', { query: '?raw', import: 'default' })

export const getDoc = async (locale: string, slug: string): Promise<Doc | null> => {
  const path = `/docs/${locale}/${slug}.md`
  const importer = allDocs[path]
  if (importer) {
    const rawContent = (await importer()) as string
    const { data, content } = matter(rawContent)
    return {
      slug,
      title: data.title,
      content: marked(content) as string,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }
  }
  return null
}

// Define un tipo para el ítem de navegación, que puede ser un Doc o un Grupo de Docs
type NavItem = Doc | { slug: string; title: string; children: Doc[] };


type NavConfigItem = string | { title: string; children: NavConfigItem[] };
type NavResultItem = Doc | DocGroup; // DocGroup es recursivo, definido arriba

// Función recursiva para procesar los hijos de un grupo
const processNavItems = async (locale: string, navItems: NavConfigItem[]): Promise<NavResultItem[]> => {
  const results: NavResultItem[] = [];

  for (const item of navItems) {
    if (typeof item === 'string') {
      // Caso base: Es un SLUG (documento final)
      const doc = await getDoc(locale, item);
      if (doc) {
        results.push(doc);
      }
    } else {
      // Caso recursivo: Es un GRUPO
      const childrenResults = await processNavItems(locale, item.children); // ¡Llamada recursiva!

      if (childrenResults.length > 0) {
        results.push({
          slug: item.title.toLowerCase().replace(/\s/g, '-'),
          title: item.title,
          children: childrenResults as DocChild[], // Asignamos los hijos procesados
        });
      }
    }
  }
  return results;
};


export const getDocs = async (locale: string): Promise<NavResultItem[]> => {
  const nav = (navConfig as Record<string, NavConfigItem[]>)[locale] || [];

  // Usamos la función recursiva para procesar el array de navegación principal
  const docs = await processNavItems(locale, nav);

  // NOTA: La función getDoc que usas internamente se mantiene igual
  // Se asume que getDoc retorna Doc | null

  return docs;
}
