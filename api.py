#!/home/asiegel/dev/bin/python

import MySQLdb
import json

print "Content-Type: text/plain\n"

conn = MySQLdb.connect(host="localhost", user="asiegel_web", passwd="buttslol!", db="asiegel_oghhhviz")
c = conn.cursor()
c.execute("SELECT * FROM submissions ORDER BY dt DESC")
results = c.fetchmany(10000)
#print "["
print "NAME,DT,USER,LASTUPDATE,SCORE,URL,ARTIST,TRACKNAME,YEAR,FLAIR"
count = 0
for r in results:
	#jsonOutput = json.dumps({"name": r[1], "dt": r[2], "user": r[4], "lastupdate": r[5], "score": r[6], "url": r[7], "artist": r[8], "trackname": r[9], "year": r[10], "flair": r[11]}, sort_keys=True)
	print(str(r[1])+","+str(r[2])+","+str(r[4])+","+str(r[5])+","+str(r[6])+","+str(r[7])+","+str(r[8]).replace(",","")+","+str(r[9]).replace(",","")+","+str(r[10])+","+str(r[11]))
	#count += 1
	#if count < len(results):
	#	print jsonOutput +","
	#else:
	#	print jsonOutput
#print "]"
