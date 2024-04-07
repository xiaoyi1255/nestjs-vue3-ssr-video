<template>
  <div class="container">
    <!-- 控制整个屏幕的视频播放、暂停 -->
    <div class="video-box" @click="changePlay(3)" @dblclick="changeCollect" @dragstart="dragstart"></div>
    <div :style="videoStyle[1]" ref="videoBox" :id="'video-'+ item.videoBaseInfo.contentId">
      <!-- <video :class="`video-item video-js vjs-big-play-centered vjs-fluid ${markChange}`" :id="'video-' + props.index"
        :style="videoStyle[0]" ref="videRef"
        :poster="item.videoBaseInfo.cover">
        <p>Your browser does not support the video tag.</p>
      </video> -->
    </div>

    <!-- 右侧边栏 -->
    <div class="like-warpper">
      <Like :item="item" :videoInfo="videoInfo" @changeCollect="changeCollect" @changeFollow="changeFollow" />
    </div>

    <!-- 播放暂停按钮 -->
    <div v-if="['pause', 'canplay', 'ended'].includes(player.status)">
      <div class="play-btn bg" @click="changePlay(1)"></div>
    </div>

    <!-- 底部信息 -->
    <div class="bottom-info">
      <div class="info-left" @click="goMePage">
        <div class="author overflowEllipsis">@{{ item?.videoBaseInfo?.title || '---' }}</div>
        <div class="title lines-ellipsis-2">{{ item.videoBaseInfo.description }}</div>
      </div>
    </div>
    <!-- 进度条 -->
    <div v-show="player.status !== 'playing' && percentage" class="progress" @click.capture="changePercentage">
      <Progress :percentage="percentage" stroke-width="2" :pivot-text="' '" color="rgb(255, 255, 255)" />
    </div>
    <!-- <img class="muted" @click="changeMuted" v-if="isMuted" src="@/assets/images/video/svg/muted.svg" /> -->
  </div>
</template>
<script setup lang="ts">
import videojs from 'video.js'
import Like from './like.vue'
import { Progress, Toast } from "vant";
import { useStore } from 'vuex';
import { ref, defineProps, onMounted, reactive, nextTick, defineExpose, onUnmounted, defineEmits, computed } from "vue";
// import { FollowApi } from '@/api/follow';
// import { VideoApi } from '@/api/video';
import { useRouter } from 'vue-router'
import { _setInterval } from "@/utils/common/index";



const props = defineProps<{
  index: number,
  cureentIndex: number,
  item: {
    "videoAuthorInfo": {
      "authorUid": 0,
      "avatar": "",
      followFlag: false
    },
    "videoBaseInfo": {
      "contentId": 0,
      "cover": "",
      "description": "",
      "title": "",
      "videoUrl": ""
    },
    "videoStatisticsInfo": {
      "comments": 0,
      "likes": 0
    }
  },
  isMuted: Boolean
}>()
const emit = defineEmits(['changeMuted', 'getPlays', 'handleNext'])
import { registVideoStorage } from '../hooks/useVideo'
import { watch } from 'vue';

const router = useRouter()
const store = useStore()
const videoInfo = reactive({
  collected: props.item.videoAuthorInfo.followFlag || false, // 点赞
  followed: props.item.videoAuthorInfo.followFlag, // 关注
  collects: computed(() => props.item.videoStatisticsInfo?.likes || 0), // 收藏数
  comments: computed(() => props.item.videoStatisticsInfo?.comments || 0), // 评论数
  shareUrl: location.href,
  avatar: computed(() => props.item.videoAuthorInfo?.avatar || ''),
  authorUid: computed(() => props.item.videoAuthorInfo?.authorUid || 0),
})
const videRef = ref<HTMLVideoElement | null>(null)
const videoBox = ref<HTMLDivElement | null>(null)
const player: any = reactive({
  instance: null,
  status: 'pause',
  totalTime: 0,
  cureentTime: 0,
})
const percentage = ref(0)

let isCount = false
let progress80 = false
const goMePage = () => {
  router.push({
    path: '/me',
    query: { uid: props.item?.videoAuthorInfo.authorUid, isOther: 1 }
  })
}
let canPlay = false
let isError = false
let isWaiting = true
let percentageObj = {
  percentageTime: -1, // 播放进度计数
  stop: () => {},
  isPause: false,
}

let markChange = ref('needChange');

console.log("props.item", props.item);

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

