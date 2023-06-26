
// ==UserScript==
// u/name         Auto Skip YouTube Ads and Sponsors
// u/version      1.0.0
// u/description  Speed up and skip YouTube ads automatically
// u/author       jso8910, xeon826
// u/match        *://*.youtube*.com/*
// u/exclude      *://*.youtube.com/subscribe_embed?*
// ==/UserScript==
var ranQuery = false, segments = false
setInterval(async () => {
    const btn = document.querySelector('.videoAdUiSkipButton,.ytp-ad-skip-button')
    if (btn) {
        btn.click()
    }
    const ad = [...document.querySelectorAll('.ad-showing')][0];
    if (ad) {
        var adVideo = document.querySelector('video');
        adVideo.playbackRate = 16;
        adVideo.hidden = true;
    }  else if (video = document.querySelector('video.video-stream.html5-main-video') && !ranQuery) {
        var videoId = getQueryVariable('v');
        ranQuery = true
        segments = await getSegments(videoId)
    }
    if (segments) {
        // console.log('typeof clause was true', segments)
        var video = document.querySelector('video.video-stream.html5-main-video');
        segments.forEach(segment => {
            // console.log('video:', video)
            // console.log('category is sponsor is: ', segment.category == 'sponsor')
            // console.log('video in current time is: ', video.currentTime >= segment.segment[0] && video.currentTime <= segment.segment[1])
            if (segment.category == 'sponsor' && video.currentTime >= segment.segment[0] && video.currentTime <= segment.segment[1]) {
                // console.log('skip was ran')
                video.currentTime = segment.segment[1] + 1;
            }
        })
    } else 
        console.log('segments false')
}, 50)

async function getSegments(videoId) {
  // console.log('GET SEGMENTS')
  const response = await fetch("https://sponsor.ajay.app/api/skipSegments?videoID=" + videoId);
  const jsonData = await response.json();
  return jsonData;
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    console.log('Query variable %s not found', variable);
}
