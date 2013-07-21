# Markdown Presenter

Simple presentation framework based on Markdown.

This provides a method for authoring presentations (lecture notes, slides,
etc) using Markdown and rendering it in a format tailored for on-screen
display.

* Content can be written as a single document that can either be displayed
in it's entirety, or on a page-by-page basis
* Embedded code snippets are rendered with syntax highlighting and can be
interactive to support teaching concepts about various web languages
* Simple keyboard navigation when displaying the presentation

The following tools are used to add to the awesomeness:

* [markdown.js](https://github.com/evilstreak/markdown-js) - Markdown parser
that provides an intermediate tree format for mucking around with the content
* [ACE Ajax Editor](http://ace.ajax.org) - Provides syntax highlighting and
text editing capabilities for code snippets
* [Bootstrap](http://twitter.github.io/bootstrap/) - Of course...

## Presentation Layout

Presentations and written in Markdown, which provides a simple, text-based
method for authoring content. This means code examples are super easy, and
it fits in well with source control.

Markdown resources:

* <http://daringfireball.net/projects/markdown/>
* <https://help.github.com/articles/github-flavored-markdown>

### Hierarchy

The Markdown document is broken down into pages by header tags:

* **Sections** (`h1`) - Top level of organization for the document, the
current section is displayed at the top of the page. Presentations will
typically have a small number of these
* **Topics** (`h2`) - Current topic of discussion, displayed as the header
on each page
* **Concepts** (`h3`) - Allows topics to be broken down into further chunks
as needed. Page will display the current topic title, along with the section

The idea is that each topic/concept page should represent a focused subject
to discuss. The page can scroll a bit if needed (this isn't PowerPoint), but
that should be kept to a minimum.

For instance:

```markdown
# Really Interesting Subject

This is the first page

## First Thing to Talk About

This is the second page

## Another Topic

Overview for this topic

### Point 1

More detail about the second topic
```

### Markdown Support

The Markdown parser supports the standard syntax described
[here](http://daringfireball.net/projects/markdown/). The following features
are also supported:

* Merged the markdown.js *gfm* branch to support [GitHub flavored markdown]
(https://help.github.com/articles/github-flavored-markdown). The primary
reason for this is to support fenced code blocks
* Merged inline HTML support from <https://github.com/cadorn/markdown-js>

This supports arbitrary HTML within the Markdown document:

```markdown
# Inline HTML Example

This is a markdown paragraph

<table>
  <tr>
    <td>
    Tables and some other things might be easier in raw HTML than Markdown
    </td>
  </tr>
</table>
```

Note the initial line of an HTML block cannot be preceded by any whitespace.
## Code Sample Support

The key feature of the presentations is the ability to include code snippets
of in the markdown source which are rendered in an interactive editor. The
[ACE Ajax Editor](http://ace.ajax.org/) is used to provide this functionality.

## Other Features

## Installing/Running
