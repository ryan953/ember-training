# Ember Training

## Installation

1. Install [brew](http://brew.sh/) ```ruby -e "$(curl -fsSL https://raw.github.com/Homebrew/homebrew/go/install)"```
2. Install node.js ```brew install node.js```
3. Install brunch ```npm install -g brunch```
4. Fork this repo
5. Clone your fork
6. Run `npm install`

## Run your app

1. Start server: ```brunch watch --server```
2. Open http://localhost:3333 in Chrome

## Libraries

* [Bootstrap 3.0](http://getbootstrap.com/css/) - CSS framework for rapid scaffolding
* [Flat UI](http://designmodo.github.io/Flat-UI/) - CSS styling
* [Bootstrap for Ember](http://ember-addons.github.io/bootstrap-for-ember/dist/#/show_components/alert) - Bootstrap components for Ember.js

## Generators

This skeleton makes use of [scaffolt](https://github.com/paulmillr/scaffolt#readme) generators to help you create common files quicker. To use first install scaffolt globally with `npm install -g scaffolt`. Then you can use the following command to generate files.

```
scaffolt model <name>             →    app/models/Name.js
scaffolt view <name>              →    app/views/NameView.js
scaffolt controller <name>        →    app/controllers/NameController.js
scaffolt arraycontroller <name>   →    app/controllers/NamesController.js
scaffolt route <name>             →    app/routes/NameRoute.js
scaffolt template <name>          →    app/templatesname.hbs
scaffolt component <name>         →    app/components/NameComponent.js
                                       app/templates/components/name.hbs
```

## Based on [Brunch with Ember Reloaded](https://github.com/gcollazo/brunch-with-ember-reloaded)
