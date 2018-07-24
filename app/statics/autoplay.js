//全局var
var is_start = false;
var is_afternoon = false;
var vol = 1;

//loading
var loading = weui.loading('拼命加载中');

//初始化播放器
var ap = new APlayer({
	element: document.getElementById('aplayer'),
	listFolded: false,
	listMaxHeight: '600px',
	theme: '#1aad19',
	volume: 1,
	mode: "random"
});

//定义默认歌单id，从设置的localStorage获取
var listid = localStorage.getItem('playlistid') ? localStorage.getItem('playlistid') : '912256078';

//加载网易云api
var baseurl = 'https://api.imjad.cn/cloudmusic/?type=playlist&id=';
var neteaseurl = 'https://music.163.com/song/media/outer/url?id=';
axios.get(baseurl + listid)
	.then(function (response) {
		checkResponse(response);
		var alltracks = response.data.playlist.tracks;
		var info
		if (response.data.playlist.creator) {
			info = '<span>歌单:' + response.data.playlist.name + '</span>' + '<span>数量:' + response.data.playlist.trackCount + '</span>' + '<span>创建:' + response.data.playlist.creator.nickname;
		} else {
			info = '<span>歌单:' + response.data.playlist.name + '</span>' + '<span>数量:' + response.data.playlist.trackCount + '</span>' + '<span>创建:佚名';
		}
		document.getElementById("showinfo").innerHTML = info;
		var songs = alltracks.map(function (item) {
			return {
				title: item.name,
				author: item.ar[0].name,
				pic: item.al.picUrl,
				url: neteaseurl + item.id + '.mp3'
			}
		})
		ap.list.add(songs);
		playtime(songs.length);

		loading.hide();
		weui.topTips('为小哥哥姐姐加载了' + songs.length + '首歌', {
			duration: 2000,
			className: 'greenbg'
		});
	})

//nodejs corn
var cronJob = require('cron').CronJob;

// 错误检查
function checkResponse(response) {
	if (response.data.code !== 200) {
		loading.hide();
		return
	}
}
//音乐播放
function mplay(num) {
	if (is_start == false) {

		var rand = Math.floor(Math.random() * num + 1);
		ap.volume(1, true);
		ap.list.switch(rand);
		ap.play();
		is_start = true;
		vol = 1;
		console.log('play');
		weui.toast('第' + (rand + 1) + '首歌曲播', 3500);

	}
}

//音乐淡出并暂停
function mpause() {
	if (is_start == true) {
		var mfade = new cronJob({
			cronTime: '*/3 * * * * *',
			onTick: function () {
				if (vol <= 0.1) {
					ap.pause();
					console.log('pause');
					weui.toast('音乐结束', 3000);
					mfade.stop(); //定时器结束
				} else {
					vol = vol - 0.1;
					ap.volume(Math.floor(vol * 10) / 10, true);
				}
			},
			start: true,
			timeZone: 'Asia/Chongqing'
		});
		is_start = false;
	}
}

//时间定义
function playtime(num) {

	var t0_play = new cronJob({
		cronTime: '* 0-57 8 * * *',
		onTick: function () {
			mplay(num);
		},
		onComplete: mpause,
		start: true,
		timeZone: 'Asia/Chongqing'
	});

	var t0_pause = new cronJob({
		cronTime: '0 58 8 * * *',
		onTick: function () {
			t0_play.stop();
		},
		start: true,
		timeZone: 'Asia/Chongqing'
	});


	var t1_play = new cronJob({
		cronTime: '* 28-32 13 * * *',
		onTick: function () {
			mplay(num);
		},
		onComplete: mpause,
		start: true,
		timeZone: 'Asia/Chongqing'
	});

	var t1_pause = new cronJob({
		cronTime: '0 33 13 * * *',
		onTick: function () {
			t1_play.stop();
		},
		start: true,
		timeZone: 'Asia/Chongqing'
	});

	var t2_play = new cronJob({
		cronTime: '* 27-43 15 * * 1,3,5',
		onTick: function () {
			mplay(num);
		},
		onComplete: mpause,
		start: true,
		timeZone: 'Asia/Chongqing'
	});

	var t2_pause = new cronJob({
		cronTime: '0 44 15 * * 1,3,5',
		onTick: function () {
			t2_play.stop();
		},
		start: true,
		timeZone: 'Asia/Chongqing'
	});
}
