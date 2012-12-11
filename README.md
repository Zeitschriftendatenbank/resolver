# ZDB-Linkresolver for node.js
Resolve links from periodicals to related resources. Links back to your catalogue when you have holdings for the resource. Links to ZDB-Opac if not.


# ZDB-Linkresolver für node.js
Resolver von Links auf verwandte Ressourcen (Vorgänger, Nachfolger, Parallelausgabe etc.) von Periodika. Linkt zurück in Ihren Katalog, wenn Ihre Bibliothek Bestand an der verwandten Ressource hat. Linkt in den ZDB-Katalog, wenn nicht.

## Voraussetzungen
* node.js ist installiert
* Die verwandte Ressource ist in der ZDB nachgewiesen
* Sie haben eine ZDB-ID der verwandeten Ressource

## Parameter
__localUrl__ (obligatorisch): Die URL für den Backlink in ihren Katalog (URL-kodiert)

__zdbid__ (obligatorisch): Die ZDB-ID der verwandten Ressource

__bib__ (obligatorisch): Das Bibliothekssigel ihrer Einrichtung

__localSearchParam__ (optional): Eine von 'zdb' (ZDB-ID), 'sig' (Signatur) oder 'so' (Standort)

## Fiktive Beispiele
###1
http://mynodesubdomain.mylibrarydomain.de:8888/?localUrl=http%3A%2F%2Fsuche.mylibrarydomain.de%2Fsearchterm%3D&bib=46&zdb=954135-4&localSearchParam=sig

Der ZDB-Linkresolver sucht nach dem Titel mit der ZDB-ID 954135-4 und schaut nach, ob die Bibliothek, welche das Bibliothekssigel 46 hat, Bestand an dem Titel hat. Wenn ja, wird die Signatur extrahiert (z.B. ZS 12345) und es gibt einen Redirect auf die URL http://suche.mylibrarydomain.de/searchterm=ZS+12345 . Gibt es keinen Bestand wird der Titel im ZDB-OPAC aufgerufen.
###2
http://mynodesubdomain.mylibrarydomain.de:8888/?localUrl=http%3A%2F%2Fsuche.mylibrarydomain.de%2Fsearchterm%3D&bib=46&zdb=954135-4

Hier wird einfach nur nachgeschaut, ob die Bibliothek (Sigel 46) Bestand hat. Wenn ja, gibt dann einen Backlink in den Katalog mit der ZDB-ID als Suchparameter (Grundeinstellung)  http://suche.mylibrarydomain.de/searchterm=954135-4

## Start und Test
Starten Sie den ZDB-Linkresolver mir 'node index.js'. Der Resolver ist unter dem Port 8888 zu finden. Test sind unter /test/ zu finden.