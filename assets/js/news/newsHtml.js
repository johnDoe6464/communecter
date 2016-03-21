var contextMap = {
	"tags" : [],
	"scopes" : {
		codeInsee : [],
		codePostal : [], 
		region :[],
		addressLocality : []
	},
};
var tagsFilterListHTML = "";
var scopesFilterListHTML = "";
var mode = "view";

function buildLineHTML(newsObj,idSession,update)
{
	if(typeof(contextParentType) == "undefined")
		contextParentType="citoyens";
	newsTLLine = "";
	// ManageMenu to the user de signaler un abus, de modifier ou supprimer ces news
	manageMenu = "";
	if (newsObj.author.id==idSession){
		manageMenu='<div class="btn dropdown pull-right no-padding" style="padding-left:10px !important;">'+
			'<a class="dropdown-toggle" type="button" data-toggle="dropdown" style="color:#8b91a0;">'+
				'<i class="fa fa-cog"></i>  <i class="fa fa-angle-down"></i>'+
			'</a>'+
			'<ul class="dropdown-menu">'+
				'<li><a href="javascript:;" class="deleteNews" data-id="'+newsObj._id.$id+'"><small><i class="fa fa-times"></i> Supprimer</small></a></li>';
		if (newsObj.type != "activityStream"){
		manageMenu	+= '<li><a href="#" class="modifyNews" data-id="'+newsObj._id.$id+'"><small><i class="fa fa-pencil"></i> Modifier la publication</small></a></li>';
		}
		manageMenu +=	'</ul>'+
		'</div>';
	}
	
	if(typeof(newsObj.created) == "object")
		var date = new Date( parseInt(newsObj.created.sec)*1000 );
	else
		var date = new Date( parseInt(newsObj.created)*1000 );

	var year = date.getFullYear();
	var month = months[date.getMonth()];
	var day = (date.getDate() < 10) ?  "0"+date.getDate() : date.getDate();
	var hour = (date.getHours() < 10) ?  "0"+date.getHours() : date.getHours();
	var min = (date.getMinutes() < 10) ?  "0"+date.getMinutes() : date.getMinutes();
	var dateStr = day + ' ' + month + ' ' + year + ' ' + hour + ':' + min;
	// if month of the current news is different than currentMonth
	// Added new month link to the right sidebar and a new date separator in the timeline
	// Check if inject the new's form
	if(typeof(currentMonth) != "undefined" && currentMonth != date.getMonth() && update != true)
	{
		form="";
		// Append for at the beginning after the construction of the timeline
		//alert(canPostNews);
		if (currentMonth == null  && canPostNews == true){
		//	alert();
			form = "<div class='newsFeed'>"+
						"<div id='newFeedForm"+"' class='timeline_element partition-white no-padding' style='min-width:85%;'></div>"+
					"</div>";

		}
		currentMonth = date.getMonth();
		// Add item to the left filter by month YY
		linkHTML =  '<li class="">'+
						'<a href="javascript:;" class="linkMonth" onclick="smoothScroll(\'#month'+date.getMonth()+date.getFullYear()+'\');">'+months[date.getMonth()]+' '+date.getFullYear()+'</a>'+
					'</li>';
		// Add date separator by month YY
		$(".newsTLmonthsList").append(linkHTML);
		newsTLLine += '<div class="date_separator" id="'+'month'+date.getMonth()+date.getFullYear()+'" data-appear-top-offset="-400">'+
						'<span>'+months[date.getMonth()]+' '+date.getFullYear()+'</span>'+
					'</div>'+form;
		
		$(".spine").css("bottom","0px");
	}
	else{
		$(".spine").css("bottom","30px");
	}
	
	var color = "white";
	var icon = "fa-user";
	///// Url link to object
	urlAction=buildHtmlUrlAndActionObject(newsObj);
	var imageBackground = "";
	if(typeof newsObj.author != "undefined"){
		if(typeof newsObj.author.type == "undefined") {
			newsObj.author.type = "people";
		}
		if (typeof newsObj.type == "events"){
			newsObj.author.type = "";		
		}
	}
	
	///// Image Backgound
	if(typeof(newsObj.imageBackground) != "undefined" && newsObj.imageBackground){
		imagePath = baseUrl+'/'+newsObj.imageBackground;
		imageBackground = '<a '+url+'>'+
							'<div class="timeline_shared_picture"  style="background-image:url('+imagePath+');">'+
								'<img src="'+imagePath+'">'+
							'</div>'+
						'</a>';
	}
	//END Image Background
	iconStr=builHtmlAuthorImageObject(newsObj);
	if(typeof(newsObj.target) != "undefined" && newsObj.target.type != "citoyens" && newsObj.type!="gantts"){
	if(newsObj.target.objectType=="projects")
			var iconBlank="fa-lightbulb-o";
		else if (newsObj.target.objectType=="organizations")
			var iconBlank="fa-group";
		}
	// END IMAGE AND FLAG POST BY HOSTED BY //
	media="";
	title="";
	if (newsObj.type != "activityStream"){
		if("undefined" != typeof newsObj.name){
			title='<a href="#" id="newsTitle'+newsObj._id.$id+'" data-type="text" data-pk="'+newsObj._id.$id+'" class="editable-news editable editable-click newsTitle"><span class="text-large text-bold light-text timeline_title no-margin" style="color:#719FAB;">'+newsObj.name+"</span></a><br/>";
		}
		text='<a href="#" id="newsContent'+newsObj._id.$id+'" data-type="textarea" data-pk="'+newsObj._id.$id+'" class="editable-news editable-pre-wrapped ditable editable-click newsContent"><span class="timeline_text no-padding">'+newsObj.text+"</span></a>";
		if("undefined" != typeof newsObj.media){
			media=newsObj.media;
		}
	}
	else{
		title = '<a '+urlAction.url+'><span class="text-large text-bold light-text timeline_title no-margin padding-5">'+newsObj.name+'</span></a>';
		if(newsObj.text != "")
			title += "</br>";
		text = '<span class="timeline_text">'+newsObj.text+'</span>';
	}
	tags = "", 
	scopes = "",
	tagsClass = "",
	scopeClass = "";
	if( "object" == typeof newsObj.tags && newsObj.tags )
	{
		$.each( newsObj.tags , function(i,tag){
			tagsClass += tag+" ";
			tags += "<span class='label tag_item_map_list'>#"+tag+"</span> ";
			if( $.inArray(tag, contextMap.tags)  == -1 && tag != undefined && tag != "undefined" && tag != "" ){
				contextMap.tags.push(tag);
				tagsFilterListHTML += ' <a href="javascript:;" class="filter btn btn-xs btn-default text-red" data-filter=".'+tag+'"><span class="text-red text-xss">#'+tag+'</span></a>';
			}
		});
		tags = '<div class="pull-left"><i class="fa fa-tags text-red"></i> '+tags+'</div>';
	}

	var author = typeof newsObj.author != "undefined" ? newsObj.author : null;
	if(contextParentType!="city" && ((author != null && typeof author.address != "undefined") || newsObj.type == "activityStream"))
	{
		if(newsObj.type != "activityStream"){
			postalCode=author.address.postalCode;
			city=author.address.addressLocality;			
		}else{
			if (newsObj.scope != null && newsObj.scope.address != null) {
				postalCode=newsObj.scope.address.postalCode;
				city=newsObj.scope.address.addressLocality;		
			} else {
				postalCode = "NA";
				city = "NA";
			}
		}
		
		if( typeof postalCode != "undefined")
		{
			scopes += "<span class='label label-danger'>"+postalCode+"</span> ";
			scopeClass += postalCode+" ";
			if( $.inArray(postalCode, contextMap.scopes.codePostal )  == -1){
				contextMap.scopes.codePostal.push(postalCode);
			}
		}
		if( typeof city != "undefined")
		{
			scopes += "<span class='label label-danger'>"+city+"</span> ";
			scopeClass += city+" ";
			if( $.inArray(city, contextMap.scopes.addressLocality )  == -1){
				cityFilter=city.replace(/\s/g, "");
				console.log(city);
				contextMap.scopes.addressLocality.push(cityFilter);
				scopesFilterListHTML += ' <a href="#" class="filter btn btn-xs btn-default text-red" data-filter=".'+postalCode+'"><span class="text-red text-xss">'+city+'</span></a>';
			}
		}
		scopes = '<div class="pull-right"><i class="fa fa-circle-o"></i> '+scopes+'</div>';
	}
	var objectDetail = (newsObj.object && newsObj.object.displayName) ? '<div>Name : '+newsObj.object.displayName+'</div>'	 : "";
	var objectLink = (newsObj.object) ? ' <a '+urlAction.url+'>'+iconStr+'</a>' : iconStr;
	// HOST NAME AND REDIRECT URL
	if (typeof(newsObj.target) != "undefined" && newsObj.target.id != newsObj.author.id  && newsObj.type!="needs" && newsObj.type!="gantts"){
		redirectTypeUrl=newsObj.target.objectType.substring(0,newsObj.target.objectType.length-1);
		if (newsObj.target.objectType=="citoyens")
			redirectTypeUrl="person";

		urlTarget = 'href="javascript:;" onclick="loadByHash(\'#'+redirectTypeUrl+'.detail.id.'+newsObj.target.id+'\')"';
		var personName = "<a "+urlTarget+" style='color:#3C5665;'>"+newsObj.target.name+"</a> "+urlAction.titleAction;
	}
	else {
		if(typeof newsObj.author.id != "undefined")
			authorId=newsObj.author.id;
		else
			authorId=newsObj.author._id.$id;
			urlTarget = 'href="#" onclick="loadByHash(\'#person.detail.id.'+authorId+'\')"';
		var personName = "<a "+urlTarget+" style='color:#3C5665;'>"+newsObj.author.name+"</a> "+urlAction.titleAction;
	}
	// END HOST NAME AND REDIRECT URL
	// Created By Or invited by
	if(typeof(newsObj.verb) != "undefined" && typeof(newsObj.target) != "undefined" && newsObj.target.id != newsObj.author.id){
		urlAuthor = 'href="#" onclick="openMainPanelFromPanel(\'/person/detail/id/'+newsObj.author.id+'\', \'person : '+newsObj.author.name+'\',\'fa-user\', \''+newsObj.author.id+'\')"';
		authorLine=newsObj.verb+" by <a "+urlAuthor+">"+newsObj.author.name+"</a> "+urlAction.titleAction;
	}
	else 
		authorLine="";
	//END OF CREATED BY OR INVITED BY
	var commentCount = 0;
	idVote=newsObj._id['$id'];
	if ("undefined" != typeof newsObj.commentCount) 
		commentCount = newsObj.commentCount;
	vote=voteCheckAction(idVote,newsObj);

	newsTLLine += '<div class="newsFeed '+''+tagsClass+' '+scopeClass+' '+newsObj.type+' ">'+
					'<div class="timeline_element partition-'+color+'">'+
						tags+
						manageMenu+
						scopes+
						'<div class="space1"></div>'+ 
						imageBackground+
						'<div class="timeline_author_block">'+
							objectLink+
							'<span class="light-text timeline_author padding-5 margin-top-5 text-bold">'+personName+'</span>'+
							'<div class="timeline_date"><i class="fa fa-clock-o"></i> '+dateStr+'</div>' +					
						'</div>'+
						'<div class="space5"></div>'+
						'<hr/>' + 
						'<a '+urlAction.url+'>'+
							'<div class="space5"></div>'+
							title + text + media +
						'</a>'+
						'<div class="space5"></div>';
						 if(idSession){ 
	newsTLLine +=		'<hr>'+
						"<div class='bar_tools_post'>"+
							"<a href='javascript:;' class='newsAddComment' data-count='"+commentCount+"' onclick='showComments(\""+idVote+"\")' data-id='"+idVote+"' data-type='"+newsObj.type+"'><span class='label text-dark'>"+commentCount+" <i class='fa fa-comment'></i></span></a> "+
							vote+
						"</div>";
						}
	newsTLLine +=	'</div>'+
				'</div>';
	return newsTLLine;
}
function buildHtmlUrlAndActionObject(obj){
	console.log(obj);
	if(typeof(obj.type) != "undefined")
		redirectTypeUrl=obj.type.substring(0,obj.type.length-1);
	else 
		redirectTypeUrl="news";
	if(obj.type == "citoyens" && typeof(obj.verb) == "undefined" || obj.type !="activityStream"){
		url = 'href="#" onclick="openMainPanelFromPanel(\'/news/latest/id/'+obj.id+'\', \''+redirectTypeUrl+' : '+obj.name+'\',\''+obj.icon+'\', \''+obj.id+'\')"';
		
		if(typeof(obj.postOn) != "undefined" && obj.type != contextParentType){
			if(obj.type == "organizations"){
				color="green";
			}else
				color="purple";
			titleAction = ' <i class="fa fa-caret-right"></i> <a href="javascript:;" onclick="loadByHash(\'#'+redirectTypeUrl+'.detail.id.'+obj.id+'\')"><span class="text-'+color+'">'+obj.postOn.name+"</span></a>";
		} else {
			if(obj.text.length == 0 && obj.media.length)
				titleAction = "a partagé un lien";
			else 
				titleAction = "";
		}
	}
	else{
		if(obj.object.objectType=="needs"){
			redirectTypeUrl=obj.type;
			id=obj.object.id;
			urlParent="/type/"+contextParentType+"/id/"+contextParentId;
		}
		else if(obj.object.objectType =="citoyens"){
			redirectTypeUrl="person";
			id=obj.object.id;
			urlParent="";
		} 
		else if(obj.object.objectType =="organizations"){
			redirectTypeUrl="organization";
			id=obj.object.id;
			urlParent="";
			titleAction = "a créé une organization";
		} 
		else if(obj.object.objectType =="events"){
			redirectTypeUrl="event";
			id=obj.object.id;
			urlParent="";
			titleAction = "a posté un évènement";
		} 
		else if(obj.object.objectType == "gantts" || obj.object.objectType =="projects"){
			redirectTypeUrl="project";
			id=obj.object.id;
			urlParent="";
			titleAction = "a créé un projet";
		}
		url = 'href="javascript:;" onclick="loadByHash(\'#'+redirectTypeUrl+'.detail.id.'+id+'\')"';
	}
	object=new Object;
	object.url= url,
	object.titleAction= titleAction;
	return object; 
}
function builHtmlAuthorImageObject(obj){
	if(typeof(obj.icon) != "undefined"){
		icon = "fa-" + Sig.getIcoByType({type : obj.type});
		var colorIcon = Sig.getIcoColorByType({type : obj.object.objectType});
		if (icon == "fa-circle")
			icon = obj.icon;
	}else{ 
		icon = "fa-rss";
		colorIcon="blue";
	}
	var flag = '<div class="ico-type-account"><i class="fa '+icon+' fa-'+colorIcon+'"></i></div>';	
	// IMAGE AND FLAG POST BY - TARGET IF PROJECT AND EVENT - AUTHOR IF ORGA
	if(typeof(obj.target) != "undefined" && obj.target.objectType != "citoyens" && obj.type!="gantts"){
		if(obj.target.objectType=="projects")
			var iconBlank="fa-lightbulb-o";
		else if (obj.target.objectType=="organizations")
			var iconBlank="fa-group";
		if(typeof obj.target.profilThumbImageUrl !== "undefined" && obj.target.profilThumbImageUrl != ""){ 
			imgProfilPath = obj.target.profilThumbImageUrl;
		var iconStr = "<div class='thumbnail-profil'><img height=50 width=50 src='" +baseUrl+ imgProfilPath + "'></div>" + flag ; 
		}else {
			var iconStr = "<div class='thumbnail-profil text-center text-white' style='overflow:hidden;text-shadow: 2px 2px grey;'><i class='fa "+iconBlank+"' style='font-size:50px;'></i></div>"+flag;
		}
	}else{
			var imgProfilPath =  "/images/news/profile_default_l.png";
			if((contextParentType == "projects" || contextParentType == "organizations") && typeof(obj.verb) != "undefined" && obj.type!="gantts"){
				if(typeof obj.target.profilThumbImageUrl != "undefined" && obj.target.profilThumbImageUrl != ""){ 
					imgProfilPath = obj.target.profilThumbImageUrl;
					var iconStr = "<div class='thumbnail-profil'><img height=50 width=50 src='" + baseUrl+imgProfilPath + "'></div>" + flag ; 
				}else {
					if(obj.object.objectType=="organizations")
						var iconStr = "<div class='thumbnail-profil text-center' style='overflow:hidden;'><i class='fa fa-group' style='font-size:50px;'></i></div>"+flag;
					else
						var iconStr = "<div class='thumbnail-profil'><img height=50 width=50 src='" +baseUrl+ imgProfilPath + "'></div>" + flag ; 

				}
			}
			else{	
				if(typeof obj.author.profilThumbImageUrl !== "undefined" && obj.author.profilThumbImageUrl != ""){
					imgProfilPath =obj.author.profilThumbImageUrl;
				}
				var iconStr = "<div class='thumbnail-profil'><img height=50 width=50 src='"+ baseUrl+ imgProfilPath + "'></div>" + flag ;	 
			}
	}
	return iconStr;
}
function actionOnNews(news, action,method) {
	type="news";
	params=new Object,
	params.id=news.data("id"),
	params.collection=type,
	params.action=action;
	if(method){
		params.unset=method;
	}
	$.ajax({
		url: baseUrl+'/'+moduleId+"/action/addaction/",
		data: params,
		type: 'post',
		global: false,
		dataType: 'json',
		success: 
			function(data) {
    			if(!data.result){
                    toastr.error(data.msg);
                    console.log(data);
               	}
                else { 
                    if (data.userAllreadyDidAction) {
                    	toastr.info("You already vote on this comment.");
                    } else {
						count = parseInt(news.data("count"));
	                    if(count < count+data.inc)
	                    	toastr.success("Your vote has been succesfully added");
	                    else
		                    toastr.success("Your vote has been succesfully removed");
	                    console.log(data);
						news.data( "count" , count+data.inc );
						icon = news.children(".label").children(".fa").attr("class");
						news.children(".label").html(news.data("count")+" <i class='"+icon+"'></i>");
					}
                }
            },
        error: 
        	function(data) {
        		toastr.error("Error calling the serveur : contact your administrator.");
        	}
	});
}

