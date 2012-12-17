/**
 * ZDB-Linkresolver
 * Autor: Carsten Klee
 * */
var server = require("./server");
var router = require("./router");
var resolver = require("./resolver");

server.start(router.route, resolver.resolve);