#!/home/asiegel/dev/bin/python

import MySQLdb
import json

print "Content-Type: text/plain\n"

conn = MySQLdb.connect(host="localhost", user="asiegel_web", passwd="buttslol!", db="asiegel_oghhhviz")
c = conn.cursor()
c.execute("SELECT * FROM submissions ORDER BY dt DESC")
results = c.fetchmany(10000)
print "["
count = 0
for r in results:
	jsonOutput = json.dumps({"name": r[1], "dt": r[2], "user": r[4], "lastupdate": r[5], "score": r[6], "url": r[7], "artist": r[8], "trackname": r[9], "year": r[10], "flair": r[11]}, sort_keys=True)
	count += 1
	if count < len(results):
		print jsonOutput +","
	else:
		print jsonOutput
print "]"