# Markdown Presenter

Simple presentation framework based on Markdown.

This provides a method for authoring presentations (lecture notes, slides,
etc) using Markdown and rendering it in a format tailored for on-screen
display.

> * Content can be written as a single document that can either be displayed
> in its entirety, or on a page-by-page basis
> * Embedded code snippets are rendered with syntax highlighting and can be
> interactive to support teaching concepts about various web languages
> * Simple keyboard navigation when displaying the presentation

The following tools are used to add to the awesomeness:

* [markdown-js](https://github.com/evilstreak/markdown-js) - Markdown parser
that provides an intermediate tree format for mucking around with the content
* [ACE Ajax Editor](http://ace.ajax.org) - Provides syntax highlighting and
text editing capabilities for code snippets
* [Bootstrap](http://twitter.github.io/bootstrap/),
  [Bootswatch](http://bootswatch.com/), and
  [Font Awesome](http://fortawesome.github.io/Font-Awesome/) - To keep things
  looking nice

## Presentation Layout

Presentations and written in Markdown, which provides a simple, text-based
method for authoring content. This means code examples are super easy, and
it fits in well with source control.

> Markdown resources:
>
> * <http://daringfireball.net/projects/markdown/>
> * <https://help.github.com/articles/github-flavored-markdown>

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

* Merged the markdown-js *gfm* branch to support [GitHub flavored markdown]
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

Fenced code blocks are the preferred way to mark code snippets in the
document, this also allows you to specify the language for syntax
highlighting purposes.

    ```javascript
    var foo = function(bar, baz) {
      // pretty useless function I would say...
      return bar + baz;
    }
    ```

becomes

```javascript
var foo = function(bar, baz) {
  // pretty useless function I would say...
  return bar + baz;
}
```

If for some reason you don't want the code to be editable, you can add the
*readonly* class to the block

    ```javascript.readonly
    var dont = 'touch me'
    ```

becomes

```javascript.readonly
var dont = 'touch me'
```

## JavaScript Snippets

Adding the 'interactive' class to a code block adds a toolbar that will
execute the code snippet.

    ```javascript.interactive
    alert('hello from JavaScript')
    return 1234
    ```

becomes

```javascript.interactive
alert('hello from JavaScript')
return 1234
```

The results will be displayed in an alert below the code snippet.  Note that
this just performs a simple `eval` on the code, so be careful :)

This also provides information regarding syntax errors

```javascript.interactive
var syntax error
```

and illegal code

```javascript.interactive
var ref = null
console.warn(ref.something)
```

## HTML Snippets

HTML snippets can also be interactive within the editor.

```html.interactive
<ul>
  <li>First</li>
  <li>Second</li>
</ul>
```

Because the code runs within the current page, you get Bootstrap and any
other local styles for free:

```html.interactive
<div class="btn-group dropup">
  <a class="btn dropdown-toggle" data-toggle="dropdown" href="#">
    <i class="icon-beaker" />
    Choose Your Poison
  </a>
  <ul class="dropdown-menu">
    <li><a href="#">Arsenic</a></li>
    <li><a href="#">Mustard Gas</a></li>
    <li><a href="#">Keystone Light</a></li>
  </ul>
</div>
```

## Other Features

Relative image references are updated so they resolve correctly when
displayed as a presentation.

```markdown
![Ice Baby](./img/vice.jpg)
```

![Ice Baby](./img/vice.jpg)

Also, [external links](https://github.com/WebDevBootcamp/markdown-presenter)
are processed so they open in new tabs/windows.

## Installing/Running

The application can be run in a couple of ways:

* Running locally with Node.js
* Using GitHub Pages
* Hosted staticly on a website

The current document is provided through the *md* URL parameter. If no
document is specified on load, the application displays a settings window
that let's you specify the file to display. For instance:

  <http://webdevbootcamp.github.io/markdown-presenter/?md=README.md>

The Markdown content is fetched using AJAX at the moment, which restricts
the content to being on the same domain as the presenter. This is probably
a good thing given that the code editor allows executing arbitary JavaScript
and HTML snippets.

### Running locally with Node.js

Clone the repository locally, and ensure that you have
[Node.js](http://nodejs.org/) and [Bower](https://github.com/bower/bower)
installed, and then running it is as simple as:

* Fetch the various dependencies with `npm install && bower install`
* Run `node server.js` to start the basic webserver
* Finally point a web brower at <http://localhost:3000> and you should be
good to go

A typical use case for this hosting scenario is authoring local Markdown
files prior to checking them into a repository. The *server.js* script can
mount content in a local folder so it can be accessed through the presenter.

For instance, given *../presentations/index.md*, run:

`node server.js --mount '../presentations'`

and then access the file at
<http://localhost:3000/?md=presentations/index.md>. Then you can edit
*index.md* with your favorite text editor and refresh the browser to see the
changes.

### Using GitHub Pages

The *gh-pages* branch is a static version of the website that GitHub will
happily host for you using [GitHub Pages](http://pages.github.com/>). This
means you can host Markdown documents within your cloned version of the
project, or a separate project that is available through your GitHub account.

Note that page builds are triggered on pushing changes to a repository, so
you will need to push at least one commit to your cloned branch before the
application will be available.

### Hosted staticly on a website

Because the application is purely client-side code, you should be able to
host it on pretty much anything. Just copy the resources from the *gh-pages*
branch to your webserver, and that should be all it takes.

Just make sure the Markdown you want to access is also available on that
server.

