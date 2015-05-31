#!/home/asiegel/dev/bin/python

import praw
import time
import re
import HTMLParser #import html
import MySQLdb
import urllib
from unidecode import unidecode
from pprint import pprint

count = 0        # total submissions
songCount = 0    # youtube submissions
selfCount = 0    # self submissions
otherCount = 0   # other types of submissions
cleanCount = 0   # clean scraped song submissions

conn = MySQLdb.connect(host="localhost", user="asiegel_web", passwd="buttslol!", db="asiegel_oghhhviz")
c = conn.cursor()

def list():
	global count
	sub = reddit.get_subreddit("oghhh")
	results = sub.get_new(limit=1000)
	for r in results:
		#print(str(count) +" "+ r.domain)
		if r.domain == "youtube.com" or r.domain == "youtu.be" or r.domain == "m.youtube.com":
			songPost(r)
		elif r.domain == "self.OGHHH":
			selfPost(r)
		else:
			otherPost(r)
		count += 1
	print("total posts: "+ str(count) +", self posts: "+ str(selfCount) +", song posts: "+ str(songCount) +", other posts: "+ str(otherCount)+", clean song posts: "+ str(cleanCount))

def otherPost(r):
	global otherCount
	#title = html.unescape(str(unidecode(r.title)))
	#print(title)
	otherCount += 1

def saveThumb(thumbnail, name):
	#with urllib.urlopen(thumbnail) as url:
	url = urllib.urlopen(thumbnail);
	f = open("thumbs/"+name+".jpg", "wb")
	f.write(url.read())
	f.close()
	time.sleep(2)

def selfPost(r):
	global selfCount
	selfCount += 1

def songPost(r):
	global songCount
	global cleanCount
	global c
	global conn
	dt = int(r.created_utc)
	name = r.name
	#title = html.unescape(str(unidecode(r.title)))
	h = HTMLParser.HTMLParser()
	title = h.unescape(str(unidecode(r.title)))

	# artist, trackname, year
	year = -1
	artist = ""
	trackname = ""

	# get artist and trackname
	try:
		m = re.search("(.+(?= -))", title)
		artist = m.group(1)
		if artist.startswith("("):
			artist = artist.split(")")[1]
		elif artist.startswith("["):
			artist = artist.split("]")[1]
		artist = artist.strip()
		m = re.search("(\- (.+?)[\(\[])", title)
		trackname = m.group(2).strip()
	except:
		pass

	# get year by looking for 4 digits between [] or ()
	try:
		m = re.search("(\[|\()([0-9]{4})(\]|\))", title)
		year = int(m.group(2))
	except:
		pass

	# get username if their account still exists
	user = ""
	try:
		user = r.author.name
	except:
		pass

	score = r.score
	url = r.url
	thumbnail = r.thumbnail
	# ensure the title string is cleared of unicode nonsense for the database
	title = title.encode("utf8", "ignore")

	# get link flair if it exists
	flair = ""
	if r.link_flair_text != None:
		flair = r.link_flair_text

	if year > 0 and len(artist) > 0 and len(trackname) > 0:
		#print(title)
		print(str(songCount) +": "+ artist +" - "+ trackname +" ["+ str(year) +"], "+ user +", "+ str(score))
		# check for submission in database; update if existing, insert if new
		c.execute("SELECT * FROM submissions WHERE name = \'" + name + "\'")
		results = c.fetchmany()
		if len(results) > 0:
			c.execute("UPDATE submissions SET score=\'" + str(score) + "\', lastupdate=\'" + str(int(time.time())) + "\' WHERE name = \'" + name + "\'")
		else:
			# download thumbnail
			if thumbnail != "default":
				saveThumb(thumbnail, name)
			try:
				c.execute("INSERT INTO submissions (name, dt, title, user, lastupdate, score, url, artist, trackname, year, flair) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)", (name, dt, title, user, time.time(), score, url, artist, trackname, year, flair))
			except:
				print("FUCKED UP PARSING: "+title)
		conn.commit()
		cleanCount += 1
	else:
		#print(title)
		pass
	songCount += 1


reddit = praw.Reddit(user_agent="OGHHHViz (by /u/datadreamer)")
list()
