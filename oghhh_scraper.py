#!/usr/bin/python

import praw
import time
import re
import html
from unidecode import unidecode
from pprint import pprint

count = 0        # total submissions
songCount = 0    # youtube submissions
selfCount = 0    # self submissions
otherCount = 0   # other types of submissions
cleanCount = 0   # clean scraped song submissions

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
		#pprint(vars(r))
		#break
	print("total posts: "+ str(count) +", self posts: "+ str(selfCount) +", song posts: "+ str(songCount) +", other posts: "+ str(otherCount))
	print("clean data posts: "+ str(cleanCount))

def selfPost(r):
	global selfCount
	selfCount += 1

def songPost(r):
	global songCount
	global cleanCount
	dt = int(r.created_utc)
	name = r.name
	title = html.unescape(str(unidecode(r.title)))

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

	user = ""
	try:
		user = r.author.name
	except:
		pass
	score = r.score
	url = r.url
	thumbnail = r.thumbnail
	# TODO: download thumbnail

	if year > 0 and len(artist) > 0 and len(trackname) > 0:
		#print(title)
		#print(str(songCount) +": "+ artist +" - "+ trackname +" ["+ str(year) +"], "+ user +", "+ str(score))
		# TODO: check for submission in database; update if existing, insert if new
		cleanCount += 1
	else:
		print(title)
	songCount += 1
	
def otherPost(r):
	global otherCount
	#title = html.unescape(str(unidecode(r.title)))
	#print(title)
	otherCount += 1


reddit = praw.Reddit(user_agent="OGHHHViz (by /u/datadreamer)")
list()
