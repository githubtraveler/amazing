# R&D Arts Inc Company Website

## Setup

Install [node.js](http://nodejs.org/). 

Insall grunt tool
```
npm install -g grunt-cli
```

Go to project folder
```
npm install
```

## Use

Prepare (compress and validate) files for dstribution. The action below will place production version fi the site files into `dist` folder
```
grunt
```

Clean generated files
```
grunt clean
```

Start development server
```
grunt conect:dev
```

Start development server with livereload 
```
grunt livereload
```