// 初始化播放器
const initVideo = () => {
  console.log("initVideo");
  const id = `video-${props.index}-${props.item.videoBaseInfo.contentId}`;
  if (!player.instance) { // 播放器被销毁过
    console.log("播放器被销毁过", "重新创建", videojs);
    const innerHTML = `
    <video class=video-item video-js vjs-big-play-centered vjs-fluid ${markChange.value} id=${id} 
      style="width:${videoStyle.value[0].width};height:${videoStyle.value[0].height || '100vh'};"
      poster=${props.item.videoBaseInfo.cover}>
      <p>Your browser does not support the video tag.</p>
    </video>
    `
    videoBox.value && (videoBox.value.innerHTML = innerHTML)
  }

  const videoOptions = {
    controls: false, // 是否显示控制条
    autoplay: false,// props.index === 1
    // preload: 'auto',
    // muted: props.isMuted,
    muted: false,
    loop: true,
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
      src: props.item.videoBaseInfo.videoUrl,
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
  nextTick(() => {
    player.instance = videojs(document.getElementById(id), videoOptions, function onPlay() {
      this.on('ended', function () {
        console.log('播放结束了')
        player.status = 'ended'
      })
      this.on('loadedmetadata', function () {
        player.totalTime = this.duration()
      })
      this.on('play', function () {
        if (canPlay) {
          Toast.clear()
        }
        if (isError) {
          emit('handleNext')
        }
        if (props.index===1) {
          sessionStorage.setItem('playingVideo', JSON.stringify(props.item))
        }
      })
      this.on('timeupdate', function () { // 缓冲进度
        percentage.value = (this.currentTime() / player.totalTime) * 100
        const videoId = props.item?.videoBaseInfo?.contentId || ''
        store.commit('indexStore/setComData', {key: 'palyingInfo', value: {videoId, playTime: (percentage.value || 0) * 5}})
        if (!isCount && percentage.value >= 20) {
          registVideoStorage().updateLocalVideoInfo(props.item?.videoBaseInfo)
          emit('getPlays')
          isCount = true
        }
        if (!progress80 && percentage.value >= 80) {
          progress80 = true
        }
        store.commit('indexStore/setPlayProgress', percentage.value)
      })
      this.on('canplay', function () {
        player.status = 'canplay'
        if (!canPlay) {
        }
        canPlay= true
      })
      this.on('playing', function () {
        console.log('正在播放')
        player.status = 'playing'
        isError = false
        Toast.clear()
        sessionStorage.setItem('playingVideo', JSON.stringify(props.item))
        store.commit('videoStore/setPlayIndex', props.index - 1)
      })
      this.on('pause', function () {
        player.status = 'pause'
        percentageObj.isPause = true
        if (isWaiting) {
        }
        if (isError) {
        }
      })
      this.on('waiting', function () {
        console.log('等待数据，播放器处于缓冲过程中')
        isWaiting = false
        if (!canPlay) {
          Toast.loading('')
          isWaiting = true
        }
      })
      this.on('error', function () {
        isError = true
        const remarks = {
          videoId: props.item?.videoBaseInfo?.videoUrl,
          code: this.error()?.code,
          msg: this.error()?.message
        }
        console.log('播放错误', remarks)
      })
    })
  })
}

// 播放、暂停
let timer: number = 0;
let clickPlayCount = 0
const changePlay = (type: number) => {
  clearTimeout(timer)
  timer = setTimeout(() => {
    if (player?.instance?.paused()) {
      player.instance?.play()
    } else {
      player.instance?.pause()
    }
    clickPlayCount++
  }, 100)
}

// 点击进度条 跳转到指定位置
const changePercentage = (event: Event) => {
  const clickX = event.clientX;
  // 获取屏幕宽度
  const screenWidth = window.innerWidth || document.documentElement.clientWidth;
  const ratio = clickX / screenWidth;
  console.log('ratio', ratio)
  percentage.value = ratio * 100 // 设置视频播放的百分比
  player.instance?.currentTime(ratio * player.instance?.duration()); // 设置视频播放的百分比
}

// 解除静音
const changeMuted = () => {
  emit('changeMuted', false)
  player.instance?.muted(false) // 设置视频播放的百分比
}

// 收藏、取消收藏
const changeCollect = async() => {
  // clearTimeout(timer)
  Toast.loading('')
  let params = {
    uid: sessionStorage.getItem('uid') || '',
    type: videoInfo.collected ? 'VIDEO_DIS_LIKE' : 'VIDEO_LIKE',
    contentId: props.item.videoBaseInfo.contentId || '',
  }
  videoInfo.collected = !videoInfo.collected
  // const videoIds = JSON.parse(localStorage.getItem('videoIds') || '[]') || []
  // const idx = videoIds.findIndex((item: number) => item === +props.item.videoBaseInfo.contentId) // 判断是否已经收藏过
  // if (videoInfo.collected) {
  //   if (idx === -1) {
  //     videoIds.push(props.item.videoBaseInfo.contentId)
  //     localStorage.setItem('videoIds', JSON.stringify(videoIds))
  //   }
  // } else {
  //   console.log('取消收藏', idx)
  //   if (idx !== -1) {
  //     videoIds.splice(idx, 1)
  //     localStorage.setItem('videoIds', JSON.stringify(videoIds))
  //   }
  // }
  // to do 调接口
  try {
  } catch (error) {
    Toast.clear()
  }
}


// 关注、取消关注 
const changeFollow = (status: number) => {
  const uid = sessionStorage.getItem('uid') || 0
  Toast.loading({
    message: 'Loading...',
    forbidClick: true,
  })
}

const dragstart = () => {
  console.log('拖拽开始')
}

watch(() => props.cureentIndex, (val) =>{
  clickPlayCount = 0
  // if (!player.instance && props.index>2 && val+2 === props.index) {
  //   initVideo()
  // }
})
onUnmounted(() => {

})

defineExpose({
  changePlay,
  player,
  initVideo
})

Toast.loading('loading...')
onMounted(() => {
  try {
    nextTick(() => {
      props.index<3 && initVideo()
    })
    // const videoIds = JSON.parse(localStorage.getItem('videoIds') || '[]') || []
    // if (videoIds?.includes(props.item?.videoBaseInfo?.contentId)) {
    //   videoInfo.collected = true
    // }
  } catch (error) {
    console.log(error)
  }
})
</script>

<style lang="less" scoped>
.container {
  // background-color: #474747;
  position: relative;
  height: 100vh;
  max-width: 450px;
  margin: 0 auto;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;

  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 2.55rem;
    top: 0;
    left: 0;
    display: block;
    background: linear-gradient(179.23deg, rgba(0, 0, 0, 0.3) 0.91%, rgba(0, 0, 0, 0) 99.58%);

  }

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 2.55rem;
    bottom: 0;
    left: 0;
    display: block;
    background: linear-gradient(359.23deg, rgba(0, 0, 0, 0.3) 0.91%, rgba(0, 0, 0, 0) 99.58%);

  }


  .video-box {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 3;
  }

  .like-warpper {
    position: absolute;
    right: 0.1rem;
    bottom: 0.7rem;
    z-index: 99;
  }

  .play-btn {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 99;
    width: 0.81rem;
    height: 0.81rem;
    background-image: url('@/assets/images/video/svg/play.svg');
  }

  .progress {
    position: absolute;
    bottom: 0.01rem;
    left: 0;
    z-index: 9999;
    width: 100vw;
    padding: .1rem 3vw 0;
    box-sizing: border-box;

    ::v-deep .van-progress {
      background: rgba(255, 255, 255, 0.15);
    }

    ::v-deep .van-progress__pivot {
      min-width: 7px;
      min-height: 7px;
      padding: 0;
      border-radius: 50%;
    }
  }

  .bottom-info {
    position: absolute;
    bottom: 0.1rem;
    left: 0.12rem;
    z-index: 9;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    color: #fff;

    .author {
      font-size: 0.16rem;
      font-weight: 700;
      margin-bottom: 0.06rem;
      max-width: 20vh;
    }

    .title {
      font-size: 0.14rem;
      font-weight: 400;
      max-width: 65vw;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box; //作为弹性伸缩盒子模型显示。
      -webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
      -webkit-line-clamp: 1; //显示的行
    }
  }

  .muted {
    position: absolute;
    right: 0.1rem;
    top: 0.08rem;
    z-index: 9999;
    border-radius: .15rem;
  }
}

.video-item {
  width: 100%;
  // height: 100vh;
  object-fit: contain;
  outline: none;
  border: none;
  background-color: transparent;
  cursor: not-allowed;
}
</style>

<style lang="less">
@import './videojs.less';

.xxx {
  position: absolute;
}
</style>