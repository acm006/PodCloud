var feedURL;
var audioURL;
var savedEpisodes = [];


function loadSavedEpisodes () {
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
		entryTemplate: '<li><a href="#" id={url}>{title}</a><i class="glyphicon glyphicon-remove"></i></li>'
	});
	savedEpisodes = [];
	$("li").each(function() {
   	savedEpisodes.push($(this).text());
  	});
}

function addNewPodcast () {
	feedURL = $("#newURL").val();
	loadFeed();
	$("#newURL").val("");
}

function updateSavedState(){
	localStorage.clear();
	localStorage.savedEpisodes = JSON.stringify(savedEpisodes);
}

function playThisEpisode () {
	$("#currentPodcast").attr("src",audioURL);
	$("#currentPodcast")[0].volume = 0.5;
	$("#currentPodcast")[0].load();
	$("#currentPodcast")[0].play();
	$("#playbackControl").removeClass("glyphicon-info-sign");
	$("#controls").html("");
	$("#playbackControl").addClass("glyphicon-pause");
	$("#volumeIndicator").html("Volume: "+	Math.round($("#currentPodcast")[0].volume*10));
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
	
	loadSavedEpisodes();
	
	$("#addFeedButton").click(function(){
		addNewPodcast();
		updateSavedState();
	});
	
	$("#feedDiv").on('click', 'a', function () {
		audioURL = $(this).attr('id');		
		playThisEpisode();
	});
	
	$("#playbackControl").click(function(){

		if($("#playbackControl").hasClass("glyphicon-pause")){
			$("#currentPodcast")[0].pause();
			$("#playbackControl").removeClass("glyphicon-pause");
			$("#playbackControl").addClass("glyphicon-play");
		}

		else{
			$("#currentPodcast")[0].play();
			$("#playbackControl").removeClass("glyphicon-play");
			$("#playbackControl").addClass("glyphicon-pause");;
		}
	});
	
	$(".volume").click(function(){
		var volumeTarget = $(event.target);
		if (volumeTarget.is("#volUp")) {
			if($("#currentPodcast")[0].volume < .99){
				$("#currentPodcast")[0].volume = $("#currentPodcast")[0].volume + 0.1;
			}
		}  		
		if (volumeTarget.is("#volDown")){
			if($("#currentPodcast")[0].volume > 0.01){
				$("#currentPodcast")[0].volume = $("#currentPodcast")[0].volume - 0.1;
			}
		}
		$("#volumeIndicator").html("Volume: "+	Math.round($("#currentPodcast")[0].volume*10));
	});

	$("#feedDiv").on('click', 'i', function () {
		toRemove = $(this).parent();
		episodeIndex = toRemove.index();
		savedEpisodes.splice(episodeIndex,1);	
		$(toRemove).remove();
		updateSavedState();
	});	
	
	$("#clearButton").on('click', function () {
		$("#feedEntries").empty();
		savedEpisodes = [];
		localStorage.clear();
	});
	
})