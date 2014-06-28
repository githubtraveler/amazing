# R&D Arts Inc Company Website
Website from "src" folder will work as long as there is a web server. To perform code validation and optimizasion, node.js is required.

## Setup Development Tools

Install [node.js](http://nodejs.org/).

Insall grunt tool
```
npm install -g grunt-cli
```

Go to project folder
```
npm install
```

## Use Development Tools

Just run validation

```
grunt
```

Prepare (compress and validate) files for dstribution. The action below will place production version fi the site files into `dist` folder
```
grunt build
```

Make archived production build
```
grunt archive
```

Clean generated files
```
grunt clean
```

Start development server
```
grunt conect:dev:keepalive
```

Start development server with livereload
```
grunt livereload
```

Start production server
```
grunt conect:prod:keepalive
```


