<template>
  <div class="utils">
    <div class="item" :img="props.videoInfo?.avatar">
      <van-image class="avatar" round width="0.48rem" height="0.48rem" @click="goMePage" :src="item.videoAuthorInfo.avatar || avatarImg" alt="" />
      <div style="height: 0.2rem;">
        <img class="follow" v-show="!videoInfo.followed"  @click="changeFollow(0)" src="./svg/guanzhu.svg" alt="">
      </div>
    </div>
    <div class="item" @click="changeLike">
      <img v-show="collected" src="./svg/like.svg" alt="">
      <img v-show='!collected' src="./svg/no-like.svg" alt="">
      {{ collects || 0 }}
    </div>
    <div class="item" @click="showCommentPop">
      <img src="./svg/comments.svg" alt="">
      {{ comments || 0 }}
    </div>
    <div class="" @click="copyTxt(videoInfo.shareUrl)">
      <img src="./svg/share.svg" alt="">
      <!-- {{ share || 0 }} -->
    </div>
  </div>
</template>
<script lang="ts" setup>
import { defineProps, defineEmits, computed, getCurrentInstance } from 'vue'
import { Toast } from 'vant'
import { useRouter } from 'vue-router'
import avatarImg from "@/assets/images/avatar.png";
import { useStore } from 'vuex';
import { watch } from 'vue';
const { proxy } = getCurrentInstance()

const props = defineProps<{
  videoInfo: {
    collected: boolean,
    followed: boolean,
    collects: number,
    comments: number,
    share: number,
    shareUrl: string,
    avatar: string,
    authorUid: number,
  },
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
  }
}>()

const emit = defineEmits(['changeCollect', 'changeFollow'])
const router = useRouter()
const store = useStore()

const collected = computed(() => props.videoInfo.collected)
const collects = computed(() => formatNumber(collected.value ? props.videoInfo.collects +1 : props.videoInfo.collects))
const comments = computed(() => formatNumber(props.item.videoStatisticsInfo.comments || 0))

const showCommentPop = () =>{
  store.commit("indexStore/setComData", { key: 'showCommentPop', value: true })
  store.commit("indexStore/setComData", { key: 'showCommentData', value: {contentId: props.item.videoBaseInfo.contentId, comments: props.item.videoStatisticsInfo.comments} })

}

function formatNumber(number: number) {
  if (number < 1000) {
    return number.toString();
  } else if (number < 1000000) {
    return (number / 1000).toFixed(1) + 'K';
  } else {
    return (number / 1000000).toFixed(1) + 'W';
  }
}
const changeLike = () => {
  emit('changeCollect')
}

const copyTxt = (val: string) => {
  const input = document.createElement("input");
  document.body.appendChild(input);
  input.setAttribute("value", val);
  input.focus();
  input.select();
  document.execCommand("copy");
  document.body.removeChild(input);
  Toast(proxy.$t('link copied'))
}

const changeFollow = (status: 0 | 1) => {
  emit('changeFollow', status)
}

const goMePage = () => {
  router.push({
    path: '/me',
    query: { uid: props.videoInfo.authorUid, isOther: 1 }
  })
}

watch(()=>props.item.videoStatisticsInfo.comments, (val)=> {
  store.commit("indexStore/setComData", { key: 'showCommentData', value: {contentId: props.item.videoBaseInfo.contentId, comments: val} })
})
</script>

<style scoped lang="less">
.utils {
  display: flex;
  flex-direction: column;
  align-items: center;

  &>div {
    // height: .8rem;
  }

  .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #fff;
    margin-bottom: 0.24rem;
    font-size: 0.12rem;
    .avatar {
      width: .4rem;
      height: .4rem;
    }
    .follow {
      width: .2rem;
      height: .2rem;
      margin-top: -0.1rem;
      position: relative;
      z-index: 1;
    }
  }
}
</style>