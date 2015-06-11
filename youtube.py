#!/home/asiegel/dev/bin/python

import cgi
import pafy
import urllib
import sys

print "Content-Type: video/mp4\n"

BUFFER_SIZE = 16 * 1024

form = cgi.FieldStorage()
id = form["id"].value
url = "https://www.youtube.com/watch?v=" + id
video = pafy.new(url)
best = video.getbest()

req = urllib.urlopen(best.url)
while 1:
	chunk = req.read(BUFFER_SIZE)
	if not chunk:
		break
	sys.stdout.write(chunk)



