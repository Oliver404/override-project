# Modern Vue 3 Application

This is a modern Vue 3 application built with Vite, TypeScript, and Tailwind CSS. It includes a landing page, a documentation section, and a blog, all with multi-language support and a light/dark mode theme switcher.

## Features

- **Vue 3:** Built with the latest version of the progressive JavaScript framework.
- **Vite:** Fast and lean development server and build tool.
- **TypeScript:** Superset of JavaScript that adds static typing.
- **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
- **Vue Router:** Official router for Vue.js.
- **Pinia:** Intuitive, type-safe, and flexible state management for Vue.
- **vue-i18n:** Internationalization plugin for Vue.js.
- **Markdown Support:** Documentation and blog posts are written in Markdown.
- **Light/Dark Mode:** Dynamic theme switching with persistence to local storage.
- **GitHub Pages Deployment:** Automated deployment with GitHub Actions.

## Project Setup

### Prerequisites

- Node.js (v20.x or higher)
- npm

### Installation

1.  Clone the repository:

    ```sh
    git clone https://github.com/your-username/your-repository.git
    ```

2.  Navigate to the project directory:

    ```sh
    cd your-repository
    ```

3.  Install the dependencies:

    ```sh
    npm install
    ```

### Running the Project Locally

To start the development server, run the following command:

```sh
npm run dev
```

This will start the development server at `http://localhost:5173`. The application will automatically reload when you make changes to the code.

### Building for Production

To build the application for production, run the following command:

```sh
npm run build
```

This will create a `dist` directory with the optimized and minified production build.

## Content Management

### Adding New Documentation Pages

To add a new documentation page, create a new Markdown file in the `docs/{locale}` directory, where `{locale}` is the two-letter ISO code for the language (e.g., `en`, `es`). The file should include front-matter with a `title` property.

Example: `docs/en/new-page.md`

```markdown
---
title: New Page
---

# New Page Content

This is a new page in the documentation.
```

### Adding New Blog Posts

To add a new blog post, create a new Markdown file in the `blog/{locale}` directory. The file should include front-matter with `title` and `date` properties.

Example: `blog/en/new-post.md`

```markdown
---
title: New Blog Post
date: '2023-11-01'
---

# New Blog Post Content

This is a new blog post.
```

## Deployment

This project is configured for automated deployment to GitHub Pages using GitHub Actions. To deploy the application, you need to:

1.  Push your changes to the `main` branch.
2.  Update the `base` option in the `vite.config.ts` file to match your repository name (e.g., `/your-repository/`).
3.  The GitHub Actions workflow will automatically build and deploy the application to the `gh-pages` branch.
