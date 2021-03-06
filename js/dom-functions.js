
/*· · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · ·
  ·                                                                               ·
  ·                                                                               ·
  ·                             Q V I T T E R                                     ·
  ·                                                                               ·
  ·                                                                               ·
  ·                                 <o)                                           ·
  ·                                  /_////                                       ·
  ·                                 (____/                                        ·
  ·                                          (o<                                  ·
  ·                                   o> \\\\_\                                   ·
  ·                                 \\)   \____)                                  ·
  ·                                                                               ·
  ·                                                                               ·
  ·     @licstart  The following is the entire license notice for the             ·
  ·     JavaScript code in this page.                                             ·
  ·                                                                               ·
  ·     Copyright (C) 2015  Hannes Mannerheim and other contributors              ·
  ·                                                                               ·
  ·                                                                               ·
  ·     This program is free software: you can redistribute it and/or modify      ·
  ·     it under the terms of the GNU Affero General Public License as            ·
  ·     published by the Free Software Foundation, either version 3 of the        ·
  ·     License, or (at your option) any later version.                           ·
  ·                                                                               ·
  ·     This program is distributed in the hope that it will be useful,           ·
  ·     but WITHOUT ANY WARRANTY; without even the implied warranty of            ·
  ·     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the             ·
  ·     GNU Affero General Public License for more details.                       ·
  ·                                                                               ·
  ·     You should have received a copy of the GNU Affero General Public License  ·
  ·     along with this program.  If not, see <http://www.gnu.org/licenses/>.     ·
  ·                                                                               ·
  ·     @licend  The above is the entire license notice                           ·
  ·     for the JavaScript code in this page.                                     ·
  ·                                                                               ·
  · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · */

/* ·
   ·
   ·   Build a menu
   ·
   ·   Menus currently support four row types: divider, functions, links and profile-prefs-toggles
   ·   Function rows run the function in  the function attribute when clicked.
   ·   Profile-prefs-toggle rows toggles the preference in the attribute when clicked.
   ·
   ·   @param streamObject: stream object returned by pathToStreamRouter()
   ·
   · · · · · · · · · */

function getMenu(menuArray) {

	if(typeof getMenu == 'undefined' || getMenu === false) {
		return false;
		}

	var menuHTML = buildMenuTop();
	$.each(menuArray,function(){
		if(this.type == 'divider') {
			menuHTML = menuHTML + buildMenuDivider();
			}
		else if(this.type == 'function') {
			menuHTML = menuHTML + buildMenuRowFullwidth(this.label, {
				class: 'row-type-' + this.type,
				'data-menu-row-type': this.type,
				'data-function-name': this.functionName,
				'data-function-arguments': JSON.stringify(this.functionArguments)
				});
			}
		else if(this.type == 'link') {
			menuHTML = menuHTML + buildMenuRowFullwidth(this.label, {
				class: 'row-type-' + this.type,
				'href': this.href
				});
			}
		else if(this.type == 'profile-prefs-toggle') {

			// only prefs in the qvitter namespace is supported
			if(this.namespace == 'qvitter') {

				// enabled?
				var prefEnabledOrDisabled = 'disabled';
				if(typeof window.qvitterProfilePrefs[this.topic] != 'undefined'
					&& window.qvitterProfilePrefs[this.topic] !== null
				&& window.qvitterProfilePrefs[this.topic] != ''
				&& window.qvitterProfilePrefs[this.topic] !== false
				&& window.qvitterProfilePrefs[this.topic] != 0
				&& window.qvitterProfilePrefs[this.topic] != '0') {
					prefEnabledOrDisabled = 'enabled';
					}

				// get row html
				menuHTML = menuHTML + buildMenuRowFullwidth(this.label, {
					id: this.topic,
					class: 'row-type-' + this.type + ' ' + prefEnabledOrDisabled,
					'data-menu-row-type': this.type,
					'data-profile-prefs-topic': this.topic,
					'data-profile-prefs-namespace': this.namespace,
					'data-profile-pref-state': prefEnabledOrDisabled
					});
				}
			}
		});

	return menuHTML + buildMenuBottom();
	}

/* ·
   ·
   ·   Menu from streamObject
   ·
   · · · · · · · · · */

function streamObjectGetMenu(streamObject) {
	if(typeof streamObject == 'undefined') {
		return false;
		}
	if(streamObject.menu === false) {
		return false;
		}
	return getMenu(streamObject.menu);
	}

/* ·
   ·
   ·   Menu components
   ·
   · · · · · · · · · */

function buildMenuTop() {
	return '<ul class="dropdown-menu">\
				<li class="dropdown-caret right">\
					<span class="caret-outer"></span>\
					<span class="caret-inner"></span>\
				</li>';
	}
function buildMenuBottom() {
	return '</ul>';
	}
function buildMenuDivider() {
	return '<li class="fullwidth dropdown-divider"></li>';
	}
function buildMenuRowFullwidth(label, attributes) {
	var attributesHTML = '';
	$.each(attributes,function(k,v){
		attributesHTML = attributesHTML + ' ' + k + '=\'' + v + '\'';
		});
	return '<li class="fullwidth"><a' + attributesHTML + '>' + replaceHtmlSpecialChars(label) + '</a></li>';
	}
function alignMenuToParent(menu, parent, offsetLeft) {
	if(typeof offsetLeft == 'undefined') {
		var offsetLeft = 0;
		}
	var menuLeft = parent.innerWidth()/2 - menu.width() + 15 + offsetLeft;
	var menuTop = parent.height()+5;
	menu.css('left', menuLeft + 'px');
	menu.css('top', menuTop + 'px');
	menu.css('display','block'); // show menu
	}


/* ·
   ·
   ·   Show error message
   ·
   ·   @param message: error message
   ·
   · · · · · · · · · */

function showErrorMessage(message, after) {
	if(typeof after == 'undefined') {
		var after = $('#user-container');
		}
	after.after('<div class="error-message">' + message + '<span class="discard-error-message"></span></div>');
	}



/* ·
   ·
   ·   Show favs and requeets in queet element
   ·
   ·   @param q: queet jQuery object
   ·   @param data: object with users that has faved and requeeted
   ·
   · · · · · · · · · */

function showFavsAndRequeetsInQueet(q,data) {

	// set the non-expanded fav- and rq-count
	q.children('.queet').find('.action-fav-num').html(data.favs.length);
	q.children('.queet').find('.action-fav-num').attr('data-fav-num',data.favs.length);
	q.children('.queet').find('.action-rq-num').html(data.repeats.length);
	q.children('.queet').find('.action-rq-num').attr('data-rq-num',data.repeats.length);

	// don't proceed if queet is not expanded
	if(!q.hasClass('expanded') || q.hasClass('collapsing')) {
		return;
		}

	// don't proceed and remove expanded stats if all favs and repeats are removed
	if(data.favs.length < 1 && data.repeats.length < 1) {
		q.children('.queet').find('.stats').remove();
		return;
		}

	// remove any existing stats container and add a new empty one
	if(q.children('.queet').find('ul.stats').length > 0) {
		q.children('.queet').find('ul.stats').remove();
		}

	q.children('.queet').find('.queet-stats-container').prepend('<ul class="stats"><li class="avatar-row"></li></ul>');

	// set the expanded fav-count number
	if(data.favs.length > 0) {

		if(data.favs.length == 1) {
			var favLabel = window.sL.favoriteNoun;
			}
		else if(data.favs.length > 1) {
			var favLabel = window.sL.favoritesNoun;
			}

		if(q.children('.queet').find('.fav-count').length>0) {
			q.children('.queet').find('.fav-count').children('strong').html(data.favs.length);
			}
		else {
			q.children('.queet').find('li.avatar-row').before('<li class="fav-count"><a>' + favLabel + ' </a><strong>' + data.favs.length + '</strong></li>');
			}
		}

	// add repeats
	if(data.repeats.length > 0) {

		if(data.repeats.length == 1) {
			var repeatsLabel = window.sL.requeetNoun;
			}
		else if(data.repeats.length > 1) {
			var repeatsLabel = window.sL.requeetsNoun;
			}

		if(q.children('.queet').find('.rq-count').length>0) {
			q.children('.queet').find('.rq-count').children('strong').html(data.repeats.length);
			}
		else {
			q.children('.queet').find('li.avatar-row').before('<li class="rq-count"><a>' + repeatsLabel + ' </a><strong>' + data.repeats.length + '</strong></li>');
			}

		}


	// merge favs and repeats objects by user_id (removes duplicate users)
	var favsAndRepeats = {};
	$.each(data.repeats,function(){
		favsAndRepeats[this.user_id] = this;
		});
	$.each(data.favs,function(){
		favsAndRepeats[this.user_id] = this;
		});

	// make an object with time the key
	var favsAndRepeatsByTime = {};
	$.each(favsAndRepeats,function(){
		favsAndRepeatsByTime[this.time] = this;
		});

	// create an array with times and sort it
	var timeSorted = [];
	$.each(favsAndRepeats,function(){
		timeSorted.push(this.time);
		});
	timeSorted.sort();

	// display avatars in chronological order, max 7
	var avatarnum = 1;
	$.each(timeSorted,function(){
		q.children('.queet').find('.avatar-row').append('<a title="' + favsAndRepeatsByTime[this].fullname + '" data-user-id="' + favsAndRepeatsByTime[this].user_id + '" href="' + favsAndRepeatsByTime[this].profileurl + '"><img alt="' + favsAndRepeatsByTime[this].fullname + '" src="' + favsAndRepeatsByTime[this].avatarurl + '" class="avatar size24" id="av-' + favsAndRepeatsByTime[this].user_id + '"></a>');
		if(avatarnum > 15) {
			return false;
			}
		avatarnum++;
		});

	}


/* ·
   ·
   ·   Build profile card HTML
   ·
   ·   @param data: an object with a user array
   ·
   · · · · · · · · · */

