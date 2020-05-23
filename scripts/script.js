$("#search-form").submit(function($event) {
  $event.preventDefault();
})

function search(query = null, token = null) {
  // Clear results:
  $("#results").html("");
  $("#buttons").html("");

  // Get input:
  if(!query) {
    var query = $("#query-input").val();
  }

  // Run GET Request on API:
  $.get(
    "https://www.googleapis.com/youtube/v3/search", {
      part: "snippet, id",
      q: query,
      pageToken: token,
      type: "video",
      key: "AIzaSyBz5zPFBRv6aD32BlKl0oMX7Bc-M3erS34"
    },
    function(data) {
      var nextPageToken = data.nextPageToken;
      var prevPageToken = data.prevPageToken;
      console.log(data);
      $.each(data.items, function(key, item) {
        // Get output:
        var output = getOutput(item);
        // Display results:
        $("#results").append(output);
      });
      var buttons = getButtons(prevPageToken, nextPageToken, query);
      $("#buttons").append(buttons);
    }
  )
}

function getOutput(item) {
  let videoID = item.id.videoId;
  let title = item.snippet.title;
  let description = item.snippet.description;
  let thumbnail = item.snippet.thumbnails.high.url;
  let channelTitle = item.snippet.channelTitle;
  let videoDate = item.snippet.publishedAt;

  // Output string:
  let output = 
  `<li>
    <div class="list-left">
      <img src="${thumbnail}">
    </div>
    <div class="list-right">
      <h3><a class="fancybox fancybox.iframe" href="http://www.youtube.com/embed/${videoID}">${title}</h3>
      <small>By <span class="channel-title">${channelTitle}</span> on ${videoDate}</small>
      <p>${description}</p>
    </div>
  </li>
  <div class="clearfix"></div>`;

  return output;
}

function getButtons(prevPageToken, nextPageToken, query) {
  var buttonOutput = "";
  if (prevPageToken) {
    buttonOutput += 
    `<div class="button-container">
    <button id="previous-button" class="paging-button" onclick="search('${query}', '${nextPageToken}')">Previous Page<button>
  </div>`
  }
  buttonOutput += 
  `<div class="button-container">
    <button id="next-button" class="paging-button" onclick="search('${query}', '${nextPageToken}')">Next Page<button>
  </div>`
  return buttonOutput;
}