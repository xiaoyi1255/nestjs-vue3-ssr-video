class VideoStorageManager {
  private key: string;
  constructor() {
    this.key = 'watch_video';
    // this.removeLocalVideoInfo7d();
  }

  private generateKey(currentDate = new Date()) {
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // 月份从 0 开始，需要加 1
    const currentDay = currentDate.getDate();
    return `video_${currentYear}-${currentMonth}-${currentDay}`;
  }

  getLocalVideoInfo() {
    const data = localStorage.getItem(this.key);
    const tody_key = this.generateKey()
    if (data) {
      let { key } = JSON.parse(data) || {};
      if (key !== tody_key) {
        return { videos: [], count: 0, lastUpdated: new Date().getTime(), key: tody_key};
      } else{
        return JSON.parse(data);
      }
    }
    return data ? JSON.parse(data) : { videos: [], count: 0, lastUpdated: new Date().getTime(), key: tody_key};
  }

  updateLocalVideoInfo(videoInfo) {
    const videoData = this.getLocalVideoInfo();
    let { videos, count = 0, lastUpdated } = videoData;

    const existingVideoIndex = videos.findIndex((v) => v.videoId === videoInfo.contentId);

    if (existingVideoIndex !== -1) {
      // 如果已经存在，则更新播放进度
      // videos[existingVideoIndex].progress = videoInfo.progress;
    } else {
      // 如果不存在，则添加新视频信息
      videos.push({
        videoId: videoInfo.contentId,
        timestamp: new Date().getTime(),
      });
      count++;
    }

    lastUpdated = new Date().getTime();

    const updatedVideoData = { videos, count, lastUpdated, key: this.generateKey() };
    localStorage.setItem(this.key, JSON.stringify(updatedVideoData));
  }

  private removeLocalVideoInfo7d() {
    // 获取当前日期
    const currentDate = new Date();

    // 获取7天前的日期
    const sevenDaysAgo = new Date(currentDate);
    sevenDaysAgo.setDate(currentDate.getDate() - 7);

    // 获取7天前的年、月、日
    const key = this.generateKey(sevenDaysAgo);
    localStorage.removeItem(key);

  }
}

// 示例用法
let videoStorage;

const registVideoStorage = () => {
  if (videoStorage) return videoStorage
  videoStorage = new VideoStorageManager()
  return videoStorage
}

export {
  registVideoStorage
}

