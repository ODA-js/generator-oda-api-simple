#!/usr/bin/env bash
echo remove dist
rm -rf dist
echo typescript
tsc 2> /dev/null 1> /dev/null
echo generate
npm run generate 2> /dev/null
echo typescript
tsc 2> /dev/null
npm run updateSchema
npm run genUml
npm run collector
exit 0
