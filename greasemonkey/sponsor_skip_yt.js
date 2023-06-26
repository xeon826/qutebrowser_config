
// ==UserScript==
// u/name         Auto skip youtube sponsor segments
// u/version      1.0.0
// u/description  Speed up and skip YouTube ads automatically
// u/author       xeon826
// u/match        *://*.youtube*.com/*
// u/exclude      *://*.youtube.com/subscribe_embed?*
// ==/UserScript==
var ranQuery = false, segments = false
setInterval(async () => {
    var ad = [...document.querySelectorAll('.ad-showing')][0],
        video = document.querySelector('video');

    if (!ad && video && !ranQuery) {
        var videoId = getQueryVariable('v');
        ranQuery = true
        segments = await getSegments(videoId)
    }
    if (segments) {
        // console.log('typeof clause was true', segments)
        // var video = document.querySelector('video.video-stream.html5-main-video');
        segments.forEach(segment => {
            // console.log('video:', video)
            // console.log('category is sponsor is: ', segment.category == 'sponsor')
            // console.log('video in current time is: ', video.currentTime >= segment.segment[0] && video.currentTime <= segment.segment[1])
            if (segment.category == 'sponsor' && video.currentTime >= segment.segment[0] && video.currentTime <= segment.segment[1]) {
                console.log('Sponsor skipped')
                video.currentTime = segment.segment[1] + 1;
            }
        })
    } else 
        console.log('segments false')
}, 1000)

async function getSegments(videoId) {
  console.log('GET SEGMENTS')
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