function buildProfileCard(data) {

	data = cleanUpUserObject(data);

	// use avatar if no cover photo
	var coverPhotoHtml = '';
	if(data.cover_photo !== false) {
		coverPhotoHtml = 'background-image:url(\'' + data.cover_photo + '\')';
		}

	// follows me?
	var follows_you = '';
	if(data.follows_you === true  && window.loggedIn.id != data.id) {
		var follows_you = '<span class="follows-you">' + window.sL.followsYou + '</span>';
		}

	// show user actions if logged in
	var followingClass = '';
	if(data.following) {
		followingClass = 'following';
		}

	var followButton = '';

	// only add follow button if this is a local user
	if(data.is_local == true) {
		if(typeof window.loggedIn.screen_name != 'undefined' && window.loggedIn.id != data.id) {
			var followButton = '<div class="user-actions"><button data-follow-user-id="' + data.id + '" data-follow-user="' + data.statusnet_profile_url + '" type="button" class="qvitter-follow-button ' + followingClass + '"><span class="button-text follow-text"><i class="follow"></i>' + window.sL.userFollow + '</span><span class="button-text following-text">' + window.sL.userFollowing + '</span><span class="button-text unfollow-text">' + window.sL.userUnfollow + '</span></button></div>';
			}

		// follow from external instance if logged out
		if(typeof window.loggedIn.screen_name == 'undefined') {
			var followButton = '<div class="user-actions"><button type="button" class="external-follow-button ' + followingClass + '"><span class="button-text follow-text"><i class="follow"></i>' + window.sL.userExternalFollow + '</span></button></div>';
			}

		// edit profile button if me
		if(typeof window.loggedIn.screen_name != 'undefined' && window.loggedIn.id == data.id) {
			var followButton = '<div class="user-actions"><button type="button" class="edit-profile-button"><span class="button-text edit-profile-text">' + window.sL.editMyProfile + '</span></button></div>';
			}
		}

	// is webpage empty?
	var emptyWebpage = '';
	if(data.url.length<1) {
		emptyWebpage = ' empty';
		}

	// full card html
	data.profileCardHtml = '\
		<div class="profile-card">\
			<div class="profile-header-inner" style="' + coverPhotoHtml + '" data-user-id="' + data.id + '">\
				<div class="profile-header-inner-overlay"></div>\
				<a class="profile-picture" href="' + data.profile_image_url_original + '">\
					<img class="avatar profile-size" src="' + data.profile_image_url_profile_size + '" data-user-id="' + data.id + '" />\
				</a>\
				<div class="profile-card-inner">\
					<h1 class="fullname" data-user-id="' + data.id + '">' + data.name + '<span></span></h1>\
					<h2 class="username">\
						<span class="screen-name" data-user-id="' + data.id + '">@' + data.screen_name + '</span>\
						' + follows_you + '\
					</h2>\
					<div class="bio-container"><p>' + data.description + '</p></div>\
					<p class="location-and-url">\
						<span class="location">' + data.location + '</span>\
						<span class="url' + emptyWebpage + '">\
							<span class="divider"> · </span>\
							<a href="' + data.url + '">' + data.url.replace('http://','').replace('https://','') + '</a>\
						</span>\
					</p>\
				</div>\
			</div>\
			<div class="profile-banner-footer">\
				<ul class="stats">\
					<li class="tweet-num"><a href="' + data.statusnet_profile_url + '" class="tweet-stats">' + window.sL.notices + '<strong>' + data.statuses_count + '</strong></a></li>\
					<li class="following-num"><a href="' + data.statusnet_profile_url + '/subscriptions" class="following-stats">' + window.sL.following + '<strong>' + data.friends_count + '</strong></a></li>\
					<li class="follower-num"><a href="' + data.statusnet_profile_url + '/subscribers" class="follower-stats">' + window.sL.followers + '<strong>' + data.followers_count + '</strong></a></li>\
					<li class="groups-num"><a href="' + data.statusnet_profile_url + '/groups" class="groups-stats">' + window.sL.groups + '<strong>' + data.groups_count + '</strong></a></li>\
				</ul>\
				' + followButton + '\
				<div class="clearfix"></div>\
			</div>\
		</div>\
		';

	return data;
	}


/* ·
   ·
   ·   Build external profile card HTML
   ·
   ·   @param data: an object containing data.external user array,
   ·   				and maybe (hopefully) also a data.local user array
   ·
   · · · · · · · · · */

function buildExternalProfileCard(data) {

	// local profile id and follow class
	var followLocalIdHtml = '';
	var followingClass = '';
	if(typeof data.local != 'undefined' && data.local !== null) {
		followLocalIdHtml = ' data-follow-user-id="' + data.local.id + '"';

		if(data.local.following) {
			followingClass = 'following';
			}
		}

	// follows me?
	var follows_you = '';
	if(data.local !== null && data.local.follows_you === true  && window.loggedIn.id != data.local.id) {
		var follows_you = '<span class="follows-you">' + window.sL.followsYou + '</span>';
		}

	// empty strings and zeros instead of null
	data = cleanUpUserObject(data.external);

	// old statusnet-versions might not have full avatar urls in their api response
	if(typeof data.profile_image_url_original == 'undefined'
		   || data.profile_image_url_original === null
		   || data.profile_image_url_original.length == 0) {
		data.profile_image_url_original = data.profile_image_url;
		}
	if(typeof data.profile_image_url_profile_size == 'undefined'
		   || data.profile_image_url_profile_size === null
		   || data.profile_image_url_profile_size.length == 0) {
		data.profile_image_url_profile_size = data.profile_image_url;
		}

	// we might have a cover photo
	if(typeof data.cover_photo != 'undefined' && data.cover_photo !== false) {
		var cover_photo = data.cover_photo;
		}
	else {
		var cover_photo = data.profile_image_url_original;
		}

	// is webpage empty?
	var emptyWebpage = '';
	if(data.url.length<1) {
		emptyWebpage = ' empty';
		}

	var serverUrl = guessInstanceUrlWithoutProtocolFromProfileUrlAndNickname(data.statusnet_profile_url, data.screen_name);
	data.screenNameWithServer = '@' + data.screen_name + '@' + serverUrl;

	var followButton = '';

	// we can only follow remote users if we're logged in at the moment
	if(window.loggedIn !== false) {
		var followButton = '<div class="user-actions"><button' + followLocalIdHtml + ' data-follow-user="' + data.statusnet_profile_url + '" type="button" class="qvitter-follow-button ' + followingClass + '"><span class="button-text follow-text"><i class="follow"></i>' + window.sL.userFollow + '</span><span class="button-text following-text">' + window.sL.userFollowing + '</span><span class="button-text unfollow-text">' + window.sL.userUnfollow + '</span></button></div>';
		}

	data.profileCardHtml = '\
		<div class="profile-card">\
			<div class="profile-header-inner" style="background-image:url(\'' + cover_photo + '\')">\
				<div class="profile-header-inner-overlay"></div>\
				<a class="profile-picture"><img src="' + data.profile_image_url_profile_size + '" /></a>\
				<div class="profile-card-inner">\
					<a target="_blank" href="' + data.statusnet_profile_url + '">\
						<h1 class="fullname">' + data.name + '<span></span></h1>\
						<h2 class="username">\
							<span class="screen-name">' + data.screenNameWithServer + '</span>\
							<span class="ostatus-link" data-tooltip="' + window.sL.goToTheUsersRemoteProfile + '">' + window.sL.goToTheUsersRemoteProfile + '</span>\
							' + follows_you + '\
						</h2>\
					</a>\
					<div class="bio-container"><p>' + data.description + '</p></div>\
					<p class="location-and-url">\
						<span class="location">' + data.location + '</span>\
						<span class="url' + emptyWebpage + '">\
							<span class="divider"> · </span>\
							<a target="_blank" href="' + data.url + '">' + data.url.replace('http://','').replace('https://','') + '</a>\
						</span>\
					</p>\
				</div>\
			</div>\
			<div class="profile-banner-footer">\
				<ul class="stats">\
					<li class="tweet-num"><a class="tweet-stats" target="_blank" href="' + data.statusnet_profile_url + '">' + window.sL.notices + '<strong>' + data.statuses_count + '</strong></a></li>\
					<li class="following-num"><a class="following-stats" target="_blank" href="' + data.statusnet_profile_url + '/subscriptions">' + window.sL.following + '<strong>' + data.friends_count + '</strong></a></li>\
					<li class="follower-num"><a class="follower-stats" target="_blank" href="' + data.statusnet_profile_url + '/subscribers">' + window.sL.followers + '<strong>' + data.followers_count + '</strong></a></li>\
				</ul>\
				' + followButton + '\
				<div class="clearfix"></div>\
			</div>\
		</div>\
		<div class="clearfix"></div>';

	return data;
	}




/* ·
   ·
   ·   Adds a profile card before feed element
   ·
   ·   @param data: an object with a user array
   ·
   · · · · · · · · · */

function addProfileCardToDOM(data) {


	// change design
	changeDesign({backgroundimage:data.background_image, backgroundcolor:data.backgroundcolor, linkcolor:data.linkcolor});

	// remove any old profile card and show profile card
	$('#feed').siblings('.profile-card').remove();
	$('#feed').before(data.profileCardHtml);
	}




/* ·
   ·
   ·   Adds a group profile card before feed element
   ·
   ·   @param data: an object with one or more queet objects
   ·
   · · · · · · · · · */

function groupProfileCard(groupAlias) {
	getFromAPI('statusnet/groups/show/' + groupAlias + '.json', function(data){ if(data){

		data.nickname = data.nickname || '';
		data.fullname = data.fullname || '';
		data.stream_logo = data.stream_logo || window.defaultAvatarStreamSize;
		data.homepage_logo = data.homepage_logo || window.defaultAvatarProfileSize;
		data.original_logo = data.original_logo || window.defaultAvatarProfileSize;
		data.description = data.description || '';
		data.homepage = data.homepage || '';
		data.url = data.url || '';
		data.member_count = data.member_count || 0;
		data.admin_count = data.admin_count || 0;

		// show user actions if logged in
		var memberClass = '';
		if(data.member) {
			memberClass = 'member';
			}
		var memberButton = '';
		if(typeof window.loggedIn.screen_name != 'undefined') {
			var memberButton = '<div class="user-actions"><button data-group-id="' + data.id + '" type="button" class="member-button ' + memberClass + '"><span class="button-text join-text"><i class="join"></i>' + window.sL.joinGroup + '</span><span class="button-text ismember-text">' + window.sL.isMemberOfGroup + '</span><span class="button-text leave-text">' + window.sL.leaveGroup + '</span></button></div>';
			}

		// follow from external instance if logged out
		if(typeof window.loggedIn.screen_name == 'undefined') {
			var memberButton = '<div class="user-actions"><button type="button" class="external-member-button"><span class="button-text join-text"><i class="join"></i>' + window.sL.joinExternalGroup + '</span></button></div>';
			}

		// change design
		changeDesign({backgroundimage:false, backgroundcolor:false, linkcolor:false});


		// add card to DOM
		$('#feed').siblings('.profile-card').remove();  // remove any old profile card
		$('#feed').before('	<div class="profile-card group">\
								<div class="profile-header-inner" style="background-image:url(' + data.original_logo + ')">\
									<div class="profile-header-inner-overlay"></div>\
									<a class="profile-picture" href="' + data.original_logo + '">\
										<img src="' + data.homepage_logo + '" />\
									</a>\
									<div class="profile-card-inner">\
										<a href="' + window.siteInstanceURL + 'group/' + data.nickname + '">\
											<h1 class="fullname">\
												' + data.fullname + '\
												<span></span>\
											</h1>\
											<h2 class="username">\
												<span class="screen-name">!' + data.nickname + '</span>\
											</h2>\
										</a>\
										<div class="bio-container">\
											<p>' + data.description + '</p>\
										</div>\
										<p class="location-and-url">\
											<span class="url">\
												<a href="' + data.homepage + '">' + data.homepage.replace('http://','').replace('https://','') + '</a>\
											</span>\
										</p>\
									</div>\
								</div>\
								<div class="profile-banner-footer">\
									<ul class="stats">\
										<li>\
											<a href="' + window.siteInstanceURL + 'group/' + data.nickname + '/members" class="member-stats">\
												' + window.sL.memberCount + '\
												<strong>' + data.member_count + '</strong>\
											</a>\
										</li>\
										<li>\
											<a href="' + window.siteInstanceURL + 'group/' + data.nickname + '/admins" class="admin-stats">\
												' + window.sL.adminCount + '\
												<strong>' + data.admin_count + '</strong>\
											</a>\
										</li>\
									</ul>\
									' + memberButton + '\
									<div class="clearfix"></div>\
								</div>\
							</div>');
		}});
	}



