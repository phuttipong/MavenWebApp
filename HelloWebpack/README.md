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

### Build/Compile
run 'gulp build' to combine with minify
run 'gulp build-dev' to combine without minify
run 'gulp refresh' to refresh code in deploy folder


then open deploy/index.html in your browser.

### Dependencies
* React & React-DOM & React-Router
* Webpack, Gulp
* Babel Core
* Babel Loader (With "es2015" and "react" presets)
* Css Loader (With "es2015" and "react" presets)
* underscore as utility



### How to test ui together with server
**Create Gulp tool
got to File/Settings/Tools/External Tools to create tool that run 'gulp refresh'
For example
    Tool setting
        Program: C:\Users\phuttipong\AppData\Roaming\npm\gulp.cmd
        Parameter: refresh
        Working Directory: $ProjectFileDir$\Ui


**Create Run/Debug configuration (IntelliJ IDEA)**
create as usual and add the tool to Run/Debug steps so that it deploy ui files to deploy folder.