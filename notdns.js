var util = require('util');
var dns = require('dns');
var dgram = require('dgram');
var ndns = require('./ndns/lib/ndns');

var BIND_PORT = 53;

var server = ndns.createServer('udp4');

var mappings = [
    // SRV records by ip
    [/(\d+)-(\d+)-(\d+)-(\d+)-(\d+)\.srv\.(.*)$/i, function(name, response, match) {
        response.header.ancount += 1;
        response.addRR(name, 60, "IN", "SRV", 0, 0, parseInt(match[5]),
                  match[1] + "." + match[2] + "." + match[3] + "." + match[4]);
    }],
    // SRV records by hostname
    [/(.+)-(\d+)\.srv\.(.*)$/i, function(name, response, match) {
        response.header.ancount += 1;
        response.addRR(name, 60, "IN", "SRV", 0, 0, parseInt(match[2]), match[1]);
    }],
    // A records by ip
    [/(\d+)-(\d+)-(\d+)-(\d+)\.a\.(.*)$/i, function(name, response, match) {
        response.header.ancount += 1;
        response.addRR(name, 60, "IN", "A", 
                  match[1] + "." + match[2] + "." + match[3] + "." + match[4]);
    }],
];

server.on("request", function(request, response) {
    response.setHeader(request.header);

    for (var i = 0; i < request.q.length; i++)
        response.addQuestion(request.q[i]);
    
    for (var i = 0; i < request.q.length; i++) {
        var name = request.q[i].name;
        if (name == ".")
            name = "";
        
        response.header.qr = 1;
        response.header.aa = 1;
        response.header.rd = 0;
        response.header.ra = 0;
        
        for(var i = 0; i < mappings.length; i++) {
            var match = name.match(mappings[i][0]);
            if(match) {
                mappings[i][1](name, response, match);
                break;
            }
        }
    }
    response.send();
});

server.bind(BIND_PORT);