/* ·
   ·
   ·   Change stream
   ·
   ·   @param streamObject: object returned by pathToStreamRouter()
   ·   @param setLocation: whether we should update the browsers location bar when we set the new stream
   ·   @param fallbackId: if we fail to get the stream, it can be due to a bad/changed user/group nickname,
   ·                      in that case this parameter can contain a user/group id that we can use to retrieve the correct nickname
   ·   @param actionOnSuccess: callback function on success
   ·
   · · · · · · · · · */

function setNewCurrentStream(streamObject,setLocation,fallbackId,actionOnSuccess) {

	if(!streamObject || !streamObject.stream) {
		console.log('invalid streamObject, no stream to set!');
		return;
		}

	// update the cache for the old stream
	rememberStreamStateInLocalStorage();

	// remove any old error messages
	$('.error-message').remove();

	// halt interval that checks for new queets
	window.clearInterval(checkForNewQueetsInterval);

	// scroll to top
	$(window).scrollTop(0);
	$('body').addClass('androidFix').scrollTop(0).removeClass('androidFix');

    // blur any selected links
    $('a').blur();

    // unset metadata for the old stream saved in attributes
	$('#feed-body').removeAttr('data-search-page-number');
	$('#feed-body').removeAttr('data-end-reached');

	// hide new queets bar and reload stream button
	$('#new-queets-bar-container').addClass('hidden');
	$('.reload-stream').hide();

	display_spinner('#feed-header-inner');

	// are we just reloading?
	var weAreReloading = false;
	if(typeof window.currentStreamObject != 'undefined' && window.currentStreamObject.stream == streamObject.stream) {
		weAreReloading = true;
		}

	// remember the most recent stream object
	window.currentStreamObject = streamObject;

	// set the new streams header
	if(streamObject.streamSubHeader) {
		$('#feed-header-inner h2').html(streamObject.streamSubHeader);
		}
	else {
		$('#feed-header-inner h2').html(streamObject.streamHeader);
		}

	// add menu cog if this stream has a menu
	if(streamObject.menu && window.loggedIn) {
		$('#feed-header-inner h2').append('<div id="stream-menu-cog" data-tooltip="' + window.sL.timelineOptions + '"></div>');
		}

	// subtle animation to show somethings happening
	$('#feed-header-inner h2').css('opacity','0.2');
	$('#feed-header-inner h2').animate({opacity:'1'},1000);

	// if we're just reloading, we dont need to:
	// (1) check if we have a cached version of this stream
	// (2) remove the stream if we don't
	// (3) change design
	if(weAreReloading === false) {

		// (1) check if we have a cached version of the stream
		var haveOldStreamState = localStorageObjectCache_GET('streamState',window.currentStreamObject.path);

		// discard and remove any cached data that is not in this (new) format
		if(typeof haveOldStreamState.card == 'undefined'
		|| typeof haveOldStreamState.feed == 'undefined') {
			localStorageObjectCache_STORE('streamState',window.currentStreamObject.path, false);
			haveOldStreamState = false;
			}

		// show cached version immediately
		if(haveOldStreamState) {
			$('.profile-card,.hover-card,.hover-card-caret').remove();
			$('#feed').before(haveOldStreamState.card);

			var oldStreamState = $('<div/>').html(haveOldStreamState.feed);

			// if the cached items has data-quitter-id-in-stream attributes, sort them before adding them
			if(oldStreamState.children('.stream-item[data-quitter-id-in-stream]').length>0) {
				oldStreamState.sortDivsByAttrDesc('data-quitter-id-in-stream');
				}

			// hide any removed notices that we know of
			if(typeof window.knownDeletedNotices != 'undefined') {
				$.each(window.knownDeletedNotices,function(delededURI,v){
					oldStreamState.children('.stream-item[data-uri="' + delededURI + '"]').addClass('deleted always-hidden');
					});
				}

			// hide all notices from blocked users
			if(typeof window.allBlocking != 'undefined') {
				$.each(window.allBlocking,function(){
					oldStreamState.find('strong.name[data-user-id="' + this + '"]').closest('.stream-item').addClass('profile-blocked-by-me');
					});
				}

			// show full notice text for all cached notices, if we have it in cache
			$.each(oldStreamState.children('.stream-item'),function(){
				getFullUnshortenedHtmlForQueet($(this),true);
				});

			// if this is notidfications we have seen obviously seen them before
			oldStreamState.children('.stream-item').removeClass('not-seen');

			$('#feed-body').html(oldStreamState.html());

			// set location bar from stream
			if(setLocation) {
				setUrlFromStream(streamObject);
				setLocation = false; // don't set location twice if we've already set it here
				}

			// update all queets times
			updateAllQueetsTimes();

			// also mark this stream as the current stream immediately, if a saved copy exists
			addStreamToHistoryMenuAndMarkAsCurrent(streamObject);

			// maybe do something
			if(typeof actionOnSuccess == 'function') {
				actionOnSuccess();

				// don't invoke actionOnSuccess later if we already invoked it here
				actionOnSuccess = false;
				}
			}
		// (2) if we don't have a cached version we remove and hide the old stream and wait for the new one to load
		else {
			$('.profile-card,.hover-card,.hover-card-caret').remove();
			$('#feed').css('opacity',0);
			$('#feed-body').html('');
			remove_spinner(); display_spinner(); // display spinner in page header instead feed header
			}

		// (3) change design immediately to either cached design or logged in user's
		if(typeof window.oldStreamsDesigns[window.currentStreamObject.nickname] != 'undefined') {
			changeDesign(window.oldStreamsDesigns[window.currentStreamObject.nickname]);
			}
		else {
			changeDesign({backgroundimage:window.loggedIn.background_image, backgroundcolor:window.loggedIn.backgroundcolor, linkcolor:window.loggedIn.linkcolor});
			}
		}

	// get stream
	getFromAPI(streamObject.stream, function(queet_data, userArray, error, url){

		// while waiting for this data user might have changed stream, so only proceed if current stream still is this one
		if(window.currentStreamObject.stream != streamObject.stream) {
			console.log('stream has changed, aborting');
			return;
			}

		// if we have a fallbackId and a userArray, and the userArray's id is not equal to
		// the fallackId, this is the wrong stream! we need to re-invoke setNewCurrentStream()
		// with the correct and up-to-date nickname (maybe best not to send a fallbackId here not
		// to risk getting into an infinite loop caused by bad data)
		// also, we do the same thing if getting the stream fails, but we have a fallback id
		if((userArray && fallbackId && userArray.id != fallbackId)
		|| (queet_data === false && fallbackId)) {
			if(streamObject.name == 'profile') {
				getNicknameByUserIdFromAPI(fallbackId,function(nickname) {
					if(nickname) {
						setNewCurrentStream(pathToStreamRouter(nickname),true,false,actionOnSuccess);
						}
					else {
						// redirect to front page if everything fails
						setNewCurrentStream(pathToStreamRouter('/'),true,false,actionOnSuccess);
						}
					});
				}
			else if(streamObject.name == 'group notice stream') {
				getNicknameByGroupIdFromAPI(fallbackId,function(nickname) {
					if(nickname) {
						setNewCurrentStream(pathToStreamRouter('group/' + nickname),true,false,actionOnSuccess);
						}
					else {
						// redirect to front page if everything fails
						setNewCurrentStream(pathToStreamRouter('/'),true,false,actionOnSuccess);
						}
					});
				}
			}

		// getting stream failed, and we don't have a fallback id
		else if(queet_data === false) {

			// e.g. maybe fade in user-container here, ("success" was a badly chosen name...)
			if(typeof actionOnSuccess == 'function') {
				actionOnSuccess();
				}

			if(error.status == 401) {
				showErrorMessage(window.sL.ERRORmustBeLoggedIn);
				}
			else if(error.status == 404) {
				if(streamObject.name == 'profile'
				|| streamObject.name == 'friends timeline'
				|| streamObject.name == 'mentions'
				|| streamObject.name == 'favorites'
				|| streamObject.name == 'subscribers'
				|| streamObject.name == 'subscriptions'
				|| streamObject.name == 'user group list') {
					showErrorMessage(window.sL.ERRORcouldNotFindUserWithNickname.replace('{nickname}',replaceHtmlSpecialChars(streamObject.nickname)));
					}
				else if(streamObject.name == 'group notice stream'
					 || streamObject.name == 'group member list'
				 	 || streamObject.name == 'group admin list') {
					showErrorMessage(window.sL.ERRORcouldNotFindGroupWithNickname.replace('{nickname}',replaceHtmlSpecialChars(streamObject.nickname)));
					}
				else if(streamObject.name == 'list notice stream'
					 || streamObject.name == 'list members'
					 || streamObject.name == 'list subscribers') {
					showErrorMessage(window.sL.ERRORcouldNotFindList);
					}
				else {
					showErrorMessage(window.sL.ERRORcouldNotFindPage + '<br><br>url: ' + url);
					}
				}
			else if(error.status == 410 && streamObject.name == 'notice') {
				showErrorMessage(window.sL.ERRORnoticeRemoved);
				}
			else if(error.status == 0
			|| (error.status == 200 && error.responseText == 'An error occurred.')
				) {
				showErrorMessage(window.sL.ERRORnoContactWithServer + ' (' + replaceHtmlSpecialChars(error.statusText) + ')');
				}
			else {
				showErrorMessage(window.sL.ERRORsomethingWentWrong + '<br><br>\
								  url: ' + url + '<br><br>\
								  jQuery ajax() error:<pre><code>' + replaceHtmlSpecialChars(JSON.stringify(error, null, ' ')) + '</code></pre>\
								  streamObject:<pre><code>' + replaceHtmlSpecialChars(JSON.stringify(streamObject, null, ' ')) + '</code></pre>\
								  ');
				}
			}

		// everything seems fine, show the new stream
		else if(queet_data) {

			// set location bar from stream
			if(setLocation) {
				setUrlFromStream(streamObject);
				}

			// profile card from user array
			if(userArray) {
				addProfileCardToDOM(buildProfileCard(userArray));
				}
			// remove any trailing profile cards
			else {
				$('.profile-card').remove();
				}

			// show group profile card if this is a group stream
			if(streamObject.name == 'group notice stream'
			|| streamObject.name == 'group member list'
			|| streamObject.name == 'group admin list') {
				groupProfileCard(streamObject.nickname);
				}

			// say hello to the api if this is notifications stream, to
			// get correct unread notifcation count
			if(window.currentStreamObject.name == 'notifications') {
				helloAPI();
				}

			// start checking for new queets again
			window.clearInterval(checkForNewQueetsInterval);
			checkForNewQueetsInterval=window.setInterval(function(){checkForNewQueets()},window.timeBetweenPolling);

			// add this stream to the history menu
			addStreamToHistoryMenuAndMarkAsCurrent(streamObject);

			remove_spinner();

			// some streams, e.g. /statuses/show/1234.json is not enclosed in an array, make sure it is
			if(!$.isArray(queet_data)) {
				queet_data = [queet_data];
				}



			// empty feed-body if this is a
			// (1) notice page
			// (2) if we got an empty result
			// (3) it's not a stream of notices or notifications
			if(window.currentStreamObject.name == 'notice'
			|| queet_data.length==0
			|| (window.currentStreamObject.type != 'notices' && window.currentStreamObject.type != 'notifications')) {
				$('#feed-body').html('');
				}
			// if the last item in the stream doesn't exists in the feed-body, we can't
			// just prepend the new items, since it will create a gap in the middle of the
			// feed. in that case we just empty the body and start from scratch
			else if($('#feed-body').children('.stream-item[data-quitter-id-in-stream="' + queet_data.slice(-1)[0].id + '"]').length == 0) {
				$('#feed-body').html('');
				}

			// if the stream is slow to load, the user might have expanded a notice, or scrolled down
			// and started reading. in that case we add the new items _hidden_
			if($('#feed-body').children('.stream-item.expanded').length>0 || $(window).scrollTop() > 50) {
				addToFeed(queet_data, false,'hidden');
				maybeShowTheNewQueetsBar();
				}
			else {
				addToFeed(queet_data, false,'visible');
				}


			// fade in if we need too
			if(parseInt($('#feed').css('opacity'),10) == '0') {
				$('#feed').animate({opacity:'1'},150);
				}

			$('.reload-stream').show();
			$('body').removeClass('loading-older');$('body').removeClass('loading-newer');

			// maybe do something
			if(typeof actionOnSuccess == 'function') {
				actionOnSuccess();
				}
			}
		});
	}


