// import { VideoApi } from '@/api/video';
// import { debounce } from '@/utils/common/index';

const indexStore = {
  namespaced: true,
  state: {
    data: {},
    videoPlayCount: 0,
    playProgress: 0,
    pageInfo: {
      mobile: '',
      phoneExpression: '',
      phoneFullName: '',
      phoneImageUrl: ''
    },
    cpBusinessSignConfig: {
      "days": 0,
      "signConfigs": [],
      "signInFlag": false
    },
    cpBusinessOperateBoxConfig: [],
    cpBusinessDailyTaskConfig: [],
    userInfo: {},
    pageStyle: {
      tabBarHeight: '20'
    },
    countryInfo: {
      areaCode: '',
      country: '',
      lang: 'en',
    },
    currencyTotal: 0, // 余额
    currencySymbol: '', // 货币符号
    monetaryUnit: '',
    uid: 0, // 用户ID
    lang: 'en',
    showDialog: false,
    showDialog2: false,
    isTipShow: false,
    initQuery: {},
    fullMobile: '',
    coinsRatio: 100,
    bindPhone: {
      show: false,
      fromPage: ''
    },
    checkInModalShow: false,
    isNewUser: false,
    addCoins: 0, // 看视频...添加的金币，需要展示
    env: '',
    palyingInfo: {
      videoId: '',
      playTime: 0,
    },
    reportData: {
      country: '',
      pubAppId: '',
      publisherId: '',
      unitType: '',
    },
    showCommentPop: false,
    showCommentData: {},
    operateConfig: {
      Interactive: [], // banner运营位
      Interstitial: [], // 全屏运营位
      InterstitialRequestIds:[], // 全屏运营位请求过的id，用于判断是否为重复模板发起请求
    },
    

    initInfo:{
      balance:{},
      cpBusinessNewUserGiftConfig:{},
      logCode:"",
      reportData:"",
      userInfo:{}
    },
  },
  mutations: {
    set_initInfo(state, payload) {
      state.initInfo = payload
    },

    setComData(state, {key, value}){
      state[key] = value
    },
    setData(state, payload) {
      state.data = payload
    },
    setBindPhone(state: any, data: any) {
      state.bindPhone = data
    },
    setInitQuery(state, payload) {
      state.initQuery = payload
    },
    setLang(state, data) {
      state.lang = data
    },
    setShowDialog(state, payload) {
      state.showDialog = payload
    },
    setShowDialog2(state, payload) {
      state.showDialog2 = payload
    },
    setTipShow(state, payload) {
      state.isTipShow = payload
    },
    setVideoPlayCount(state, payload) {
      state.videoPlayCount = payload
    },
    changeCheckInModalShow(state, payload){
      state.checkInModalShow = payload
    },
    setPlayProgress(state, payload) {
      state.playProgress = payload
    },
    setAddCoins(state, payload) {
      state.addCoins = payload
    },
    setEnv(state, payload){
      state.env = payload
    },
    setInterstitial(state, payload){
      state.operateConfig.Interstitial = payload
    },
    setInteractive(state, payload){
      state.operateConfig.Interactive = payload
    }

  },
  actions: {
  },
  getters: {
  }
}

export {
  indexStore
}
