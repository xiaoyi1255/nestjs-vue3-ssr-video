<template>
  <div class="videos" >
    <van-swipe ref="swiperRef" style="width: 100%;height: 100vh;" :initial-swipe="0"
      @change="changeVideo" :loop="false" vertical :show-indicators="false" :lazy-render="false">
      <van-swipe-item v-for="(item, index) in videoList" :key="item.videoBaseInfo?.contentId||`${item?.requestId}${index}`">
        <div>
          <VideoItem ref="videoItemRef" :index="index + 1" :item="list[index]" :isMuted="isMuted" :cureentIndex="cureentIndex" @handleNext="handleNext" />
        </div>
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, getCurrentInstance, onUnmounted, watch, computed, defineEmits } from 'vue';
import { Toast } from 'vant';
import VideoItem from './components/videoItem.vue';
import { useStore } from 'vuex';

const emit = defineEmits(['getVideoList', 'showUserIcon'])
const { proxy } = getCurrentInstance()

const store = useStore()
const videoList = ref<any>([])
const isMuted = ref(true)
const swiperRef = ref(null)

const list:any = computed(()=> store.state.indexStore.videoList || [])

const handleNext = () => {
  swiperRef.value?.next();
}

// 切换上、下视频， 播放当前，暂停 上、下
let cureentIndex = ref(0)
let videoIdx = 0
const changeVideo = (index: number) => {
  cureentIndex.value = index;
  if (videoList.value.length - 3 === index) {
    onLoad()
  }
  const player = proxy.$refs.videoItemRef[videoIdx]?.player?.instance
  const player1 = proxy.$refs.videoItemRef[videoIdx - 1]?.player?.instance
  const player2 = proxy.$refs.videoItemRef[videoIdx + 1]?.player?.instance
  player1?.pause()
  player2?.pause()
  player?.play()
}

const visibilityFn = () => {
  const player = proxy.$refs.videoItemRef[cureentIndex.value]?.player?.instance
  if (document.visibilityState === 'visible') {
    // player?.play()
  } else {
    player?.pause()
  }
}

onMounted(() => {
  onLoad()
  document.addEventListener('visibilitychange', visibilityFn)
})
onUnmounted(() => {
  document.removeEventListener('visibilitychange', visibilityFn)
})

// 拉取视频列表
let i = 0
const onLoad = async () => {
  try {
    i === 0 && Toast.loading({ message: 'loading...', forbidClick: true })
    const data = list.value.slice(i * 5, (i + 1) * 5)
    // console.log("");
    videoList.value = videoList.value.concat(data)
    Toast.clear()
    console.log('no more', i, (i+1) *5 , list.value.length)
    if ((i+1) *5 > list.value.length || list.value.length <= 4) {
      emit('getVideoList', {})
    }
    i++
  } catch (err) {
    console.log("error")
    Toast.clear()
  }
}


</script>

<style lang="less" scoped>
.videos {
  font-size: 0.14rem;
  height: 100%;
  // overflow-y: auto;
  // scroll-snap-type: y mandatory;

  &-item {
    // scroll-snap-align: start;
    // scroll-snap-stop: always;
  }
}

.videos::-webkit-scrollbar {
  width: 0;
}
.operate {
  display: none;
}
@media (max-width: 600px) {
  .operate {
    display: block;
  }
}


</style>