function voteCheckAction(idVote, newsObj) {
	var voteUpCount = 0;
	textUp="text-dark";
	textDown="text-dark";
	if ("undefined" != typeof newsObj.voteUpCount){ 
		voteUpCount = newsObj.voteUpCount;
		if (newsObj.voteUp.indexOf(idSession) != -1){
			textUp= "text-green";
			$(".newsVoteDown[data-id="+idVote+"]").off();
		}
	}
	var voteDownCount = 0;
	if ("undefined" != typeof newsObj.voteDownCount) {
		voteDownCount = newsObj.voteDownCount;
		if (newsObj.voteDown.indexOf(idSession) != -1){
			textDown= "text-orange";
			$(".newsVoteUp[data-id="+idVote+"]").off();
		}
	}
	voteHtml = "<a href='javascript:;' class='newsVoteUp' onclick='newsVoteUp(this, \""+idVote+"\")' data-count='"+voteUpCount+"' data-id='"+idVote+"' data-type='"+newsObj.type+"'><span class='label "+textUp+"'>"+voteUpCount+" <i class='fa fa-thumbs-up'></i></span></a> "+
			"<a href='javascript:;' class='newsVoteDown' onclick='newsVoteDown(this, \""+idVote+"\")' data-count='"+voteDownCount+"' data-id='"+idVote+"' data-type='"+newsObj.type+"'><span class='label "+textDown+"'>"+voteDownCount+" <i class='fa fa-thumbs-down'></i></span></a>";
	return voteHtml;
}

