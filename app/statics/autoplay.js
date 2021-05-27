//全局var
var is_start = false;
var is_afternoon = false;
var vol = 1;

//loading
var loading = weui.loading('拼命加载中');

//nodejs corn
var CronJob = require('cron').CronJob;

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
    var mfade = new CronJob({
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

//定义开始和结束时间
function playtime(num) {

  var t0_play = new CronJob({
    cronTime: '* 0-57 8 * * *',
    onTick: function () {
      mplay(num);
    },
    onComplete: mpause,
    start: true,
    timeZone: 'Asia/Chongqing'
  });

  var t0_pause = new CronJob({
    cronTime: '0 58 8 * * *',
    onTick: function () {
      t0_play.stop();
    },
    start: true,
    timeZone: 'Asia/Chongqing'
  });


  var t1_play = new CronJob({
    cronTime: '* 29-30 13 * * *',
    onTick: function () {
      mplay(num);
    },
    onComplete: mpause,
    start: true,
    timeZone: 'Asia/Chongqing'
  });

  var t1_pause = new CronJob({
    cronTime: '0 32 13 * * *',
    onTick: function () {
      t1_play.stop();
    },
    start: true,
    timeZone: 'Asia/Chongqing'
  });

}


//初始化播放器
var ap = new APlayer({
  container: document.getElementById('aplayer'),
  listFolded: false,
  listMaxHeight: '580px',
  theme: '#1aad19',
  order: 'random',
  volume: 1
});

//返回数据错误检查
function checkResponse(response) {
  if (response.data.code !== 200) {
    loading.hide();
    return
  }
}

//定义默认歌单id，从设置的localStorage获取
var listid = localStorage.getItem('playlistid') ? localStorage.getItem('playlistid') : '2483134673'; //912256078

//加载网易云音乐api并且执行播放func
var baseurl = 'http://www.hjmin.com/'; //网络寻找的网易云api
var listurl = baseurl + 'playlist/detail?id=';
var infourl = baseurl + 'song/detail?ids=';
var mp3url = 'https://music.163.com/song/media/outer/url?id=';


axios.get(listurl + listid)
  .then(function (response) {

    checkResponse(response);

    //获取歌单信息并且显示
    var info
    if (response.data.playlist.creator) {
      info = '<span>歌单:' + response.data.playlist.name + '</span>' + '<span>数量:' + response.data.playlist.trackCount + '</span>' + '<span>创建:' + response.data.playlist.creator.nickname;
    } else {
      info = '<span>歌单:' + response.data.playlist.name + '</span>' + '<span>数量:' + response.data.playlist.trackCount + '</span>' + '<span>创建:佚名';
    }
    document.getElementById("showinfo").innerHTML = info;


    //获取歌单中的歌曲id，playlist默认只展示10首歌曲
    var songs_ids = response.data.playlist.trackIds;

    //根据歌单的歌曲id获取歌曲详细
    var songs_detail = songs_ids.map((item) => {
      return axios.get(infourl + item.id).then(function (response) {
        return response.data;
      });
    })
    //console.log(songs_detail);

    //根据歌曲详细重组歌曲数组添加到播放器
    Promise.all(songs_detail).then((data) => {
      console.log(data);
      var songs = data.map((item) => {
        return {
          title: item.songs[0].name,
          author: item.songs[0].ar[0].name,
          pic: item.songs[0].al.picUrl,
          url: mp3url + item.songs[0].id + '.mp3'
        }
      })

      //添加歌曲到播放器
      ap.list.add(songs);

      playtime(songs.length);

      loading.hide();

      weui.topTips('加载了' + songs.length + '首歌', {
        duration: 2000,
        className: 'greenbg'
      });

    })

  })
