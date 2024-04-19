#### 1. m3u8视频 解析播放（videojs）
```ts

<video class="video-item video-js vjs-big-play-centered vjs-fluid" :id="'video-' + props.index" ref="videRef"
      :video-id="'video-' + item.video_id" :poster="item.cover" >
      <p>Your browser does not support the video tag.</p>
    </video>

import videojs from 'video.js';

// 初始化播放器
const initVideo = () => {
  const videoOptions = {
    controls: false, // 是否显示控制条
    autoplay: false,// props.index === 1
    preload: 'auto',
    muted: props.isMuted,
    loop: false,
    fluid: true,
    controlBar: { // 设置控制条组件
      //  设置控制条里面组件的相关属性及显示与否
      // currentTimeDisplay: true,
      // timeDivider: true,
      // durationDisplay: true,
      // remainingTimeDisplay: false,
      // volumePanel: {
      //   inline: false,
      // },
      // pictureInPictureToggle: false,
      // 或者使用 children 定义
      /* 使用children的形式可以控制每一个控件的位置，以及显示与否 */
      children: [
        // { name: 'playToggle' }, // 播放按钮
        { name: 'currentTimeDisplay' }, // 当前已播放时间
        { name: 'progressControl' }, // 播放进度条
        { name: 'durationDisplay' }, // 总时间
        // {
        //   name: 'volumePanel', // 音量控制
        //   inline: true, // 不使用水平方式
        // },
        // { name: 'FullscreenToggle' }, // 全屏
      ],
    },
    sources: [{
      // src: 'http://recordcdn.quklive.com/upload/vod/user1462960877450854/1550739580345725/1/video.m3u8',
      src: props.item.m3u8_url,
      // type: 'application/x-mpegURL'
    }],
    bigPlayButton: false, // 播放按钮
    userActions: {
      click: false, // 禁止点击
      // download: false, // 禁止下载
      // hotkeys: false, // 禁止热键
      doubleClick: true // 禁止双击
    }
  }
  player.instance = videojs(videRef.value!, videoOptions, function onPlay() {
    // videojs.log('播放器创建了');
    this.on('ended', function () {
      console.log('播放结束了')
      player.status = 'ended'
    })
    this.on('error', function (error) {
      console.log('播放出错了', error)
    })
    this.on('loadedmetadata', function () {
      // console.log('加载元数据')
      player.totalTime = this.duration()
    })
    this.on('play', function(){
      Toast.clear()
    })
    // this.on('loadeddata', function(){
    //   console.log('加载数据')
    // })
    // this.on('progress', function(event) { // 缓冲进度
    //     console.log(event, '缓冲进度');
    // })
    this.on('timeupdate', function () { // 缓冲进度
      // player.currentTime = this.currentTime()
      percentage.value = (this.currentTime() / player.totalTime) * 100
    })
    this.on('canplay', function () {
      player.status = 'canplay'
      if (props.index === 1) {
        this.play().then(res => {
          console.log('播放成功', res)
        }).catch(err => {
          console.log('播放失败', err)
          alert('自动播放失败，请点击按钮进行播放！')
        })
      }
    })
    // this.on('canplaythrough', function(){
    //   console.log('可以播放，缓冲足够播放完')
    // })
    // this.on('play', function(){
    //   console.log('开始播放')
    // })
    this.on('playing', function () {
      console.log('正在播放')
      player.status = 'playing'
    })
    this.on('pause', function () {
      console.log('暂停播放')
      player.status = 'pause'
    })
  })
}

```

#### 2. 上下滑动切换视频
   1） 监听滚动事件，来切换（不好）
   2）css 的吸附属性 (需要配合IntersectionObserver使用，才能自动播放下一个视频)
   ```css
    .videos {
      font-size: 0.14rem;
      height: 100%;
      overflow-y: auto;
      scroll-snap-type: y mandatory;

      &-item {
        scroll-snap-align: start;
        scroll-snap-stop: always;
      }
    }
   ```
   3) 轮播图
   ```ts
   <van-swipe ref="swiperRef" style="width: 100%;height: 100%; background-color: black;" :initial-swipe="0"
      @change="changeVideo" :loop="false" vertical :show-indicators="false" :lazy-render="false">
      <van-swipe-item v-for="(item, index) in videoList" :key="index">
        <VideoItem ref="videoItemRef" :index="index + 1" :item="item" @changeMuted="changeMuted" :isMuted="isMuted" />
      </van-swipe-item>
    </van-swipe>

    ```