function manageModeContext(id) {
	listXeditables = ['#newsContent'+id, '#newsTitle'+id];
	if (mode == "view") {
		//$('.editable-project').editable('toggleDisabled');
		$.each(listXeditables, function(i,value) {
			$(value).editable('toggleDisabled');
		});
		//$("#btn-update-geopos").removeClass("hidden");
	} else if (mode == "update") {
		// Add a pk to make the update process available on X-Editable
		$('.editable-news').editable('option', 'pk', id);
		$.each(listXeditables, function(i,value) {
			$(value).editable('option', 'pk', id);
			$(value).editable('toggleDisabled');
		});
	}
}

function initXEditable() {
	$.fn.editable.defaults.mode = 'inline';
	$('.editable-news').editable({
    	url: baseUrl+"/"+moduleId+"/news/updatefield", //this url will not be used for creating new job, it is only for update
    	textarea: {
			html: true,
			video: true,
			image: true
		},
    	showbuttons: 'bottom',
    	success : function(data) {
	        if(data.result) {
	        	toastr.success(data.msg);
				console.log(data);
	        }
	        else{
	        	toastr.error(data.msg);  
	        }
	    }
	});
    //make jobTitle required
	$('.newsTitle').editable('option', 'validate', function(v) {
    	if(!v) return 'Required field!';
	});

	$('.newsContent').editable({
		url: baseUrl+"/"+moduleId+"/news/updatefield", 
		showbuttons: 'bottom',
		wysihtml5: {
			html: true,
			video: true,
			image: true
		},
		success : function(data) {
	        if(data.result) 
	        	toastr.success(data.msg);
	        else
	        	toastr.error(data.msg);  
	    },
	});
}

