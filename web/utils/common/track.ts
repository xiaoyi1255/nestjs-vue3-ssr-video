
const VER = {
  ver: '2.0',
};
let baseURL
// const baseURL = 'https://s.pubunit.net'

if (__isBrowser__) {
  baseURL = window.__INITIAL_DATA__?.initData?.env === 'production' ? 'https://s.pubunit.net' : 'https://s.yowin.tech'
} else {
  baseURL = process.env.USE_ENV === 'production' ? 'https://s.pubunit.net' : 'https://s.yowin.tech'
}
/**
 * 
 * @param param0 
 */
const trackEvent = ({ ev, remarks = '', elementName = '', pageTitle = '', content = '', data={} }) => {
  try {
    // baseURL = window.__INITIAL_DATA__?.initData?.env === 'production' ? 'https://s.pubunit.net' : 'https://s.yowin.tech'
    const { href } = window.location;
    const did = sessionStorage.getItem('did') || '';
    let initParam = sessionStorage.getItem('initParams') || '{}';
    let userInfo = sessionStorage.getItem('userInfo') || '{}';
    let logCode = sessionStorage.getItem('logCode') || '';
    initParam = JSON.parse(initParam) || {};
    userInfo = JSON.parse(userInfo) || {};
    const country = userInfo?.currencyInfo?.country || sessionStorage.getItem('country') || ''
    let reportdata = sessionStorage.getItem('reportData') || '{}';
    let serverParam  = JSON.parse(reportdata) || {};
    const trackData = {
      ...serverParam,
      adType: '',
      deviceId: did,
    }
    const event = {
      tid: initParam?.unitId || '',
      event: ev,
      did: did,
      data: {
        url: href,
        remarks,
        uid: sessionStorage.getItem('uid') || '',
        abt: '',
        element_name: elementName,
        page_title: pageTitle,
        content,
        unitId: initParam?.unitId,
        clientIP: initParam?.clientIp || '',
        clientIp: initParam?.clientIp || '',
        ...VER,
        ...data,
        ...trackData,
      },
      dtype: 1,
      lang: userInfo?.currencyInfo?.lang || '',
      lcountry: country,
      os: '1',
      ts: new Date().getTime(),
      zo: ''
    };
    console.log(event);
    if (logCode) {
      navigator.sendBeacon(`${baseURL}/log/${logCode}/v3?type=video`, JSON.stringify(event));
    } else {
      console.log('--埋点打印--logCode为空', event);
    }
  } catch (error) {
    console.error('--埋点打印--报错', error);
  }
};

export {
  trackEvent,
};