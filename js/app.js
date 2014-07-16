var feedURL;
var savedFeeds = [];
var savedEpisodes = [];

function loadSavedFeeds () {
	if(localStorage.savedEpisodes != null){
		savedEpisodesPlaceholder = JSON.parse(localStorage.savedEpisodes);
		for (i=0; i<savedEpisodesPlaceholder.length; i++) {
			savedEpisodes.push(savedEpisodesPlaceholder[i]);
		}
		if (savedEpisodes.length != 0) {
			for (i=0; i<savedEpisodes.length; i++) {	 		
				$("#feedEntries").append("<li>"+savedEpisodes[i]+"</li>");
			}
		}
	}
}

function loadFeed (){
	$("#feedDiv").rss(feedURL,{
		layoutTemplate: '<ul id="feedEntries">{entries}</ul>',
		entryTemplate: '<p id={url}><a href=#>{title}</a> <i class="glyphicon glyphicon-remove"></p></i>'
	});
}

function saveEpisodes () {
	$("#feedEntries li").each(function() {
  		savedEpisodes.push(this);
	});
	console.log(savedEpisodes);
}

function removeEpisode (toRemove) {
	episodeIndex = toRemove.index()
	savedEpisodes.splice(episodeIndex,1);	
	$(toRemove).remove();
	
}

function removeAll () {
	$("#feedEntries").each(function() {
  		removeEpisode(this);
	});
}

function addNewPodcast () {
	updateFeedURL();
	loadFeed();	
	updateArray();
	$("#newURL").val("");
}

function updateArray(){
	savedFeeds.push(feedURL);
}

function updateFeedURL(){
	feedURL = $("#newURL").val();
}

function updateSavedState(){
	localStorage.savedEpisodes = JSON.stringify(savedEpisodes);
}

function loadVolume(){
	$("#volumeIndicator").html("Volume: "+	$("#currentPodcast")[0].volume);
}

function loadAudioTag(){
		$("#currentPodcast").attr("src",feedURL);
	}

function enableAudioTag (){
		$("#currentPodcast")[0].volume = 0.5;
		$("#currentPodcast")[0].load();
		$("#currentPodcast")[0].play();
		$("#playbackControl").removeClass("glyphicon-info-sign");
		$("#controls").html("");
		$("#playbackControl").addClass("glyphicon-pause");
		loadVolume();	
}

function pausePlayback () {
	$("#currentPodcast")[0].pause();
	$("#playbackControl").removeClass("glyphicon-pause");
	$("#playbackControl").addClass("glyphicon-play");
}

function resumePlayback () {
	$("#currentPodcast")[0].play();
	$("#playbackControl").removeClass("glyphicon-play");
	$("#playbackControl").addClass("glyphicon-pause");
}


$(document).ready(function () {
	loadSavedFeeds();
	
	$("#feedDiv").on('click', 'a', function () {
		feedURL = $(this).attr('id');		
		loadAudioTag();
		enableAudioTag();
	});
	
	$("#feedDiv").on('click', 'i', function () {
		toRemove = $(this).parent();
		removeEpisode(toRemove);
	});
	
	$("#playbackControl").click(function(){
		if($("#playbackControl").hasClass("glyphicon-pause")){
			pausePlayback();
		}
		else{
			resumePlayback();
		}
	});
	
	$("#volUp").click(function(){
		if($("#currentPodcast")[0].volume < .99){
			$("#currentPodcast")[0].volume = $("#currentPodcast")[0].volume + 0.1;
			loadVolume();
		}
	});
	
	$("#volDown").click(function(){
		if($("#currentPodcast")[0].volume > 0.01){
			$("#currentPodcast")[0].volume = $("#currentPodcast")[0].volume - 0.1;
			loadVolume();
		}
	});
	
	$("#addFeedButton").click(function(){
		addNewPodcast();
		saveEpisodes();
		updateSavedState();
	});
	
	$("#clearButton").on('click', function () {
		removeAll();
		localStorage.clear();
	});
	
})