<!--
* @description  图片上传
* @fileName  image-upload
* @author wjp
* @date 2023-07-18 10:48:45
!-->
<template>
  <div>
    <!-- 图片展示 -->
    <ul class="el-upload-list el-upload-list--picture-card image-upload">
      <li
        v-for="item in picturePreviewList"
        :key="item.file_url"
        class="el-upload-list__item is-success"
      >
        <AuthImg
          class="el-upload-list__item-thumbnail"
          :src="item.file_url"
        ></AuthImg>
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(item)"
          >
            <i class="el-icon-zoom-in"></i>
          </span>
          <span class="el-upload-list__item-delete" @click="handleRemove(item)">
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </li>
      <el-upload
        action="/api-prefix/api/upload/"
        name="files"
        :headers="uploadReqestHeader"
        :before-upload="beforeProductUpload"
        :on-preview="handlePictureCardPreview"
        :on-success="handleProductSuccess"
        list-type="picture-card"
        :file-list="picturePreviewList"
        :show-file-list="false"
      >
        <i slot="default" class="el-icon-plus"></i>
      </el-upload>
      <!-- 文件上传 -->
    </ul>
    <!-- 图片预览 -->
    <el-dialog :visible.sync="imgUploadDialogVisible" append-to-body>
      <AuthImg :src="dialogImageUrl" class="auth-img"></AuthImg>
    </el-dialog>
  </div>
</template>

<script>
import AuthImg from '@/components/auth-img.vue'
import utils from '@/utils/index'
import { getGlobalHeaders } from '@/common/common-func'
export default {
  name: 'image-upload',
  props: {
    fileList: { type: Array, default: () => [] },
    imageUrl: { type: String, default: null } // 只有一张图片时
  },
  data () {
    return {
      picturePreviewList: [],
      uploadReqestHeader: {},
      imgUploadDialogVisible: false,
      dialogImageUrl: ''
    }
  },
  components: {
    AuthImg
  },
  methods: {
    getGlobalHeaders,
    // 图片上传
    handleProductSuccess (res, file, fileList) {
      if (res.data[0].code) {
        this.$message.error(res.data[0].msg.zh_cn)
      } else {
        file.file_url = res.data[0].file_url.slice(1)
      }
      const fileLists = utils.deepClone(fileList)
      if (!this.imageUrl) {
        this.picturePreviewList = fileLists.filter((el) => {
          return !el.response || !el.response.data[0].code
        })
      } else {
        this.picturePreviewList = []
        if (res.data[0].code) {
          this.picturePreviewList = fileList[0].file_url ? [fileList[0]] : []
        } else {
          this.picturePreviewList.push(file)
        }
      }
      this.$emit('change', this.picturePreviewList)
    },
    handleRemove (file) {
      this.picturePreviewList.forEach((el, index) => {
        if (el.file_url === file.file_url) {
          this.picturePreviewList.splice(index, 1)
        }
      })
      this.$emit('change', this.picturePreviewList)
      //TODO: 可以增加一个删除接口 删除的时候把url带过去
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.file_url
      this.imgUploadDialogVisible = true
    },
    beforeProductUpload (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
      const isAllowedType = allowedTypes.includes(file.type)
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isAllowedType) {
        this.$message.error(this.$t('message.signUp.imgFormatError'))
      }
      if (!isLt2M) {
        this.$message.error(this.$t('message.signUp.imgSizeLimitError'))
      }
      return isAllowedType && isLt2M
    }
  },
  computed: {},
  mounted () {
    this.uploadReqestHeader = this.getGlobalHeaders(this.roleType)
  },
  watch: {
    fileList: {
      handler () {
        if (this.fileList && this.fileList.length !== 0) {
          this.picturePreviewList = this.fileList
        }
      },
      deep: true,
      immediate: true
    },
    imageUrl: {
      handler () {
        if (this.imageUrl) {
          this.picturePreviewList = [{ file_url: this.imageUrl }]
        } else {
          this.picturePreviewList = []
        }
      },
      immediate: true
    }
  }
}
</script>
<style scoped lang="scss">
.auth-img {
  height: 400px;
  width: auto;
}
::v-deep .el-dialog__body {
  display: flex;
  justify-content: center;
}
.image-upload {
  display: flex;
  flex-wrap: wrap;
}
.show-image {
  ::v-deep .el-upload--picture-card {
    display: none;
  }
}
</style>