/* ·
   ·
   ·   Add this stream to history menu if it doesn't exist in stream selection menus (if we're logged in)
   ·   and mark this stream as current
   ·
   ·   @param streamObject: stream object returned by pathToStreamRouter()
   ·
   · · · · · · · · · */


function addStreamToHistoryMenuAndMarkAsCurrent(streamObject) {

	if(streamObject.parentPath) {
		var urlToMarkAsCurrent = window.siteInstanceURL + streamObject.parentPath;
		}
	else {
		var urlToMarkAsCurrent = window.siteInstanceURL + streamObject.path;
		}

	if($('.stream-selection[href="' + urlToMarkAsCurrent + '"]').length==0
	&& typeof window.loggedIn.screen_name != 'undefined') {
		$('#history-container').prepend('<a class="stream-selection" href="' + urlToMarkAsCurrent + '">' + streamObject.streamHeader + '<i class="chev-right" data-tooltip="' + window.sL.tooltipBookmarkStream + '"></i></a>');
		updateHistoryLocalStorage();
		// max 10 in history container
		var historyNum = $('#history-container').children('.stream-selection').length;
		if(historyNum > 10) {
			$('#history-container').children('.stream-selection').slice(-(historyNum-10)).remove();
			}
		}


	$('.stream-selection').removeClass('current');
	$('.stream-selection[href="' + urlToMarkAsCurrent + '"]').addClass('current');
	}



/* ·
   ·
   ·   Expand/de-expand queet
   ·
   ·   @param q: the stream item to expand
   ·   @param doScrolling: if we should scroll back to position or not
   ·
   · · · · · · · · · */

function expand_queet(q,doScrolling) {

	// don't do anything if this is a queet being posted
	if(q.hasClass('temp-post')) {
		return;
		}

	// don't expand if this is a remote profile popup
	if(q.closest('#popup-external-profile, #popup-local-profile').length>0) {
		return;
		}

	doScrolling = typeof doScrolling !== 'undefined' ? doScrolling : true;
	var qid = q.attr('data-quitter-id');

	// de-expand if expanded
	if(q.hasClass('expanded') && !q.hasClass('collapsing')) {
		var sel = getSelection().toString();

    	if(!sel
    	&& !q.find('.queet-button').children('button').hasClass('enabled')
    	&& !q.find('.queet-button').children('button').hasClass('too-long')) { // don't collapse if text is selected, or if queet has an active queet button, or if queet text is too long

			// remove some things right away
			q.find('.inline-reply-caret').remove();

			// "unplay" gif image on collapse if there's only one attachment (switch to thumb)
			var gifToUnPlay = q.children('.queet').find('.queet-thumbs.thumb-num-1').children('.thumb-container.play-button').children('.attachment-thumb[data-mime-type="image/gif"]');
			if(gifToUnPlay.length > 0) {
				gifToUnPlay.attr('src',gifToUnPlay.attr('data-thumb-url'));
				gifToUnPlay.parent('.thumb-container').css('background-image','url(\'' + gifToUnPlay.attr('data-thumb-url') + '\')');
				}

			// show thumbs (if hidden) and remove any iframe video immediately
			q.children('.queet').find('.queet-thumbs').removeClass('hide-thumbs');
			q.children('.queet').find('iframe').remove();

			q.addClass('collapsing');
			if(q.hasClass('conversation')) {
				q.removeClass('expanded');
				q.removeClass('collapsing');
				q.find('.view-more-container-top').remove();
				q.find('.view-more-container-bottom').remove();
				q.find('.stream-item.conversation').remove();
				q.find('.inline-reply-queetbox').remove();
				q.find('.expanded-content').remove();
				}
			else {
				rememberMyScrollPos(q.children('.queet'),qid,0);

				// give stream item a height
				q.css('height',q.height() + 'px');
				q.children('.queet').find('.expanded-content').css('height',q.find('.expanded-content').height() + 'px');
				q.children('.queet').find('.queet-thumbs.thumb-num-1').css('max-height',q.find('.queet-thumbs.thumb-num-1').height() + 'px');
				q.children('.queet').find('.queet-thumbs.thumb-num-1 .thumb-container').css('max-height',q.find('.queet-thumbs.thumb-num-1').height() + 'px');

				q.children('div').not('.queet').children('a').css('opacity','0.5');
				q.children('div').not('.queet').children().children().css('opacity','0.5');

				var collapseTime = 100 + q.find('.stream-item.conversation:not(.hidden-conversation)').length*50;

				// set transition time (needs to be delayed, otherwise webkit animates the height-setting above)
 				setTimeout(function() {
					q.children('.queet').css('-moz-transition-duration',Math.round( collapseTime / 1000 * 10) / 10 + 's');
					q.children('.queet').css('-o-transition-duration',Math.round( collapseTime / 1000 * 10) / 10 + 's');
					q.children('.queet').css('-webkit-transition-duration',Math.round( collapseTime * 1000 * 10) / 10 + 's');
					q.children('.queet').css('transition-duration',Math.round( collapseTime / 1000 * 10) / 10 + 's');
					q.children('.queet').find('.expanded-content, .queet-thumbs.thumb-num-1, .queet-thumbs.thumb-num-1 .thumb-container').css('-moz-transition-duration',Math.round( collapseTime / 1000 * 10) / 10 + 's');
					q.children('.queet').find('.expanded-content, .queet-thumbs.thumb-num-1, .queet-thumbs.thumb-num-1 .thumb-container').css('-o-transition-duration',Math.round( collapseTime / 1000 * 10) / 10 + 's');
					q.children('.queet').find('.expanded-content, .queet-thumbs.thumb-num-1, .queet-thumbs.thumb-num-1 .thumb-container').css('-webkit-transition-duration',Math.round( collapseTime * 1000 * 10) / 10 + 's');
					q.children('.queet').find('.expanded-content, .queet-thumbs.thumb-num-1, .queet-thumbs.thumb-num-1 .thumb-container').css('transition-duration',Math.round( collapseTime / 1000 * 10) / 10 + 's');
					q.css('-moz-transition-duration',Math.round( collapseTime / 1000 * 10) / 10 + 's');
					q.css('-o-transition-duration',Math.round( collapseTime / 1000 * 10) / 10 + 's');
					q.css('-webkit-transition-duration',Math.round( collapseTime * 1000 * 10) / 10 + 's');
					q.css('transition-duration',Math.round( collapseTime / 1000 * 10) / 10 + 's');

					// set new heights and margins to animate to
					var animateToHeight = q.children('.queet').outerHeight() - q.find('.inline-reply-queetbox').outerHeight() - q.children('.queet').find('.expanded-content').outerHeight() - Math.max(0,q.children('.queet').find('.queet-thumbs.thumb-num-1').outerHeight()-250) - 2;
					if(animateToHeight < 73) { // no less than this
						animateToHeight = 73;
						}
					q.css('height',animateToHeight + 'px');
					q.children('.queet').css('margin-top', '-' + (q.children('.queet').offset().top - q.offset().top) + 'px');
					q.children('.queet').find('.expanded-content').css('height','0');
					q.children('.queet').find('.queet-thumbs.thumb-num-1, .queet-thumbs.thumb-num-1 .thumb-container').css('max-height','250px');

					if(doScrolling) {
						setTimeout(function() {
							backToMyScrollPos(q,qid,500,function(){
								cleanUpAfterCollapseQueet(q);
								});
							}, collapseTime);
						}
					else {
						setTimeout(function() {
							cleanUpAfterCollapseQueet(q);
							}, collapseTime);
						}

 					}, 50);



				}
	    	}
		}
	else if(!q.hasClass('collapsing')) {

		// not for acitivity or notifications
		if(!q.hasClass('activity') && !q.hasClass('repeat') && !q.hasClass('like') && !q.hasClass('follow')) {

			q.addClass('expanded');
			q.prev().addClass('next-expanded');

			// get full html, if shortened
			getFullUnshortenedHtmlForQueet(q);

			// add expanded container
			var longdate = parseTwitterLongDate(q.find('.created-at').attr('data-created-at'));
			var qurl = q.find('.created-at').find('a').attr('href');

			var metadata = '<span class="longdate" title="' + longdate + '">' + longdate + ' · ' + unescape(q.attr('data-source')) + '</span> · <a href="' + qurl + '" class="permalink-link">' + window.sL.details + '</a>';

			// show expanded content
			q.find('.stream-item-footer').before('<div class="expanded-content"><div class="queet-stats-container"></div><div class="client-and-actions"><span class="metadata">' + metadata + '</span></div></div>');

			// "play" gif image on expand if there's only one attachment (switch to full gif from thumb)
			var gifToPlay = q.children('.queet').find('.queet-thumbs.thumb-num-1').children('.thumb-container.play-button').children('.attachment-thumb[data-mime-type="image/gif"]');
			if(gifToPlay.length > 0) {
				gifToPlay.attr('src',gifToPlay.attr('data-full-image-url'));
				gifToPlay.parent('.thumb-container').css('background-image','url(\'' + gifToPlay.attr('data-full-image-url') + '\')');
				}

			// if there's only one thumb and it's a youtube video, show it inline
			if(q.children('.queet').find('.queet-thumbs.thumb-num-1').children('.thumb-container.play-button.youtube').length == 1) {
				var youtubeURL = q.children('.queet').find('.queet-thumbs.thumb-num-1').children('.thumb-container.play-button.youtube').children('.attachment-thumb').attr('data-full-image-url');
				if(q.children('.queet').find('.expanded-content').children('.media').children('iframe[src="' + youTubeEmbedLinkFromURL(youtubeURL) + '"]').length < 1) { // not if already showed
					// hide video thumbnail if it's the only one
					if(q.children('.queet').find('.queet-thumbs').children('.thumb-container').length < 2) {
						q.children('.queet').find('.queet-thumbs').addClass('hide-thumbs');
						}
					// show video
					q.children('.queet').find('.expanded-content').prepend('<div class="media"><iframe width="510" height="315" src="' + youTubeEmbedLinkFromURL(youtubeURL) + '" frameborder="0" allowfullscreen></iframe></div>');
					}
				}

			// show certain attachments in expanded content
			if(q.attr('data-attachments') != 'undefined') {
				try {
					var attachmentsParsed = JSON.parse(q.attr('data-attachments'));
					}
				catch(e) {
					var attachmentsParsed = false;
					console.log('could not parse attachment data when expanding the notice');
					}
				if(attachmentsParsed !== false) {
					$.each(attachmentsParsed, function() {

						var attachment_mimetype = this.mimetype;
						var attachment_title = this.url;

						// filename extension
						var attachment_title_extension = attachment_title.substr((~-attachment_title.lastIndexOf(".") >>> 0) + 2);

						// attachments in the content link to /attachment/etc url and not direct to image/video, link is in title
						if(typeof attachment_title != 'undefined') {

							// hack to make remote webm-movies load
							if(attachment_title_extension == 'webm') {
								attachment_mimetype = 'video/webm';
								}

							// videos
							if($.inArray(attachment_mimetype, ['video/mp4', 'video/ogg', 'video/quicktime', 'video/webm']) >=0) {
								if(q.children('.queet').find('.expanded-content').children('.media').children('video').children('source[href="' + attachment_title + '"]').length < 1) { // not if already showed

									// local attachment with a thumbnail
									var attachment_poster = '';
									if(typeof this.thumb_url != 'undefined') {
										attachment_poster = ' poster="' + this.thumb_url + '"';
										}

									if(q.children('.queet').find('.expanded-content').children('.media').length > 0) {
										q.children('.queet').find('.media').last().after('<div class="media"><video class="u-video" controls="controls"' + attachment_poster + '><source type="' + attachment_mimetype + '" src="' + attachment_title + '" /></video></div>');
										}
									else {
										q.children('.queet').find('.expanded-content').prepend('<div class="media"><video class="u-video" controls="controls"' + attachment_poster + '><source type="' + attachment_mimetype + '" src="' + attachment_title + '" /></video></div>');
										}
								}
							}
							else {
								// other plugins, e.g. gotabulo, can check for other attachment file formats to expand
								window.currentlyExpanding = {
									"attachment_title":attachment_title,
									"attachment_mimetype":attachment_mimetype,
									"attachment_title_extension":attachment_title_extension,
									"streamItem":q,
									"thisAttachmentLink":$(this)
									};
								$(document).trigger('qvitterExpandOtherAttachments');
								}
							}
						});
					}
				}

			// get and show favs and repeats
			getFavsAndRequeetsForQueet(q, qid);


			// show conversation and reply form (but not if already in conversation)
			if(!q.hasClass('conversation')) {

				// show conversation
				getConversation(q, qid);

				// show inline reply form if logged in
				if(typeof window.loggedIn.screen_name != 'undefined') {
					q.children('.queet').append(replyFormHtml(q,qid));
					maybePrefillQueetBoxWithCachedText(q.children('.queet').find('.queet-box'));
                    }
				}
			}
		}
	}
