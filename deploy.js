#!/usr/local/bin/node

require('shelljs/global');

var jf = require('jsonfile');
var obj = jf.readFileSync("manifest.json");
var currentVersion = obj.version;

mkdir('-p', 'build');

var archiveName = "build/RevealURL" + currentVersion + ".zip";
var zipCmd = "zip -r " + archiveName + " *" + " -x build/\\* ";
console.log(zipCmd);
var version = exec(zipCmd).output;

console.log("New version created "+ archiveName);
