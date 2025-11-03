import matter from 'gray-matter'
import { marked } from 'marked'

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
}

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

export const getDocs = async (locale: string): Promise<Doc[]> => {
  const files = import.meta.glob('/docs/**/*.md', { query: '?raw', import: 'default' })
  const docs: Doc[] = []

  for (const path in files) {
    if (path.includes(`/docs/${locale}/`)) {
      const importer = files[path]
      if (importer) {
        const rawContent = (await importer()) as string
        const { data, content } = matter(rawContent)
        docs.push({
          slug: getSlug(path),
          title: data.title,
          content: marked(content) as string,
        })
      }
    }
  }

  return docs
}