function showComments(id){
	$.blockUI({
			message : '<div><a href="javascript:$.unblockUI();"><span class="pull-right text-dark"><i class="fa fa-share-alt"></span></a>'+
							'<div class="commentContent"></div></div>', 
			onOverlayClick: $.unblockUI,
			css: {"text-align": "left", "cursor":"default"}
		});
		getAjax('.commentContent',baseUrl+'/'+moduleId+"/comment/index/type/news/id/"+id,function(){ 
		},"html");
}
function newsVoteUp($this, id){
	if($(".newsVoteDown[data-id='"+id+"']").children(".label").hasClass("text-orange"))
			toastr.info("Remove your negative vote before");
		else{	
		//toastr.info('This vote has been well registred');
			if($($this).children(".label").hasClass("text-green")){
				method = true;
		}
		else{
			method = false;
		}
		actionOnNews($($this),'voteUp',method);
		disableOtherAction($($this), '.commentVoteUp', method);
		count = parseInt($($this).data("count"));
		$($this).children(".label").html($($this).data("count")+" <i class='fa fa-thumbs-up'></i>");
		}
}
function newsVoteDown($this, id){
	if($(".newsVoteUp[data-id='"+$($this).data("id")+"']").children(".label").hasClass("text-green"))
			toastr.info("Remove your positive vote before");
	else{	
	//toastr.info('This vote has been well registred');
		if($($this).children(".label").hasClass("text-orange")){
			method = true;
		}
		else{
			method = false;
	}
	actionOnNews($($this),'voteDown',method);
	disableOtherAction($($this), '.commentVoteDown', method);
	$($this).children(".label").html($($this).data("count")+" <i class='fa fa-thumbs-down'></i>");
	}
}
function disableOtherAction($this,action,method){
	if(method){
		if (action != ".commentVoteUp")
			$this.children(".label").removeClass("text-orange").addClass("text-dark");
		if (action != ".commentVoteDown")
			$this.children(".label").removeClass("text-green").addClass("text-dark");
	}
	else{
		if (action != ".commentVoteUp")
			$this.children(".label").removeClass("text-dark").addClass("text-orange");
		if (action != ".commentVoteDown")
			$this.children(".label").removeClass("text-dark").addClass("text-green");
	}
}