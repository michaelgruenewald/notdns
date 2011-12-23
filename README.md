The DNS server that tells you stuff you already know.

# Notdns?

A silly play on words with two meanings: First of all it's *not* a *DNS* 
server, because it lacks virtually every feature a normal DNS server provides. 
Also, it works in emergency (=german "Not") cases, where you don't have the 
right DNS entries configured. Notdns works without configuration. In fact, you 
can't even configure it.

# Howto and Features

Just run notdns.js, it will listen on the DNS port (UDP 53, needs special low 
port right under Linux etc.). You can then request DNS records which are 
generated on demand, based on your request. See these examples:

    $ dig @localhost +noall +answer 127-0-0-1.a.some.domain
    127-0-0-1.a.some.domain. 60     IN      A       127.0.0.1

    $ dig @localhost +noall +answer 12-34-56-78-987.srv.some.domain
    12-34-56-78-987.srv.some.domain. 60 IN  SRV     0 0 987 12.34.56.78.

    $ dig @localhost +noall +answer www.google.de-80.srv.some.domain
    www.google.de-80.srv.some.domain. 60 IN SRV     0 0 80 www.google.de.

# Disclaimer

Notdns is obviously not complaint to any specification, buggy, insecure and 
useless. Have fun with it!