function cleanUpAfterCollapseQueet(q) {
	q.css('height','auto');
	q.children('.queet').css('margin-top','0');
	q.removeClass('expanded');
	q.prev().removeClass('next-expanded');
	q.removeClass('collapsing');
	q.find('.expanded-content').remove();
	q.find('.view-more-container-top').remove();
	q.find('.view-more-container-bottom').remove();
	q.find('.inline-reply-queetbox').remove();
	q.find('.stream-item.conversation').remove();
	q.find('.show-full-conversation').remove();
	q.removeAttr('style');
	q.children('.queet').removeAttr('style');
	q.children('.queet').find('.queet-thumbs.thumb-num-1').removeAttr('style');
	q.children('.queet').find('.queet-thumbs.thumb-num-1 .thumb-container').css('max-height','');
	}


/* ·
   ·
   ·   Get a popup queet box
   ·
   ·   @return the html for the queet box
   ·
   · · · · · · · · · */

function queetBoxPopUpHtml() {

    // if we have cached text in localstorage
	var data = localStorageObjectCache_GET('queetBoxInput','pop-up-queet-box');
    if(data) {
        var cachedText = encodeURIComponent(data);
		}

	var startText = encodeURIComponent(window.sL.compose);
	return '<div class="inline-reply-queetbox"><div id="pop-up-queet-box" class="queet-box queet-box-syntax" data-start-text="' + startText + '" data-cached-text="' + cachedText + '">' + decodeURIComponent(startText) + '</div><div class="syntax-middle"></div><div class="syntax-two" contenteditable="true"></div><div class="mentions-suggestions"></div><div class="queet-toolbar toolbar-reply"><div class="queet-box-extras"><button data-tooltip="' + window.sL.tooltipAttachImage + '" class="upload-image"></button><button data-tooltip="' + window.sL.tooltipShortenUrls + '" class="shorten disabled">URL</button></div><div class="queet-button"><span class="queet-counter"></span><button>' + window.sL.queetVerb + '</button></div></div></div>';
	}



/* ·
   ·
   ·   Get a reply form
   ·
   ·   @param q: the stream item to open reply form in
   ·   @param qid: queet id
   ·   @return the html for the reply form
   ·
   · · · · · · · · · */

function replyFormHtml(q,qid) {

    // if we have cached text in localstorage
	var data = localStorageObjectCache_GET('queetBoxInput','queet-box-' + qid);
    if(data) {
        var cachedText = encodeURIComponent(data);
		}

    // get all @:s
	var user_screen_name = q.children('.queet').find('.screen-name').html().substring(1);
	var user_screen_name_html = '<a>@' + user_screen_name + '</a>';
	var user_screen_name_text = '@' + user_screen_name;
	var reply_to_screen_name = '';
	var reply_to_screen_name_html = '';
	var reply_to_screen_name_text = '';
	if(q.attr('data-in-reply-to-screen-name').length>0 // not if not a reply
	&& q.attr('data-in-reply-to-screen-name') != $('#user-screen-name').html() // not if it's me
	&& q.attr('data-in-reply-to-screen-name') != user_screen_name // not same screen name twice
		) {
		reply_to_screen_name = q.attr('data-in-reply-to-screen-name');
		reply_to_screen_name_html = '&nbsp;<a>@' + reply_to_screen_name + '</a>';
		reply_to_screen_name_text = ' @' + reply_to_screen_name;
		}
	var more_reply_tos = '';
	var more_reply_tos_text = '';
	$.each(q.children('.queet').find('.queet-text').find('.mention'),function(key,obj){
		var thisMention = $(obj).html().replace('@','');
		if(thisMention != user_screen_name && thisMention != reply_to_screen_name && thisMention != $('#user-screen-name').html()) {
			more_reply_tos = more_reply_tos + '&nbsp;<a>@' + thisMention + '</a>';
			more_reply_tos_text = more_reply_tos_text + ' @' + thisMention;
			}
		});

	var startText = window.sL.replyTo + ' ' + user_screen_name_html + reply_to_screen_name_html + more_reply_tos + '&nbsp;<br>';
    var repliesText = user_screen_name_text + reply_to_screen_name_text + more_reply_tos_text + '&nbsp;';

	startText = encodeURIComponent(startText);
	repliesText = encodeURIComponent(repliesText);
	return '<div class="inline-reply-queetbox"><span class="inline-reply-caret"><span class="caret-inner"></span></span><img class="reply-avatar" src="' + $('#user-avatar').attr('src') + '" /><div class="queet-box queet-box-syntax" id="queet-box-' + qid + '" data-start-text="' + startText + '" data-replies-text="' + repliesText + '" data-cached-text="' + cachedText + '">' + decodeURIComponent(startText) + '</div><div class="syntax-middle"></div><div class="syntax-two" contenteditable="true"></div><div class="mentions-suggestions"></div><div class="queet-toolbar toolbar-reply"><div class="queet-box-extras"><button data-tooltip="' + window.sL.tooltipAttachImage + '" class="upload-image"></button><button data-tooltip="' + window.sL.tooltipShortenUrls + '" class="shorten disabled">URL</button></div><div class="queet-button"><span class="queet-counter"></span><button>' + window.sL.queetVerb + '</button></div></div></div>';
	}


/* ·
   ·
   ·   Popup for replies, deletes, etc
   ·
   ·   @param popupId: popups id
   ·   @param heading: popops header
   ·   @param bodyHtml: popups body html
   ·   @param footerHtml: popups footer html
   ·
   · · · · · · · · · · · · · */

