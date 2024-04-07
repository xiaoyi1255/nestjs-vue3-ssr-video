import {  store } from '@/store'

export function getType (value) {
    return Object.prototype.toString.call(value)	// [object Undefined]
           .match(/\s+(\w+)/)[1]					// Undefined
           .toLowerCase()							// undefined
}
export const debounce = (func, wait, immediate) => {
    let timer;
    let context;
    let args;
    const later = () =>
        setTimeout(() => {
            timer = null;
            if (!immediate) {
                func.apply(context, args);
                context = args = null;
            }
        }, wait);
    return function (...params) {
        if (!timer) {
            timer = later();
            if (immediate) {
                func.apply(this, params);
            } else {
                context = this;
                args = params;
            }
        } else {
            clearTimeout(timer);
            timer = later();
        }
    };
};
export const isNumber = (val) => {
    const reg = /^[0-9]*[1-9][0-9]*$/;
    return reg.test(val)
}
export const validEmail = (val) => {
    const reg = /^([A-Za-z0-9_\-.\u4e00-\u9fa5])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,8})$/
    return reg.test(val)
}
export const randomInt = (min,max) => {
    return Math.floor(Math.random()*(max-min+1))+min
}
export const dealUrl = (url, elName) => {
    const { did } = JSON.parse(sessionStorage.getItem('device'))
    const { bundle } = JSON.parse(sessionStorage.getItem('app'))
    const { best } = JSON.parse(sessionStorage.getItem('ecData'))
    const { cpid, crid, id, mpid } = JSON.parse(sessionStorage.getItem('pos'))
    const finalUrl = `${best}/ad/jump?dataPageTitle=cpApp&dataElementName=${elName}&url=${encodeURIComponent(url)}&bundle=${bundle}&did=${did}&mpid=${mpid}&pos=${id}&crid=${crid}&cpid=${cpid}`
    console.log(finalUrl);
    return finalUrl
}
export const compareVersion = (currentV, compareV) => {
    if (currentV === compareV) {
        return true;
    }
    const currentVArr = currentV.split(".").map(item => parseInt(item));
    const compareVArr = compareV.split(".").map(item => parseInt(item));
    const length = Math.max(currentVArr.length, compareVArr.length);
    while (currentVArr.length < length) {
        currentVArr.push(0)
    }
    while (compareVArr.length < length){
        compareVArr.push(0)
    }
    for (let i = 0; i < length; i++) {
        if (currentVArr[i] > compareVArr[i]) {
            return false;
        } else if (currentVArr[i] < compareVArr[i]) {
            return true;
        }
    }
    return true
}

export const checkObjectEmpty = (value)=>{
    return value && Object.keys(value).length === 0 && value.constructor === Object;
}
export const dealAmount = (flag,value)=>{
    const money = value / 100
    
    switch (flag) {
        case 'IN':
            //与产品确认都保留两位小数
            return money?.toFixed(2)
        default:
            return money?.toFixed(2)
    }
}
export const formatDate = (time)=> {
    const date = new Date(time)
    return `${date.getFullYear()}-${date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1}-${date.getDate() < 10 ? '0'+date.getDate() : date.getDate()}`
}
export const changeURLArg = (url, arg, argVal)=>{
    var pattern = arg + '=([^&]*)';
    var replaceText = arg + '=' + argVal;
    if (url.match(pattern)) {
        var tmp = '/(' + arg + '=)([^&]*)/gi';
        tmp = url.replace(eval(tmp), replaceText);
        return tmp;
    } else {
        if (url.match('[?]')) {
            return url + '&' + replaceText;
        } else {
            return url + '?' + replaceText;
        }
    }
}
export const formatSign = (lang,value)=> {
    const sign = {
        ru:','
    }
    if(sign[lang]){
        return String(value).replace('.',',')
    }else{
        return value
    }
}

export const getEcId = ()=>{
    const { ec="{}" } = sessionStorage
    const { id } = JSON.parse(ec) || {}
    return id
}
export function formatTime(fmt){
    var o = {   
        "M+" : this.getMonth()+1,                 //月份   
        "d+" : this.getDate(),                    //日   
        "h+" : this.getHours(),                   //小时   
        "m+" : this.getMinutes(),                 //分   
        "s+" : this.getSeconds(),                 //秒   
        "q+" : Math.floor((this.getMonth()+3)/3), //季度   
        "S"  : this.getMilliseconds()             //毫秒   
    };   
    if(/(y+)/.test(fmt))   
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
    for(var k in o)   
        if(new RegExp("("+ k +")").test(fmt))   
    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
    return fmt;   
}
export const registerUtils = ()=> {
    Date.prototype.format = formatTime
}

export const guid =()=>{
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  }


//数字转化
export const bigNumberTransform  = (num) => {
    const THOUSAND = 1000;
    const TEN_THOUSAND = 100000;
    const ONE_HUNDRED_MILLION = 1000000;
    if(num >= THOUSAND && num<TEN_THOUSAND){
        return '+'+(num/THOUSAND).toFixed(1) + 'k'
    }
    else if(num >= TEN_THOUSAND && num<ONE_HUNDRED_MILLION){
        return '+'+(num/THOUSAND).toFixed(1) + 'k'
    }
    else if(num >= ONE_HUNDRED_MILLION){
        return  '+999k+'
    }
    return '+'+num
  }

  //数字转化
export const maxNumberTransform  = (num) => {
    const ONE_HUNDRED_MILLION = 100000000;
   if(num >= ONE_HUNDRED_MILLION){
        return  '9999w+'
    }
    return num
  }