#### 3.  单击播放暂停、双击点赞
   1） 单击播放暂停（发现video绑定的click事件有问题），然后使用了一个空元素透明的，代替其点击事件
   2） 双击点赞（双击的时候会触发单击事件）使用了setTimeOut来处理
   ```ts
   <div class="video-item" @click="clickVideo" @dblclick="dblclickVideo">

   let timer =0
   function clickVideo() {
     clearTimeout(timer)
     timer = setTimeout(() => {
       console.log('单击')
     }, 300)
   }

   function dblclickVideo() {
     clearTimeout(timer)
     console.log('双击')
   }
   ```
   3） 播放暂停
   ```ts
   <video ref="videoRef" :src="item.url" :poster="item.poster" :muted="isMuted" @click="clickVideo" @dblclick="dblclickVideo"
   ```
#### 4. 视频自动播放（静音播放-因为浏览器限制）
   1） 轮播图切换会有change事件，触发时，播放当前视频，暂停上一个、下一个视频（因为不知道是上滑还是下滑）
   2）视频元素绑定ref, 通过$refs来操作
#### 5. 静音问题：设置一个解除静音按钮，解除后所有视频有声播放
#### 6. 切后台问题：监听页面是否可见来进行播放和暂停
#### 7. 性能问题
      1）一次加载几个视频（做个分页）
      2）视频列表最多渲染多少条
      vue是数据驱动页面，所以无论返回了多少条数据，只最多动态渲染20个视频（维护一个showVideo数组，类似滑动窗口）

#### 8.vue组件和name名一致，导致死循环内存溢出
20240222，排查了半小时，，我能怎么办，，诶
![alt text](ee6ca3d5120039178526f357c34720d.png)

1. publisher （2天）
2. 视频流 （17天） 
  基础功能5天：
  个人页他人页：2天
  提现：提现页、提现记录、提现弹窗：3天
  关注人、粉丝列表页：1天
  弹窗+动效：新手礼包、运营位宝箱弹窗、视频中宝箱弹窗、左下角弹窗、每日签到 3天
接口接入+联调：3天


排期：

#### 9. npm淘宝镜像证书过期

```sh
# 1. 清空缓存
npm cache clean --force

# 2. 切换源
npm config set registry https://registry.npmmirror.com


# 3. 检测是否切换成功
npm config get registry

# 如果使用了nvm nodejs版本管理工具，需要重新设置npm的源
# 1. 先找到 nvm 安装路径下的 settings.txt
# 2. 添加 改变源地址即可

node_mirror: https://npmmirror.com/mirrors/node/
npm_mirror: https://npmmirror.com/mirrors/npm/
```
#### 10. setTimeout 模拟setInterval 实现倒计时5秒算有效播放
```js
export const _setInterval = (callback, delay) => {
  let timerId;

  function interval() {
    callback();
    timerId = setTimeout(interval, delay);
  }

  timerId = setTimeout(interval, delay);

  return {
    stop: function() {
      clearTimeout(timerId);
    }
  };
}
```
#### 11. 视频撑满屏幕
实现思路：宽度其实完全撑满的，就是高度没撑满。
需要考虑的点：
1. 视频比例
2. 只对竖屏视频做处理，宽屏视频不做处理
3. 视频最终的宽度 => 假设视频高刚好撑满屏幕 => 视频宽度 === 屏幕高 * 视频宽高比
4. 最终视频的宽度必然大于屏幕宽度，所以需要对视频盒子进行定位以实现居中、还有超出隐藏
```vue
<template>
<div :style="videoStyle[1]">
  <video :style="videoStyle[0]">
    <p>Your browser does not support the video tag.</p>
  </video>
</div>
</template>
```
```js

const videoStyle = computed(() => {
  const { videoWidth, videoHeight } = props.item.videoBaseInfo;
  const deviceHeight = window.innerHeight;

  const videoAspectRatio = videoWidth / videoHeight;
  // 获取设备屏幕高度，用于计算视频的最终宽度
  
  // 宽视频不处理
  if(videoAspectRatio > 1){
    return [{},{height: '100vh', width: '100vw'}];
  }

  const finalWidth = deviceHeight * videoAspectRatio;
  // 获取设备屏幕宽度，用于后续判断是否需要进行水平平移
  const deviceWidth = window.innerWidth;
  // 计算视频元素的左边距，以实现居中
  const left = finalWidth > deviceWidth ? -(finalWidth - deviceWidth) / 2 : 0;

  // 返回应用于视频的样式对象
  return [
    {
      // 
      width: `${finalWidth}px`,
      height: '100vh',
    },
    {
      position: 'absolute',
      width: `${finalWidth}px`,
      height: '100vh',
      left: `${left}px`,
    }
  ];
});
```

#### 12. 视频播放器、dom过多导致卡顿问题
问题描述： 视频刷到40个左右就会卡顿，甚至闪退 （在电脑上勉强撑到70来个，webview中就只有40来个）
原因分析： dom