function popUpAction(popupId, heading, bodyHtml, footerHtml, popUpWidth){
	$('.modal-container').remove(); // remove any open popups
	var allFooterHtml = '';
	if(footerHtml) {
		allFooterHtml = '<div class="modal-footer">' + footerHtml + '</div>';
		}
	$('body').prepend('<div id="' + popupId + '" class="modal-container"><div class="modal-draggable"><div class="modal-content"><button class="modal-close" type="button"><span class="icon"></span></button><div class="modal-header"><h3 class="modal-title">' + heading + '</h3></div><div class="modal-body">' + bodyHtml + '</div>' + allFooterHtml + '</div></div></div>');
	var thisPopUp = $('#' + popupId).children('.modal-draggable');

	if(typeof popUpWidth != 'undefined') {
		thisPopUp.width(popUpWidth);
		}
	centerPopUp(thisPopUp);
	}
function centerPopUp(thisPopUp) {
	thisPopUp.css('margin-top','');
	thisPopUp.css('margin-left','');
	var this_modal_height = thisPopUp.height();
	var this_modal_width = thisPopUp.width();
	var popupPos = thisPopUp.offset().top - $(window).scrollTop();
	if((popupPos-(this_modal_height/2))<5) {
		var marginTop = 5-popupPos;
		}
	else {
		var marginTop = 0-this_modal_height/2;
		}
	thisPopUp.css('margin-top', marginTop + 'px');
	thisPopUp.css('margin-left', '-' + (this_modal_width/2) + 'px');
	thisPopUp.draggable({ handle: ".modal-header" });
	}



/* ·
   ·
   ·  Get and show conversation
   ·
   ·  This function has grown into a monster, needs fixing
   ·
   · · · · · · · · · · · · · */

function getConversation(q, qid) {

	// check if we have a conversation for this notice cached in localstorage
	var cacheData = localStorageObjectCache_GET('conversation',q.attr('data-conversation-id'));
	if(cacheData) {
		showConversation(q, qid, cacheData, 8);
		}
	// always get most recent conversation from server
	getFromAPI('statusnet/conversation/' + q.attr('data-conversation-id') + '.json?count=100', function(data){ if(data) {

		// cache in localstorage
		localStorageObjectCache_STORE('conversation',q.attr('data-conversation-id'), data);

		showConversation(q, qid,data, 0);
		}});
	}


function showConversation(q, qid, data, offsetScroll) {

	if(data && !q.hasClass('collapsing')){

		if(data.length>1) {
			var before_or_after = 'before';
			$.each(data.reverse(), function (key,obj) {

				// switch to append after original queet
				if(obj.id == qid) {
					before_or_after = 'after';
					}

				// don't add clicked queet to DOM, but all else
				// note: first we add the full conversation, but hidden
				if(obj.id != qid) {
					var queetTime = parseTwitterDate(obj.created_at);
					var queetHtml = buildQueetHtml(obj, obj.id, 'hidden-conversation', false, true);

					if(q.hasClass('expanded')) { // add queet to conversation only if still expanded

						// don't add if already exist in conversation
						if(q.children('.stream-item.conversation[data-quitter-id="' + obj.id + '"]').length > 0) {
							// the data in the existing notice is updated automatically in searchForUpdatedNoticeData invoked from getFromAPI
							}
						else if(before_or_after == 'before') {
							q.children('.queet').before(queetHtml);
							}
						else {
							if(q.children('.queet').nextAll('.conversation').length < 1) {
								q.children('.queet').after(queetHtml);
								}
							else {
								q.children('.queet').nextAll('.conversation').last().after(queetHtml);
								}
							}

						}
					}
				convertAttachmentMoreHref();
				});
			}
		else {
			remove_spinner();
			}

		// loop trough this stream items conversation and show the "strict" line of replies
		rememberMyScrollPos(q.children('.queet'),qid,offsetScroll);
		findInReplyToStatusAndShow(q,qid,q.attr('data-in-reply-to-status-id'),true,false);
		backToMyScrollPos(q.children('.queet'),qid,false);
		findAndMarkLastVisibleInConversation(q);
		}
	else {
		remove_spinner();
		}
	}


/* ·
   ·
   ·  Add last visible class, since that's not possible to select in pure css
   ·
   · · · · · · · · · · · · · */
function findAndMarkLastVisibleInConversation(streamItem) {
	streamItem.children().removeClass('last-visible');
	streamItem.children().removeClass('first-visible-after-parent');
	streamItem.children().not('.hidden-conversation').last().addClass('last-visible');
	streamItem.children('.queet').nextAll().not('.hidden-conversation').first().addClass('first-visible-after-parent');
	}


/* ·
   ·
   ·  Recursive walker functions to view only reyplies to replies, not full conversation
   ·
   · · · · · · · · · · · · · */

function findInReplyToStatusAndShow(q, qid,reply,only_first,onlyINreplyto) {
	var reply_found = q.find('.stream-item[data-quitter-id="' + reply + '"]');
	var reply_found_reply_to = q.find('.stream-item[data-quitter-id="' + reply_found.attr('data-in-reply-to-status-id') + '"]');
	if(reply_found.length>0) {
		reply_found.removeClass('hidden-conversation');
		reply_found.css('opacity','1');
		if(only_first && reply_found_reply_to.length>0) {
			if(q.children('.view-more-container-top').length < 1) {
				if(q.children('.queet').prevAll('.hidden-conversation').length>0) {
					q.prepend('<div class="view-more-container-top" data-trace-from="' + reply + '"><a>' + window.sL.viewMoreInConvBefore + '</a></div>');
					}
				}
			findReplyToStatusAndShow(q, qid,qid,true);
			}
		else {
			findInReplyToStatusAndShow(q, qid,reply_found.attr('data-in-reply-to-status-id'),false,onlyINreplyto);
			}
		}
	else if(!onlyINreplyto) {
		findReplyToStatusAndShow(q, qid,qid,true);
		}
	else {
		checkForHiddenConversationQueets(q, qid);
		}
	}
// recursive function to find the replies to a status
function findReplyToStatusAndShow(q, qid,this_id,only_first) {

	var replies_found = q.find('.stream-item[data-in-reply-to-status-id="' + this_id + '"]');

	$.each(replies_found, function(k,reply_found){

		var reply_founds_reply = q.find('.stream-item[data-in-reply-to-status-id="' + $(reply_found).attr('data-quitter-id') + '"]');

		$(reply_found).removeClass('hidden-conversation');
		$(reply_found).css('opacity','1');

		if(!only_first) {
			findReplyToStatusAndShow(q, qid,$(this).attr('data-quitter-id'),false);
			}
		if(only_first && reply_founds_reply.length>0) {
			if(q.children('.view-more-container-bottom').length < 1) {
				if(q.children('.queet').nextAll('.hidden-conversation').length>0) {
					q.append('<div class="view-more-container-bottom" data-replies-after="' + qid + '"><a>' + window.sL.viewMoreInConvAfter + '</a></div>');
					}
				}
			}

		});
	checkForHiddenConversationQueets(q, qid);
	}

// helper function for the above recursive functions
function checkForHiddenConversationQueets(q, qid) {
	// here we check if there are any remaining hidden queets in conversation, if there are, we put a "show full conversation"-link
	if(q.find('.hidden-conversation').length>0) {
		if(q.children('.queet').find('.show-full-conversation').length == 0) {
			q.children('.queet').find('.stream-item-footer').append('<span class="show-full-conversation" data-stream-item-id="' + qid + '">' + window.sL.expandFullConversation + '</span>');
			}
		}
	else {
		q.children('.queet').find('.show-full-conversation').remove();
		}
	}


/* ·
   ·
   ·   Build stream items and add them to feed
   ·
   ·   Also a function that has grown out of control... Needs total makeover
   ·
   · · · · · · · · · · · · · */

