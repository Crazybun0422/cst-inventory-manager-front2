<template>
  <el-image ref="img" :src="imageSrc" :preview-src-list="[imageSrc]" class="img" :style="styleInfo" fit="cover" />
</template>

<script>
export default {
  name: 'auth-img',
  props: {
    src: {
      type: String,
      default: ''
    },
    styleInfo: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      imageSrc: '',
      cache: {},
      currentUrl: ''
    }
  },
  watch: {
    src: {
      handler(url) {
        if (url) {
          this.prepareImage(url)
        } else {
          this.currentUrl = ''
          this.imageSrc = ''
        }
      },
      immediate: true
    }
  },
  methods: {
    prepareImage(url) {
      this.currentUrl = url
      this.getImage(url)
    },
    getImage(url) {
      if (!url) {
        this.imageSrc = ''
        return
      }

      if (this.cache[url]) {
        this.imageSrc = this.cache[url]
        return
      }

      if (url.startsWith('https')) {
        this.cache[url] = url
        this.imageSrc = url
        return
      }

      this.$ajax({
        url: '/api/get-file/',
        method: 'GET',
        params: { filename: url },
        headers: { 'Accept': 'image/*' },
        responseType: 'blob'
      })
        .then(res => {
          const href = URL.createObjectURL(res)
          // only assign if still on the same URL
          if (href && url === this.currentUrl) {
            this.cache[url] = href
            this.imageSrc = href
          }
        })
        .catch(error => {
          console.error('Error fetching image:', error)
          // only clear if still on the same URL and not cached
          if (url === this.currentUrl && !this.cache[url]) {
            this.imageSrc = ''
          }
        })
    }
  }
}
</script>

<style scoped>
.img {
  width: 150px;
  height: 150px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
}
</style>
