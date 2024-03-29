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

var ranQuery = false,
  segments = [],
  ad = [...document.querySelectorAll(".ad-showing")][0],
  video = document.querySelector("video"),
  videoId = false,
  originalVideoId = false;
setInterval(async () => {
  ad = [...document.querySelectorAll(".ad-showing")][0];

  video = document.querySelector("video");

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

// setInterval(async () => {
//   var clickbaitThumbnails = document.querySelectorAll(
//     "#thumbnail[href] > yt-image > img:not(.fixed)"
//   );
//   if (clickbaitThumbnails.length) {
//     console.log("THERE ARE CLICKBAIT THUMBNAILS");
//     clickbaitThumbnails.forEach(async (thumb) => {
//       try {
//         var thumbGrandparent = thumb.parentElement.parentElement;
//         var new_img = thumb.cloneNode(true);
//         var videoId =
//           thumbGrandparent.hasAttribute("href") &&
//           thumbGrandparent.getAttribute("href").includes("=")
//             ? thumbGrandparent.getAttribute("href").split("=")[1]
//             : thumbGrandparent.getAttribute("href").split("/")[2];
//         const apiUrl =
//           "https://dearrow-thumb.ajay.app/api/v1/getThumbnail?videoID=" +
//           videoId;
//         var imgUrl = await fetchImage(apiUrl);
//         if (!imgUrl) {
// 		  thumb.classList.add('fixed')
//           return;
//         }
//         new_img.src = imgUrl;
//         new_img.classList.add("fixed");
//         new_img.style.visibility = "visible";
//         thumb.parentElement.replaceChild(new_img, thumb);
//       } catch (e) {
//         console.log("error", e);
//         console.log(
//           "grandparent has href",
//           thumbGrandparent.hasAttribute(href)
//         );
//         console.log("thumb", thumb);
//         console.log("thumbGrandparent", thumbGrandparent);
//       }
//       // thumb.parentElement.replaceChild(new_img, thumb);

//       // fetch(apiUrl)
//       // .then((response) => response.blob())
//       // .then((blob) => {
//       //   const imageUrl = URL.createObjectURL(blob);
//       //   new_img.src = imageUrl;
//       //   new_img.style.visibility = "visible";
//       // })
//       // .catch((error) => console.error("Error:", error));
//     });
//   }
// }, 1000);

async function fetchImage(apiUrl) {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      // throw new Error("Network response was not OK");
      return false;
    }
    const myBlob = await response.blob();
    var imgUrl = URL.createObjectURL(myBlob);
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
    return false;
  }
  return imgUrl;
}
function hexToBase64(str) {
  return btoa(
    String.fromCharCode.apply(
      null,
      str
        .replace(/\r|\n/g, "")
        .replace(/([\da-fA-F]{2}) ?/g, "0x$1 ")
        .replace(/ +$/, "")
        .split(" ")
    )
  );
}