function addToFeed(feed, after, extraClasses) {


	// some streams, e.g. /statuses/show/1234.json is not enclosed in an array, make sure it is
	if(!$.isArray(feed)) {
		feed = [feed];
		}

	var addedToTopOfFeedBodyNum = 0;

	$.each(feed.reverse(), function (key,obj) {

		var extraClassesThisRun = extraClasses;

		// if this is the notifications feed
		if(window.currentStreamObject.name == 'notifications') {

			// don't show any notices with object_type "activity"
			if(typeof obj.notice != 'undefined' && obj.notice !== null && obj.notice.is_activity === true) {
				return true;
				}

			// only if this notification isn't already in stream
			if($('#feed-body > .stream-item[data-quitter-id-in-stream="' + obj.id + '"]').length == 0) {

				obj.from_profile.description = obj.from_profile.description || '';
				var notificationTime = parseTwitterDate(obj.created_at);

				if(obj.is_seen == '0') {
					extraClassesThisRun += ' not-seen'
					}

				// external
				var ostatusHtml = '';
				if(obj.from_profile.is_local === false) {
					ostatusHtml = '<a target="_blank" data-tooltip="' + window.sL.goToOriginalNotice + '" class="ostatus-link" href="' + obj.from_profile.statusnet_profile_url + '"></a>';
					}


				if(obj.ntype == 'like') {
					var noticeTime = parseTwitterDate(obj.notice.created_at);
					var notificationHtml = '<div data-quitter-id-in-stream="' + obj.id + '" id="stream-item-n-' + obj.id + '" class="stream-item ' + extraClassesThisRun + ' notification like">\
												<div class="queet">\
													<div class="dogear"></div>\
													' + ostatusHtml + '\
													<div class="queet-content">\
														<div class="stream-item-header">\
															<a class="account-group" href="' + obj.from_profile.statusnet_profile_url + '" data-user-id="' + obj.from_profile.id + '">\
																<img class="avatar standard-size" src="' + obj.from_profile.profile_image_url + '" data-user-id="' + obj.from_profile.id + '" />\
																<strong class="name" data-user-id="' + obj.from_profile.id + '" title="@' + obj.from_profile.screen_name + '">\
																	' + obj.from_profile.name + '\
																</strong>\
															</a> \
															' + window.sL.xFavedYourQueet + '\
															<small class="created-at" data-created-at="' + obj.created_at + '" data-tooltip="' + parseTwitterLongDate(obj.created_at) + '">\
																' + notificationTime + '\
															</small>\
														</div>\
														<div class="small-grey-notice">\
															<a data-created-at="' + obj.notice.created_at + '" data-tooltip="' + parseTwitterLongDate(obj.notice.created_at) + '" href="' + window.siteInstanceURL + 'notice/' + obj.notice.id + '">\
																' + noticeTime + '\
															</a>: \
															' + $.trim(obj.notice.statusnet_html) + '\
														</div>\
													</div>\
												</div>\
											</div>';
					}
				else if(obj.ntype == 'repeat') {
					var noticeTime = parseTwitterDate(obj.notice.created_at);
					var notificationHtml = '<div data-quitter-id-in-stream="' + obj.id + '" id="stream-item-n-' + obj.id + '" class="stream-item ' + extraClassesThisRun + ' notification repeat">\
												<div class="queet">\
													<div class="dogear"></div>\
													' + ostatusHtml + '\
													<div class="queet-content">\
														<div class="stream-item-header">\
															<a class="account-group" href="' + obj.from_profile.statusnet_profile_url + '" data-user-id="' + obj.from_profile.id + '">\
																<img class="avatar standard-size" src="' + obj.from_profile.profile_image_url + '" data-user-id="' + obj.from_profile.id + '" />\
																<strong class="name" data-user-id="' + obj.from_profile.id + '" title="@' + obj.from_profile.screen_name + '">\
																	' + obj.from_profile.name + '\
																</strong>\
															</a> \
															' + window.sL.xRepeatedYourQueet + '\
															<small class="created-at" data-created-at="' + obj.created_at + '" data-tooltip="' + parseTwitterLongDate(obj.created_at) + '">\
																' + notificationTime + '\
															</small>\
														</div>\
														<div class="small-grey-notice">\
															<a data-created-at="' + obj.notice.created_at + '" data-tooltip="' + parseTwitterLongDate(obj.notice.created_at) + '" href="' + window.siteInstanceURL + 'notice/' + obj.notice.id + '">\
																' + noticeTime + '\
															</a>: \
															' + $.trim(obj.notice.statusnet_html) + '\
														</div>\
													</div>\
												</div>\
											</div>';
					}
				else if(obj.ntype == 'mention') {
					var notificationHtml = buildQueetHtml(obj.notice, obj.id, extraClassesThisRun + ' notification mention');
					}
				else if(obj.ntype == 'reply') {
					var notificationHtml = buildQueetHtml(obj.notice, obj.id, extraClassesThisRun + ' notification reply');
					}
				else if(obj.ntype == 'follow') {
					var notificationHtml = '<div data-quitter-id-in-stream="' + obj.id + '" id="stream-item-n-' + obj.id + '" class="stream-item ' + extraClassesThisRun + ' notification follow">\
												<div class="queet">\
													<div class="queet-content">\
														' + ostatusHtml + '\
														<div class="stream-item-header">\
															<a class="account-group" href="' + obj.from_profile.statusnet_profile_url + '" data-user-id="' + obj.from_profile.id + '">\
																<img class="avatar standard-size" src="' + obj.from_profile.profile_image_url + '" data-user-id="' + obj.from_profile.id + '" />\
																<strong class="name" data-user-id="' + obj.from_profile.id + '" title="@' + obj.from_profile.screen_name + '">\
																	' + obj.from_profile.name + '\
																</strong>\
															</a> \
															' + window.sL.xStartedFollowingYou + '\
															<small class="created-at" data-created-at="' + obj.created_at + '" title="' + obj.created_at + '">\
																' + notificationTime + '\
															</small>\
														</div>\
													</div>\
												</div>\
											</div>';
					}

				if(after) {
					$('#' + after).after(notificationHtml);
					}
				else {
					$('#feed-body').prepend(notificationHtml);
					addedToTopOfFeedBodyNum++;
					}
				}
			}

		// if this is a user feed
		else if(window.currentStreamObject.type == 'users') {

			// only if not user is already in stream
			if($('#stream-item-' + obj.id).length == 0) {

				obj.description = obj.description || '';

				// external
				var ostatusHtml = '';
				if(obj.is_local === false) {
					ostatusHtml = '<a target="_blank" title="' + window.sL.goToTheUsersRemoteProfile + '" class="ostatus-link" href="' + obj.statusnet_profile_url + '"></a>';
					}

				// rtl or not
				var rtlOrNot = '';
				if($('body').hasClass('rtl')) {
					rtlOrNot = 'rtl';
					}

				// show user actions
				var followingClass = '';
				if(obj.following) {
					followingClass = 'following';
					}
				var followButton = '';
				if(typeof window.loggedIn.screen_name != 'undefined'  	// if logged in
				   && window.loggedIn.id != obj.id) {	// not if this is me
					if(!(obj.statusnet_profile_url.indexOf('/twitter.com/')>-1 && obj.following === false)) { // only unfollow twitter users
						var followButton = '<div class="user-actions">\
												<button data-follow-user-id="' + obj.id + '" data-follow-user="' + obj.statusnet_profile_url + '" type="button" class="qvitter-follow-button ' + followingClass + '">\
													<span class="button-text follow-text"><i class="follow"></i>' + window.sL.userFollow + '</span>\
													<span class="button-text following-text">' + window.sL.userFollowing + '</span>\
													<span class="button-text unfollow-text">' + window.sL.userUnfollow + '</span>\
												</button>\
											</div>';
						}
					}

				var userHtml = '<div id="stream-item-' + obj.id + '" class="stream-item user"><div class="queet ' + rtlOrNot + '">' + followButton + '<div class="queet-content"><div class="stream-item-header"><a class="account-group" href="' + obj.statusnet_profile_url + '" data-user-id="' + obj.id + '"><img class="avatar profile-size" src="' + obj.profile_image_url_profile_size + '" data-user-id="' + obj.id + '" /><strong class="name" data-user-id="' + obj.id + '">' + obj.name + '</strong> <span class="screen-name" data-user-id="' + obj.id + '">@' + obj.screen_name + '</span></a>' + ostatusHtml + '</div><div class="queet-text">' + obj.description + '</div></div></div></div>';

				if(after) {
					$('#' + after).after(userHtml);
					}
				else {
					$('#feed-body').prepend(userHtml);
					addedToTopOfFeedBodyNum++;
					}
				}
			}

		// if this is a list of groups
		else if(window.currentStreamObject.type == 'groups') {

			// only if not group is already in stream
			if($('#stream-item-' + obj.id).length == 0) {

				obj.description = obj.description || '';
				obj.stream_logo = obj.stream_logo || window.defaultAvatarStreamSize;

				// rtl or not
				var rtlOrNot = '';
				if($('body').hasClass('rtl')) {
					rtlOrNot = 'rtl';
					}

				// show group actions if logged in
				var memberClass = '';
				if(obj.member) {
					memberClass = 'member';
					}
				var memberButton = '';
				if(typeof window.loggedIn.screen_name != 'undefined') {
					var memberButton = '<div class="user-actions"><button data-group-id="' + obj.id + '" type="button" class="member-button ' + memberClass + '"><span class="button-text join-text"><i class="join"></i>' + window.sL.joinGroup + '</span><span class="button-text ismember-text">' + window.sL.isMemberOfGroup + '</span><span class="button-text leave-text">' + window.sL.leaveGroup + '</span></button></div>';
					}
				var groupAvatar = obj.stream_logo;
				if(obj.homepage_logo != null) {
					groupAvatar = obj.homepage_logo;
					}
				var groupHtml = '<div id="stream-item-' + obj.id + '" class="stream-item user"><div class="queet ' + rtlOrNot + '">' + memberButton + '<div class="queet-content"><div class="stream-item-header"><a class="account-group" href="' + obj.url + '"><img class="avatar" src="' + groupAvatar + '" /><strong class="name" data-group-id="' + obj.id + '">' + obj.fullname + '</strong> <span class="screen-name">!' + obj.nickname + '</span></a></div><div class="queet-text">' + obj.description + '</div></div></div></div>';

				if(after) {
					$('#' + after).after(groupHtml);
					}
				else {
					$('#feed-body').prepend(groupHtml);
					addedToTopOfFeedBodyNum++;
					}
				}
			}

		// if this is a retweet
		// (note the difference between "the repeat-notice" and "the repeated notice")
		// but the unrepeat delete activity notices have retweeted_status added to them, so check this is not a delete notice
		else if(typeof obj.retweeted_status != 'undefined'
			 && (typeof obj.qvitter_delete_notice == 'undefined' || obj.qvitter_delete_notice === false)) {

			// if repeat-notice doesn't already exist in feed
			if($('#stream-item-' + obj.id).length == 0) {
				var queetHtml = buildQueetHtml(obj.retweeted_status, obj.id, extraClassesThisRun, obj);

				if(after) {
					$('#' + after).after(queetHtml);
					}
				else {
					$('#feed-body').prepend(queetHtml);
					addedToTopOfFeedBodyNum++;
					}
				}
			}

		// ordinary tweet
		else {

			// only if not already exist
			if($('#stream-item-' + obj.id).length == 0) {

				// remove any matching temp post
				if(typeof obj.user != 'undefined'
				&& obj.user.id == window.loggedIn.id
				&& $('#feed-body > .temp-post').length > 0
				&& after === false) {
					$('#feed-body > .temp-post').each(function (){
						if($(this).children('.queet').find('.queet-text').text() == obj.text) {
							$(this).remove();
							extraClassesThisRun = 'visible';
							}
						});
					}

				var queetHtml = buildQueetHtml(obj, obj.id, extraClassesThisRun);

				if(after) {
					$('#' + after).after(queetHtml);
					}
				else {

					$('#feed-body').prepend(queetHtml);
					addedToTopOfFeedBodyNum++;

					// if this is a single notice, we expand it
					if(window.currentStreamObject.name == 'notice') {
						expand_queet($('#stream-item-' + obj.id));
						}
					}
				}
			}
		});

	convertAttachmentMoreHref();

	// if we've added stuff to the top of feed-body, we update our stream cache
	if(addedToTopOfFeedBodyNum>0) {
		rememberStreamStateInLocalStorage();
		}
	$('.stream-selection').removeAttr('data-current-user-stream-name'); // don't remeber user feeds
	}


/* ·
   ·
   ·   Build HTML for a queet from an object
   ·
   ·   @param obj: a queet object
   ·   @param requeeted_by: if this is a requeet
   ·
   · · · · · · · · · · · · · */

