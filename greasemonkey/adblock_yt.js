// ==UserScript==
// u/name         Auto Skip YouTube Ads and Sponsors
// u/version      1.0.0
// u/description  Speed up and skip YouTube ads automatically
// u/author       jso8910, xeon826
// u/exclude      *://*.youtube.com/subscribe_embed?*
// @match           https://www.youtube.com/*
// @match           https://www.youtubekids.com/*
// @match           https://www.youtube-nocookie.com/*
// @match           https://m.youtube.com/*
// @match           https://music.youtube.com/*
// ==/UserScript==
setInterval(() => {
  const btn = document.querySelector(
    ".videoAdUiSkipButton,.ytp-ad-skip-button"
  );
  if (btn) {
    btn.click();
  }
  const ad = [...document.querySelectorAll(".ad-showing")][0];
  if (ad) {
    var adVideo = document.querySelector("video");
    adVideo.playbackRate = 16;
    adVideo.muted = true;
    adVideo.hidden = true;
  }
}, 50);

// skip sponsors
var ranQuery = false,
  segments = [],
  ad = [...document.querySelectorAll(".ad-showing")][0],
  video = document.querySelector("video"),
  videoId = false,
  originalVideoId = false;
setInterval(async () => {
  ad = [...document.querySelectorAll(".ad-showing")][0];

  video = document.querySelector("video");
  // console.log('ad', ad, 'video', typeof video !== 'undefined', 'ranQuery', ranQuery)

  videoId = getQueryVariable("v");
  if (
    (getQueryVariable("v") && !ad && !ranQuery) ||
    (originalVideoId && originalVideoId != videoId && videoId)
  ) {
    ranQuery = true;
    originalVideoId = videoId;
    segments = await getSegments(getQueryVariable("v"));
  }
  if (segments.length && !ad) {
    segments.forEach((segment) => {
      var start = segment.segment[0],
        end = segment.segment[1] - 0.1;
      if (
        segment.category == "sponsor" &&
        video.currentTime >= start &&
        video.currentTime < end
      ) {
        console.log("Sponsor skipped");
        video.currentTime = end;
      }
    });
  }
}, 1000);

async function getSegments(videoId) {
  console.log("GET SEGMENTS");
  var jsonData = [];
  try {
    var response = await fetch(
      "https://sponsor.ajay.app/api/skipSegments?videoID=" + videoId
    );
    var jsonData = await response.json();
  } catch (e) {
    console.log("no segments");
  }
  console.log("segments", jsonData);
  return jsonData;
}

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (decodeURIComponent(pair[0]) == variable) {
      return decodeURIComponent(pair[1]);
    }
  }
  return false;
}
