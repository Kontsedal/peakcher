# Peakcher browser extension

<div align="center">
  <img align="center" src="https://raw.githubusercontent.com/Kontsedal/peakcher/master/readme_assets/logo.svg" width="200"/>
</div>

## Functionality

This extension links to the dropbox account and then provides the ability to:
1) Upload images to your Dropbox from your computer
2) Upload images directly from websites by clicking on "Save to Peakcher" context menu action
3) Set tags to the uploaded pictures and perform a search, displays pictures list in the extension popup window

Also, in the ongoing version, there will be an ability to edit an image (add text, draw curves, lines, rectangles, etc.)


## How it works

Extension communicates directly with Dropbox API. Basically, we need to upload images and JSON 
database with images' data(URL, size, width, height, tags, etc.), and extension settings (popup width, popup height,
protect from data loss flag).

### Auth

To perform operations with Dropbox API, we need Dropbox Auth Token. Dropbox has two options to get it:
1) Redirect to your website with a token in URL if a user allows access to his account
2) Show page with Auth Code if a user allows access to his account, so you need to send it with your 
application secret to Dropbox API to get Auth Token

I choose the second option because I wanted it to be more self-contained. But in this case, we need to send an app secret and therefore have it inside the client-side code. It is terrible, so I decided to create a small serverless handler which 
takes auth code, adds secret, sends a request to Dropbox API and responds with Auth Token ([repo](https://github.com/Kontsedal/peakcher-lambda))

Whole auth flow is described in the next diagram:

![alt text](./readme_assets/authFlow.png)

