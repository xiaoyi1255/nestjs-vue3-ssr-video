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

/*
* @des                               节流函数
* @param  {Number}    delay          延迟时间（ms），不传默认200ms
* @param  {Function}  callback       回调函数
* @param  {Boolen}    false          触发时是否立即执行第一次，默认不执行
* @return {Function}                 A new throttle function
*/
export const throttle = (callback, delay = 200, im = false) => {
 let timeoutID = null
 return function() {
   // 第一次触发时是否立即执行
   if (im && !timeoutID) {
     // 立即执行
     callback.apply(this, arguments)
     // 执行后立即关闭
     im = false
   }
   if (!timeoutID) {
     timeoutID = setTimeout(() => {
       // 外部第一个普通函数this和arguments对象
       callback.apply(this, arguments)
       // 执行后将timeoutID置为null
       timeoutID = null
     }, delay)
   }
 }
}

/**
 * url宏替换：did、gaid、unit_id
 * @param {*} url 
 * @returns 
 */
export const replaceUrlMacros = (url)=>{
  const did = sessionStorage.getItem("did") || '';
  const initParams = sessionStorage.getItem("initParams") || '{}';
  const initParamsObj = JSON.parse(initParams) || {};
  if (url?.indexOf("{did}") != -1){
    if (did){
        url = url.replace("{did}", did);
    }
  }
  if (url?.indexOf("{gaid}") != -1){
    if (did){
      url = url.replace("{gaid}", did);
    }
  }
  if (url?.indexOf("{unit_id}") != -1){
    if (initParamsObj?.unitId) {
      url = url.replace("{unit_id}", initParamsObj?.unitId);
    }
  }
  return url;
}

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

export function formatNumber(number) {
  if (number < 1000) {
    return number.toString();
  } else if (number < 1000000) {
    return (number / 1000).toFixed(1) + 'K';
  } else {
    return (number / 1000000).toFixed(1) + 'W';
  }
}