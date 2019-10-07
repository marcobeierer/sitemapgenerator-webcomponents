#!/bin/sh

rm build/*
riot --ext tag . build
riot --ext tag.html . build

cat libs/*.js > release/sitemap-generator-latest.js
#cat *.js >> release/sitemap-generator-latest.js
cat build/*.js >> release/sitemap-generator-latest.js

closure-compiler libs/*.js > release/sitemap-generator-latest.min.js
#closure-compiler *.js >> release/sitemap-generator-latest.min.js
closure-compiler build/*.js >> release/sitemap-generator-latest.min.js

# TODO try:
# closure-compiler -O ADVANCED libs/*.js build/*.js > release/sitemap-generator-latest.min.js
