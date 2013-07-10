(function() {
  'use strict'

  var markdownPath = ''
  var activePresentation = null
  var pageList = []
  var pageIndex = 0

  var app = {
    init: function() {
      var params = app.parseSearchParameters()

      // see if content was specified by the query string
      var mdPath = params['md']

      // display settings if no content URL
      if(!mdPath) {
        $('.settings-modal').modal('show')
      }
      else {
        // push md path into input and load it
        $('.md-source').val(mdPath)
        app.loadMarkdownUrl(params)
      }
    },

    parseSearchParameters: function() {
      var params = {}
      if(location.search) {
        // remove the leading ?
        var fragment = location.search.substring(1)

        var tokens = fragment.split('&')
        _.each(tokens, function(token) {
          var pos = token.indexOf('=')
          if(pos >= 0) {
            params[token.substring(0, pos)] = token.substring(pos + 1)
          }
          else {
            params[token] = null
          }
        })
      }
      return params
    },

    formatSearchParameters:  function(parameters) {
      var tokens = _.collect(parameters, function(value, key) {
        if(value !== null) {
          return key + '=' + value
        }
        else {
          return key
        }
      })
      return tokens.join('&')
    },

    updateSearchHistory: function(parameters) {
      var base = location.href
      var pos = base.indexOf('?')
      if(pos > 0) {
        base = base.substring(0, pos)
      }
      history.pushState(parameters, '', base + '?' +
        app.formatSearchParameters(parameters))
    },

    // fetch current markdown file and display the content
    loadMarkdownUrl: function(options) {
      // display warning (yellow) style while loading
      var loadButton = $('.md-load')
        .removeClass('btn-success btn-danger')
        .addClass('btn-warning')

      // clear out the current outline
      var outline = $('.presentation-outline').empty()

      var path = $('.md-source').val()
      if(path) {
        $.ajax(path, {
          success: function(content) {
            try {
              var presentation = app.parseMarkdown(content)

              var sectionList = $('<ul>').appendTo(outline)
              app.updatePresentationOutline(presentation, sectionList)

              markdownPath = path
              app.setActivePresentation(path, presentation, options)

              loadButton
                .removeClass('btn-warning')
                .addClass('btn-success')
            }
            catch(error) {
              app.displaySettingsError(error.message)
              loadButton
                .removeClass('btn-warning')
                .addClass('btn-danger')
            }
          },
          error: function(error) {
            app.displaySettingsError(error.statusText + ' - ' + error.responseText)
            loadButton
              .removeClass('btn-warning')
              .addClass('btn-danger')
          }
        })
      }
      else {
        app.displaySettingsError('Please specify the path to load')
        loadButton
          .removeClass('btn-warning')
          .addClass('btn-danger')
      }
    },

    // parse a markdown document into internal structure that can be used
    // to display a presentation
    parseMarkdown: function(content) {
      var tree = markdown.toHTMLTree(content)

      var top = {
          level: 0,
          children: [],
          content: []
        }
      var stack = [top]

      for(var index = 0; index < tree.length; index++) {
        var node = tree[index]
        if(!_.isArray(node)) {
          continue
        }

        var tag = node[0]
        if((tag === 'h1') || (tag === 'h2') || (tag === 'h3')) {
          var level = parseInt(tag[1])
          var next = {
            level: level,
            title: node[1],
            children: [],
            content: []
          }

          // need content at each intermediate level
          if(level > (top.level + 1)) {
            throw new Error('Invalid hierarchy at: ' + node[1])
          }

          // pop the stack if we need to traverse up
          while(top.level >= level) {
            stack.pop()
            top = stack[stack.length - 1]
          }

          top.children.push(next)
          top = next
          stack.push(top)
        }
        // otherwise add content to the current section
        else {
          if(top.level > 0) {
            stack[stack.length - 1].content.push(node)
          }
          else {
            throw new Error('Found content outside of a section')
          }
        }
      }

      return stack[0].children
    },

    walkPresentation: function(node, callback) {
      var list;
      if(_.isArray(node)) {
        list = node;
      }
      else {
        list = node.children
      }

      for(var index = 0; index < list.length; index++) {
        var item = list[index]
        callback(item)

        if(item.children && (item.children.length > 0)) {
          app.walkPresentation(item.children, callback)
        }
      }
    },

    updatePresentationOutline: function(presentation, outline) {
      var appendChildren = function(children, el, pageOffset) {
        var thisOffset = 0
        for(var index = 0; index < children.length; index++) {
          var child = children[index];

          var href = './?' + app.formatSearchParameters({
            md: markdownPath,
            p: pageOffset
          })
          pageOffset++
          thisOffset++

          var item = $('<li>')
            .append('<a class="navigate" href="' + href + '">' + child.title + '</a>')
            .appendTo(el)

          if(child.children && (child.children.length > 0)) {
            var childList = $('<ul>').appendTo(item)
            thisOffset += appendChildren(child.children, childList, pageOffset)
          }
        }

        return thisOffset
      }

      appendChildren(presentation, outline, 0)
    },

    setActivePresentation: function(path, presentation, options) {
      options = options || {}
      activePresentation = presentation

      app.updatePresentationOutline(presentation, $('.navigation-dropdown'))
      $('.section-title').text(presentation[0].title)

      pageList = []
      app.walkPresentation(activePresentation, function(item) {
        pageList.push(item)
      })

      // use current page from search parameters if possible
      var index = 0
      if(options.p > 0) {
        index = Math.min(options.p, pageList.length - 1)
      }
      app.renderPage(index)
    },

    displaySettingsError: function(error) {
      $('.settings-message')
        .text(error)
        .addClass('alert-error')
        .show()
    },

    hideSettingsMessage: function() {
      $('.settings-message').hide()
    },

    handleNavigate: function(ev) {
      // only used to change the page index at the moment
      var match = ev.target.href.match(/p=(\d+)/)
      app.renderPage(parseInt(match[1]))

      // close menus and modals
      $('.dropdown').removeClass('open')
      $('.modal.in').modal('hide')

      return false
    },

    displayPrevious: function() {
      if(pageIndex > 0) {
        app.renderPage(pageIndex - 1)
      }
    },

    displayNext: function() {
      if(pageIndex < (pageList.length - 1)) {
        app.renderPage(pageIndex + 1)
      }
    },

    renderPage: function(newIndex) {
      if(!_.isNumber(newIndex) || (newIndex < 0)) {
        newIndex = 0
      }
      else if(newIndex >= pageList.length) {
        newIndex = pageList.length - 1
      }
      if(newIndex === pageIndex) {
        return
      }

      pageIndex = newIndex
      var page = pageList[pageIndex]

      var el = $('.current-page')
      el.empty()

      $('<h1>')
        .text(page.title)
        .appendTo(el)

      if(page.content.length) {
        // renderJsonML seems to trash the array passed in, so clone it first
        var content = _.cloneDeep(page.content)
        content.unshift('html')
        el.append(markdown.renderJsonML(content))
      }

      app.updateSearchHistory( { md: markdownPath, p: pageIndex } )
    },

    onKeyUp: function(ev) {
      if(ev.which === 37) {
        app.displayPrevious()
      }
      else if(ev.which === 39) {
        app.displayNext()
      }
    },

    // prevents page from reloading when forms are submitted
    onFormSubmit: function() {
      return false
    }
  }

  var _this = this
  $(document).ready(function() {

    // map of global events and the app method that handles them
    var handlers = {
      '.md-load click': 'loadMarkdownUrl',
      '.navigate click': 'handleNavigate',
      '.display-previous click': 'displayPrevious',
      '.display-next click': 'displayNext',
      'document keyup': 'onKeyUp',
      'form submit': 'onFormSubmit'
    }

    _.each(handlers, function(handler, key) {
      if(!_.isFunction(app[handler])) {
        throw new Error("Invalid handler: " + handler)
      }

      var match = key.match(/([^ ]*) (.*)/)
      var selector = match[1]
      var event = match[2]
      if(selector === 'document') {
        $(document).on(event, app[handler])
      }
      else {
        $(document).on(event, selector, app[handler])
      }
    })

    // now initialize the app
    app.init()
  })

}).call(this)
