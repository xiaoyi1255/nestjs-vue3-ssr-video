import {
  Toast,
  Swipe,
  SwipeItem,
  Lazyload,
  Loading,
  Image as VanImage,
} from "vant";
import { App } from "vue";


const registerVant = (app: App<Element>) => {
  app.component('Toast', Toast)
  app.component('van-image', VanImage);
  app.component('van-swipe', Swipe);
  app.component('van-swipe-item', SwipeItem);
  app.component('van-loading', Loading);

  app.use(Lazyload, {
    lazyComponent: true,
  })
  
  Toast.setDefaultOptions('loading', { forbidClick: true });

};

export default registerVant