#! /bin/bash

browserify chirper.js | tr -dc '\0-\177' > bundle.js

