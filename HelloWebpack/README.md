Hello WebPack
=====================

A sample project template for learning building process using Webpack and BEM.

### Objective

This boilerplate is purposefully simple to show the minimal setup needed to create React projects with Webpack and Babel. It aims to be a starting point for learning React, with low cognitive load and as such avoids having many separate config files and advanced configuration options, while providing a solid foundation for new React projects.

### Usage
**Clone this repository**
```
git clone git@github.com:phuttipong/MavenWebApp.git
```

**Install**
```
cd HelloWebpack
npm install
```

**Compile modules into single file**
```
npm run pack
```

Open deploy/index.html in your browser.

Static files are served from the `public` folder, project JavaScript files are bundled from the `src` folder.


### Dependencies

* React & React-DOM & React-Router
* Webpack
* Babel Core
* Babel Loader (With "es2015" and "react" presets)
* Css Loader (With "es2015" and "react" presets)
* underscore as utility