//首字母大写
export const ucfirst = (str) =>{
    if(!str) return ''
    return str.substring(0,1).toUpperCase()+str.substring(1)
}


export const random =(lower, upper)=> {
	return Math.floor(Math.random() * (upper - lower)) + lower;
}


//从网址url截取内容的方法
export const getParameter = (url,param) =>
{
    //用该属性获取页面 URL 地址
    let query = url ||  window.location.search;
    let iLen = param.length;
    // indexOf() 方法可返回某个指定的字符串值在字符串中首次出现的位置。
    let iStart = query?.indexOf(param);
    if (iStart == -1)
        return "";
    iStart += iLen + 1;
    let iEnd = query?.indexOf("&", iStart);
    if (iEnd == -1)
    //截取字符串
        return query.substring(iStart); 
    return query.substring(iStart, iEnd);
}

//参数拼接

export const build = (path, query = {}) => {
    // if (!_isObject(query)) {
    //     console.error('请传入正确的query')
    //     return
    // }
    let str = ''
    Object.keys(query).forEach(key => {
        str += `&${key}=${encodeURIComponent(query[key])}`
    })
    return `${path}?${str.slice(1)}`
}

export const  GetQueryString = (name)=> {  
    console.log(window.location.search, 'window.location.search===')
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");  
    var r = window.location.search.substr(1).match(reg);  
    if (r != null) {   
        return unescape(r[2]);  
    }  
    return null;  
}

//重试机制
const maximum_backoff = 64 * 1000;
export const retry  = (fn, times, deadline)=> {
  const operationTimeout = [];
  for (let i = 0; i < times; i++) {
    if (deadline < 0) {
      break;
    }
    // eslint-disable-next-line no-undef
    const timeout = createTimeout(i, maximum_backoff);
    deadline -= timeout;
    operationTimeout.push(timeout);
  }
 
  times = operationTimeout.length;
 
  return new Promise((resolve, reject) => {
    const attemp = () => {
      fn().then(resolve).catch(err => {
        if (times === 0) {
          return reject(err)
        }
        times--;
        setTimeout(attemp, operationTimeout.shift());
      });
    }
 
    attemp();
  });
}



export const resolveLandingPage = (landingPage)=>{
    const pages = landingPage.split("scheme://open?")
    const { ec } = sessionStorage
    console.log('H5INFO: ec信息的打印;',JSON.parse(ec || "{}") || {})
    const { id } = ec ?  JSON.parse(ec) || {} : { id: ''}
    if(pages.length >1){
        const mode = pages[1].split(";")[0].split("=")[1];
        let url = null
        if(pages[1].split(";").length>1){
            url = pages[1].split(";")[1]
        }
        switch (mode) {
            case "browser":
                window.common.openBrowser(url)
                break;
            case "webview":
                window.webView.create(`/task/webview?url=${url}&showClose=true`,'',id,false)
                break;
            default:
                break;
        }
        return {
            type:mode,
            url:url
        }
        

    }else{
        window.common.openBrowser(landingPage)
        return{
            type:"browser",
            url:landingPage
        }
    } 
}
export const getElementTop = (element)=>{
    let actualTop = element.offsetTop
    let current = element.offsetParent
    while(current !== null){
        actualTop+= current.offsetTop
        current= current.offsetParent
    }
    return actualTop
}

export const  GetRequest =(url)=> {
    var theRequest ={};
    if (url.indexOf("?") != -1) {
     var str = url.split("?");
     let str1 = ""
     console.log(str,"str1=22")
     if(str.length>=2) {
        str1 = str[1]
     }else{
        return {}
     }
     console.log(str1,"str==")
     const strs = str1.split("&");
     for(var i = 0; i < strs.length; i ++) {
      theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
     }
    }
    return theRequest;
   }

 export  const replaceUrlMacros = (url)=>{
    
    if (url?.indexOf("{did}") != -1){
        const did = sessionStorage.did;
        if (did){
            url = url.replace("{did}", did);
        }
    }
    if (url?.indexOf("{opentype}") != -1){
        const opentype = "cpPubliser";
        url = url.replace("{opentype}", opentype);
    }
    if (url?.indexOf("{mode}") != -1){
        url = url.replace("{mode}", "OF");
    }
    if (url?.indexOf("{bundle}") != -1){
        const bundle = sessionStorage.bundle;
        if (bundle){
            url = url.replace("{bundle}", bundle);
        }
      }
      if (url?.indexOf("{header}") != -1){
        const header = store.state.headers;
        if (header){
            url = url.replace("{header}", header);
        }
      }
    return url;
}


//时间排序
//prop：对象数组排序的键，
//align：排序方式，"positive"正序，"inverted"倒序。
export const compare = (prop,align)=>{
    return function(a,b){
        var value1=a[prop];
        var value2=b[prop];
        if(align=="positive"){//正序
            return value1-value2;
        }else if(align=="inverted"){//倒序
            return value2-value1;
        }
    }
}


export const ssrUrl = (href)=>{
    let surl = changeURLArg(
        changeURLArg(href, 'headers', JSON.stringify(store.state.headers)),
        'useIframeBridge',
        true
      );
      surl += '&t=' + new Date().getTime();
      return `/ssr/renderInWebview?ssrUrl=${encodeURIComponent(surl)}`
    
}

export const isDevUid = () => {
    const whiteUid = ['1333577']
    if (whiteUid.includes('' + (sessionStorage.uid))) {
        return true
    }
    return false
}