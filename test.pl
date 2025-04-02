#!/usr/bin/perl
use IO::Socket;
$SOCKET = IO::Socket::INET->new(PeerAddr => "127.0.0.1", PeerPort => "80", Proto => "tcp") or die "Could not create socket\n";
for (1..100) {
    print $SOCKET "GET /?$_ HTTP/1.0\r\nHost: 127.0.0.1\r\n\r\n";
}
close($SOCKET);

