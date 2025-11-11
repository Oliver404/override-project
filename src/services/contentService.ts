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

// Exporta la función getDocs con el nuevo tipo de retorno
export const getDocs = async (locale: string): Promise<NavItem[]> => {
  const nav = (navConfig as Record<string, (string | { title: string; children: string[] })[]>)[locale] || [];
  const navItems: NavItem[] = []; // Usamos NavItem[] para almacenar grupos y docs

  for (const item of nav) {
    if (typeof item === 'string') {
      // 1. Es un documento suelto (slug)
      const doc = await getDoc(locale, item);
      if (doc) {
        navItems.push(doc);
      }
    } else {
      // 2. Es un grupo
      const group = item;
      const children: Doc[] = [];
      for (const slug of group.children) {
        const doc = await getDoc(locale, slug);
        if (doc) {
          children.push(doc);
        }
      }
      // Solo agregamos el grupo si tiene hijos
      if (children.length > 0) {
        navItems.push({
          slug: group.title.toLowerCase().replace(/\s/g, '-'),
          title: group.title,
          children,
        });
      }
    }
  }

  return navItems;
}

// export const getDocs = async (locale: string): Promise<Doc[]> => {
//   const nav = (navConfig as Record<string, any>)[locale] || []
//   const docs: Doc[] = []
//
//   for (const group of nav) {
//     const children: Doc[] = []
//     for (const slug of group.children) {
//       const doc = await getDoc(locale, slug)
//       if (doc) {
//         children.push(doc)
//       }
//     }
//     docs.push({
//       slug: group.title.toLowerCase().replace(/\s/g, '-'),
//       title: group.title,
//       content: '',
//       children,
//     })
//   }
//
//   return docs
// }
