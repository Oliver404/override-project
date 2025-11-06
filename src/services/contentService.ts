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

interface Doc {
  slug: string;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
  children?: Doc[];
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

export const getDocs = async (locale: string): Promise<Doc[]> => {
  const nav = (navConfig as Record<string, any>)[locale] || []
  const docs: Doc[] = []

  for (const group of nav) {
    const children: Doc[] = []
    for (const slug of group.children) {
      const doc = await getDoc(locale, slug)
      if (doc) {
        children.push(doc)
      }
    }
    docs.push({
      slug: group.title.toLowerCase().replace(/\s/g, '-'),
      title: group.title,
      content: '',
      children,
    })
  }

  return docs
}