function buildQueetHtml(obj, idInStream, extraClasses, requeeted_by, isConversation) {

	// if we've blocked this user, but it has slipped through anyway
	var blockingTooltip = '';
	if(typeof window.allBlocking != 'undefined') {
		$.each(window.allBlocking,function(){
			if(this == obj.user.id){
				extraClasses += ' profile-blocked-by-me';
				blockingTooltip = ' data-tooltip="' + window.sL.thisIsANoticeFromABlockedUser + '"';
				return false; // break
				}
			});
		}

	// deleted?
	if(typeof window.knownDeletedNotices[obj.uri] != 'undefined') {
		extraClasses += ' deleted always-hidden';
		}
	// unrepeated?
	if(typeof requeeted_by != 'undefined'
	&& requeeted_by !== false
	&& typeof window.knownDeletedNotices[requeeted_by.uri] != 'undefined') {
		extraClasses += ' unrepeated always-hidden';
		}

	// activity? (hidden with css)
	if(obj.source == 'activity' || obj.is_activity === true) {
		extraClasses += ' activity always-hidden';

		// because we had an xss issue with activities, the obj.statusnet_html of qvitter-deleted-activity-notices can contain unwanted html, so we escape, they are hidden anyway
		obj.statusnet_html = replaceHtmlSpecialChars(obj.statusnet_html);
		}

	// if we have the full html for a truncated notice cached in localstorage, we use that
	var cacheData = localStorageObjectCache_GET('fullQueetHtml',obj.id);
	if(cacheData) {
		obj.statusnet_html = cacheData;
		}

	// we don't want to print 'null' in in_reply_to_screen_name-attribute, someone might have that username!
	var in_reply_to_screen_name = '';
	if(obj.in_reply_to_screen_name != null) {
		in_reply_to_screen_name = obj.in_reply_to_screen_name;
		}

	// conversations has some slightly different id's
	var idPrepend = '';
	if(typeof isConversation != 'undefined' && isConversation === true) {
		var idPrepend = 'conversation-';
		extraClasses += ' conversation'
		}

	// is this mine?
	var isThisMine = 'not-mine';
	if(obj.user.id == window.loggedIn.id) {
		var isThisMine = 'is-mine';
		}

	// requeeted by me?
	var requeetedByMe = '';
	if(obj.repeated_id) {
		requeetedByMe = ' data-requeeted-by-me-id="' + obj.repeated_id + '" ';
		}

	// requeet html
	if(obj.repeated) {
		var requeetHtml = '<li class="action-rt-container"><a class="with-icn done"><span class="icon sm-rt" title="' + window.sL.requeetedVerb + '"></span></a></li>';
		extraClasses += ' requeeted';
		}
	else {
		var requeetHtml = '<li class="action-rt-container"><a class="with-icn"><span class="icon sm-rt ' + isThisMine + '" title="' + window.sL.requeetVerb + '"></span></a></li>';
		}
	// favorite html
	if(obj.favorited) {
		var favoriteHtml = '<a class="with-icn done"><span class="icon sm-fav" title="' + window.sL.favoritedVerb + '"></span></a>';
		extraClasses += ' favorited';
		}
	else {
		var favoriteHtml = '<a class="with-icn"><span class="icon sm-fav" title="' + window.sL.favoriteVerb + '"></span></a>';
		}


	// actions only for logged in users
	var queetActions = '';
	if(typeof window.loggedIn.screen_name != 'undefined') {
		queetActions = '<ul class="queet-actions"><li class="action-reply-container"><a class="with-icn"><span class="icon sm-reply" title="' + window.sL.replyVerb + '"></span></a></li>' + requeetHtml + '<li class="action-rq-num" data-rq-num="' + obj.repeat_num + '">' + obj.repeat_num + '</li><li class="action-fav-container">' + favoriteHtml + '</li><li class="action-fav-num" data-fav-num="' + obj.fave_num + '">' + obj.fave_num + '</li><li class="action-ellipsis-container"><a class="with-icn"><span class="icon sm-ellipsis" title="' + window.sL.ellipsisMore + '"></span></a></li></ul>';
		}

	// reply-to html
	var reply_to_html = '';
	if(obj.in_reply_to_screen_name !== null && obj.in_reply_to_profileurl !== null && obj.in_reply_to_screen_name != obj.user.screen_name) {
		reply_to_html = '<span class="reply-to"><a class="h-card mention" href="' + obj.in_reply_to_profileurl + '">@' + obj.in_reply_to_screen_name + '</a></span> ';
		}

	// in-groups html
	var in_groups_html = '';
	if(typeof obj.statusnet_in_groups != 'undefined' && obj.statusnet_in_groups !== false && typeof obj.statusnet_in_groups === 'object') {
		$.each(obj.statusnet_in_groups,function(){
			in_groups_html = in_groups_html + ' <span class="in-groups"><a class="h-card group" href="' + this.url + '">!' + this.nickname + '</a></span>';
			});
		}

	// requeets get's a context element and a identifying class
	// uri used is the repeate-notice's uri for repeats, not the repetED notice's uri (necessary if someone deletes a repeat)
	var URItoUse = obj.uri;
	var requeetHtml = '';
	if(typeof requeeted_by != 'undefined' && requeeted_by !== false) {
		var requeetedByHtml = '<a data-user-id="' + requeeted_by.user.id + '" href="' + requeeted_by.user.statusnet_profile_url + '"> <b>' + requeeted_by.user.name + '</b></a>';
		requeetHtml = '<div class="context" id="requeet-' + requeeted_by.id + '"><span class="with-icn"><i class="badge-requeeted" data-tooltip="' + parseTwitterDate(requeeted_by.created_at) + '"></i><span class="requeet-text"> ' + window.sL.requeetedBy.replace('{requeeted-by}',requeetedByHtml) + '</span></span></div>';
		var URItoUse = requeeted_by.uri;
		extraClasses += ' is-requeet';
		}

	// the URI for delete activity notices are the same as the notice that is to be deleted
	// so we make the URI for the (hidden) actitity notice unique, otherwise we might remove
	// the activity notice from DOM when we remove the deleted notice
	if(typeof obj.qvitter_delete_notice != 'undefined' && obj.qvitter_delete_notice == true) {
		URItoUse += '-activity-notice';
		}

	// external
	var ostatusHtml = '';
	if(obj.is_local === false) {
		ostatusHtml = '<a target="_blank" data-tooltip="' + window.sL.goToOriginalNotice + '" class="ostatus-link" href="' + obj.external_url + '"></a>';
		}
	var queetTime = parseTwitterDate(obj.created_at);
	var queetHtml = '<div \
						id="' + idPrepend + 'stream-item-' + idInStream + '" \
						data-uri="' + URItoUse + '" \
						class="stream-item notice ' + extraClasses + '" \
						data-attachments=\'' + JSON.stringify(obj.attachments) + '\'\
						data-source="' + escape(obj.source) + '" \
						data-quitter-id="' + obj.id + '" \
						data-conversation-id="' + obj.statusnet_conversation_id + '" \
						data-quitter-id-in-stream="' + idInStream + '" \
						data-in-reply-to-screen-name="' + in_reply_to_screen_name + '" \
						data-in-reply-to-status-id="' + obj.in_reply_to_status_id + '"\
						' + requeetedByMe + '>\
							<div class="queet" id="' + idPrepend + 'q-' + idInStream + '"' + blockingTooltip  + '>\
								' + requeetHtml + '\
								' + ostatusHtml + '\
								<div class="queet-content">\
									<div class="stream-item-header">\
										<a class="account-group" href="' + obj.user.statusnet_profile_url + '" data-user-id="' + obj.user.id + '">\
											<img class="avatar profile-size" src="' + obj.user.profile_image_url_profile_size + '" data-user-id="' + obj.user.id + '" />\
											<strong class="name" data-user-id="' + obj.user.id + '">' + obj.user.name + '</strong> \
											<span class="screen-name" data-user-id="' + obj.user.id + '">@' + obj.user.screen_name + '</span>' +
										'</a>' +
										'<i class="addressees">' + reply_to_html + in_groups_html + '</i>' +
										'<small class="created-at" data-created-at="' + obj.created_at + '">\
											<a data-tooltip="' + parseTwitterLongDate(obj.created_at) + '" href="' + window.siteInstanceURL + 'notice/' + obj.id + '">' + queetTime + '</a>\
										</small>\
									</div>\
									<div class="queet-text">' + $.trim(obj.statusnet_html) + '</div>\
									' + buildAttachmentHTML(obj.attachments) + '\
									<div class="stream-item-footer">\
										' + queetActions + '\
									</div>\
								</div>\
							</div>\
						</div>';

	// detect rtl
	queetHtml = detectRTL(queetHtml);

	return queetHtml;
	}




/* ·
   ·
   ·   Build HTML for the attachments to a queet
   ·
   ·   @param attachments: attachment object returned by the api
   ·
   · · · · · · · · · · · · · */

function buildAttachmentHTML(attachments){
	var attachment_html = '';
	var attachmentNum = 0;
	if(typeof attachments != "undefined") {
		$.each(attachments, function(){
			if(typeof this.thumb_url != 'undefined'
			&& this.thumb_url !== null
			&& isLocalURL(this.thumb_url)) { // if there's a local thumb_url we assume this is a image or video
				var bigThumbW = 1000;
				var bigThumbH = 3000;
				if(bigThumbW > window.siteMaxThumbnailSize) {
					bigThumbW = window.siteMaxThumbnailSize;
					}
				if(bigThumbH > window.siteMaxThumbnailSize) {
					bigThumbH = window.siteMaxThumbnailSize;
					}

				// very long landscape images should not have background-size:cover
				var noCoverClass='';
				if(this.width/this.height > 2) {
					noCoverClass=' no-cover';
					}

				// play button for videos and animated gifs
				var playButtonClass = '';
				if((this.url.indexOf('://www.youtube.com') > -1 || this.url.indexOf('://youtu.be') > -1)
				|| (typeof this.animated != 'undefined' && this.animated === true)) {
					var playButtonClass = ' play-button';
					}

				// youtube class
				var youTubeClass = '';
				if(this.url.indexOf('://www.youtube.com') > -1 || this.url.indexOf('://youtu.be') > -1) {
					youTubeClass = ' youtube';
					}


				// animated gifs always get default small non-animated thumbnail
				if(this.animated === true) {
					var img_url = this.thumb_url;
					}
				// if no dimensions are set, go with default thumb
				else if(this.width === null && this.height === null) {
					var img_url = this.thumb_url;
					}
				// large images get large thumbnail
				else if(this.width > 1000) {
					var img_url = this.large_thumb_url;
					}
				// no thumbnails for small images
				else {
					var img_url = this.url;
					}

				attachment_html = attachment_html + '<a style="background-image:url(\'' + img_url + '\')" class="thumb-container' + noCoverClass + playButtonClass + youTubeClass + '" href="' + this.url + '"><img class="attachment-thumb" data-mime-type="' + this.mimetype + '" src="' + img_url + '"/ data-width="' + this.width + '" data-height="' + this.height + '" data-full-image-url="' + this.url + '" data-thumb-url="' + img_url + '"></a>';
				attachmentNum++;
				}
			else if (this.mimetype == 'image/svg+xml') {
				attachment_html = attachment_html + '<a style="background-image:url(\'' + this.url + '\')" class="thumb-container" href="' + this.url + '"><img class="attachment-thumb" data-mime-type="' + this.mimetype + '" src="' + this.url + '"/></a>';
				attachmentNum++;
				}
			});
		}
	return '<div class="queet-thumbs thumb-num-' + attachmentNum + '">' + attachment_html + '</div>';
	}
