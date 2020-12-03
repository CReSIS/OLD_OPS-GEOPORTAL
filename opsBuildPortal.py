r'''
CReSIS OpenPolarServer ExtJS Custom Build Script

About:
	Run this script to create a new EXTJS build with all of the custom CReSIS modifications.
	
Example: 
	(MOVE TO APP DIRECTORY) cd C:\Users\kpurdon.HOME\Documents\Projects\github\OPS-GEOPORTAL
	(PRODUCTION BUILD, ALL DEFAULTS) python opsBuildPortal.py
	(TESTING BUILD, DEFAULT OL PATH) python opsBuildPortal.py --testing=True
	(TESTING BUILD, CUSTOM OL PATH)  python opsBuildPortal.py --testing=True --olDir=r'S:\dataproducts\GIS_data\ops\OPS-OL-BUILD\ol'
	
Inputs:
	[1] testing (boolean): should this be a test build (not minimized)
		DEFAULT: false
	[2] olDir (string): absolute path to CReSIS OpenLayers build
		DEFAULT: r'S:\dataproducts\GIS_data\ops\OPS-OL-BUILD\ol'
		
Output:
	ExtJS built files located at:
		If testing = true /build/testing/OPS/*
		If testing = false /build/production/OPS/*
	/opsBuild.log is updated
		
EVERYTHING UNDER .../OPS IS THE NEW COMPLETE MINIMIZED EXTJS BUILD
'''

import argparse,subprocess,os,getpass,datetime
from distutils.dir_util import copy_tree

# GET SOME INFORMATION
curUser = getpass.getuser()
curDate = str(datetime.datetime.now())

# SET THE CUSTOM OL DIRECTORY
olDir=os.getcwd()+'\\ol-custom\\ol'

# PARSE INPUT ARGUMENTS
parser = argparse.ArgumentParser(description='CReSIS OpenPolarServer ExtJS Custom Build Script')
parser.add_argument('--testing',default=False,help='testing (boolean): should this be a test build (not minimized)')
parser.add_argument('--olDir',default=olDir,help='olDir (string): absolute path to CReSIS OpenLayers build')
inArgs = parser.parse_args()

# BUILD EXTJS AND COPY OL RESOURCE
if inArgs.testing:
	subprocess.call('sencha app build testing', stdin=None, stdout=None, stderr=None, shell=False) # BUILD TESTING
	copy_tree(olDir,os.getcwd()+'\\build\\testing\\OPS\\resources\\ol') # COPY OL BUILD SOURCE
	indexFileObj = open(os.getcwd()+'\\build\\testing\\OPS\\index.html','w') # OPEN INDEX (CLEAR EXISTING CONTENTS)
	logStr = 'TESTING BUILD CREATED ON %s BY %s\n' % (curDate,curUser) # CREATE LOG ENTRY
else:
	subprocess.call('sencha app build', stdin=None, stdout=None, stderr=None, shell=False) # BUILD PRODUCTION
	copy_tree(olDir,os.getcwd()+'\\build\\production\\OPS\\resources\\ol') # COPY OL BUILD SOURCE
	indexFileObj = open(os.getcwd()+'\\build\\production\\OPS\\index.html','w') # OPEN INDEX (CLEAR EXISTING CONTENTS)
	logStr = 'PRODUCTION BUILD CREATED ON %s BY %s\n' % (curDate,curUser) # CREATE LOG ENTRY

# WRITE NEW INDEX.HTML
indexFileObj.write('''<!DOCTYPE HTML>
<html>
<head>
	<meta charset="UTF-8">
	<title>OpenPolarServer</title>
	<link rel="icon" href="resources/favicon.ico" type="image/x-icon"/>
	<link rel="shortcut icon" href="resources/favicon.ico" type="image/x-icon"/>
	<link rel="stylesheet" type="text/css" href="resources/ol/theme/default/style.css">
	<script type="text/javascript" src="resources/ol/OpenLayers.js"></script>
	<script type="text/javascript" src="resources/ol/proj4js/lib/proj4js-compressed.js"></script>
	<link rel="stylesheet" href="resources/OPS-all.css"/>
	<script type="text/javascript" src="app.js"></script>
	<style type="text/css"> .legend {padding-left: 50px;} </style>
</head>
<body></body>
</html>''')
indexFileObj.close()

# UPDATE LOG
logFileObj = open(os.getcwd()+'\\opsBuildPortal.log','a')
logFileObj.write(logStr)
logFileObj.close()
