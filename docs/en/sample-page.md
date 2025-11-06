---
title: "Sample Page"
createdAt: "2023-10-27T10:00:00Z"
updatedAt: "2023-10-28T12:00:00Z"
---

# Sample Documentation Page

This page serves as a demonstration of the various new features added to enhance the documentation experience.

## Main Features

Below are examples of the features that have been implemented.

### Tabbed Code Blocks

The following is an example of a tabbed code block. You can switch between Kotlin and Java to see the corresponding "Hello, World!" implementation. A copy-to-clipboard button is also available.

---COMPONENT---
{
  "component": "CodeBlock",
  "props": {
    "code": [
      {
        "label": "Kotlin",
        "lang": "kotlin",
        "code": "fun main() {\n    println(\"Hello, World!\")\n}"
      },
      {
        "label": "Java",
        "lang": "java",
        "code": "public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, World!\");\n    }\n}"
      }
    ]
  }
}
---COMPONENT---


---COMPONENT---
{
  "component": "CodeBlock",
  "props": {
    "code": [
      {
        "label": "Kotlin",
        "lang": "kotlin",
        "code": "fun main() {\n    println(\"Hello, World!\")\n}"
      },
      {
        "label": "Java",
        "lang": "java",
        "code": "public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, World!\");\n    }\n}"
      }
    ]
  }
}
---COMPONENT---


---COMPONENT---
{
  "component": "CodeBlock",
  "props": {
    "code": [
      {
        "label": "Gradle",
        "lang": "gradle",
        "code": "dependencies {\n\timplement(\"como.oliver.b.asdf:1.0.0\")\n}"
      }
    ]
  }
}
---COMPONENT---

### Table of Contents

On the right side of this page, you should see a table of contents that includes all the headings from this document. Clicking on a heading will smoothly scroll you to the corresponding section.

#### A Subsection

This is a third-level heading that should appear indented in the table of contents.

##### A Deeper Subsection

This is a fourth-level heading to further demonstrate the hierarchical structure of the table of contents.

### Document Metadata

At the very bottom of this page, the creation and last updated dates are displayed. This information is extracted from the frontmatter of this Markdown file.
