#!/home/asiegel/dev/bin/python

import sys, cgi, urllib, pafy
print "Content-Type: video/mp4\n"
BUFFER_SIZE = 16 * 1024
form = cgi.FieldStorage()
url = "https://www.youtube.com/watch?v=" + form["id"].value
video = pafy.new(url)
best = video.getbest()
req = urllib.urlopen(best.url)
while 1:
	chunk = req.read(BUFFER_SIZE)
	if not chunk:
		break
	sys.stdout.write(chunk)
