<!--
* @description  参数1
* @fileName  base-setting
* @author wjp
* @date 2023-12-03 20:46:39
!-->
<template>
  <div id="base-setting" class="base-setting">
    <PageHead :title="$t('message.myAccount.baseSetting')"> </PageHead>
    <div v-loading="loading">
      <el-form
        label-position="top"
        :model="baseSettingForm"
        ref="baseSettingForm"
        label-width="100px"
        class="demo-dynamic"
        :rules="baseSettingRules"
      >
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item prop="email" :label="$t('message.myAccount.email')">
              <el-input v-model.trim="baseSettingForm.email"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('message.myAccount.avatar')">
              <el-avatar
                :size="140"
                shape="circle"
                @error="errorHandler"
                :src="imageSrc"
                class="avatar"
              />
              <el-upload
                class="avatar-uploader"
                name="files"
                action="/api-prefix/api/upload-img"
                :headers="uploadReqestHeader"
                :before-upload="beforeProductUpload"
                :on-success="handleProductSuccess"
                :show-file-list="false"
                :disabled="avatarUploading"
              >
                <el-button icon="el-icon-upload">{{
                  $t('message.myAccount.change')
                }}</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24" type="flex" align="top">
          <el-col :span="8" class="flex-container">
            <el-form-item
              prop="phone_number"
              :label="$t('message.myAccount.phone')"
            >
              <el-input v-model.trim="baseSettingForm.phone_number"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24" type="flex" align="top">
          <el-col :span="8" class="flex-container">
            <el-form-item
              prop="nationality"
              :label="$t('message.myAccount.country')"
            >
              <el-input v-model.trim="baseSettingForm.nationality"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24" type="flex" align="top">
          <el-col :span="8" class="flex-container">
            <el-form-item
              prop="address"
              :label="$t('message.myAccount.address')"
            >
              <el-input v-model.trim="baseSettingForm.address"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="submitForm('baseSettingForm')">{{
            $t('common.save')
          }}</el-button>
          <el-button @click="resetForm('baseSettingForm')">{{
            $t('common.reset')
          }}</el-button>
        </el-form-item>
      </el-form>
      <el-dialog
        :visible.sync="showAvatarCropper"
        :title="$t('message.myAccount.avatar')"
        width="520px"
        :close-on-click-modal="!avatarUploading"
        :close-on-press-escape="!avatarUploading"
        :show-close="!avatarUploading"
        @closed="onCropperClosed"
      >
        <div class="avatar-cropper-wrapper" v-loading="avatarUploading">
          <div class="avatar-cropper-stage">
            <img
              v-if="cropperImageUrl"
              ref="avatarCropperImage"
              :src="cropperImageUrl"
              alt="avatar preview"
              class="avatar-cropper-image"
            />
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="onCropperCancel" :disabled="avatarUploading">{{
            $t('common.cancel')
          }}</el-button>
          <el-button
            type="primary"
            @click="onCropperConfirm"
            :loading="avatarUploading"
          >
            {{ $t('common.confirm') }}
          </el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import PageHead from '@/components/page-head.vue'
import { getGlobalHeaders } from '@/common/common-func'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
export default {
  name: 'base-setting',
  props: {

  },
  data () {
    return {
      loading: false,
      imageUrl: '',
      imageSrc: '',
      picturePreviewList: [],
      uploadReqestHeader: {},
      showAvatarCropper: false,
      cropperImageUrl: '',
      cropperInstance: null,
      pendingAvatarFile: null,
      avatarUploading: false,
      baseSettingForm: {
        email: '',
        phone_number: '',
        nationality: '',
        address: '',
        user_avatar_url: ''
      },
      baseSettingRules: {
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        phone_number: [

        ]
      }
    }
  },
  components: {
    PageHead
  },
  methods: {
    errorHandler () {
      return true
    },
    getGlobalHeaders,
    // 图片上传
    handleProductSuccess (res, file, fileList) {
      if (!this.$isRequestSuccessful(res.code)) {
        this.$message.error(res.msg[this.$languageType])
      } else {
        file.file_url = res.data[0]
        this.baseSettingForm.user_avatar_url = res.data[0]
      }
      this.getImage(file.file_url)

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
      if (!isAllowedType || !isLt2M) {
        return false
      }
      this.prepareAvatarCropper(file)
      return false
    },
    prepareAvatarCropper (file) {
      this.destroyCropper()
      this.pendingAvatarFile = file
      this.cropperImageUrl = URL.createObjectURL(file)
      this.showAvatarCropper = true
      this.$nextTick(() => {
        const image = this.$refs.avatarCropperImage
        if (!image) {
          return
        }
        this.cropperInstance = new Cropper(image, {
          viewMode: 1,
          aspectRatio: 1,
          dragMode: 'move',
          autoCropArea: 1,
          background: false,
          guides: false,
          movable: true,
          zoomable: true,
          scalable: false,
          rotatable: false,
          cropBoxResizable: false,
          cropBoxMovable: false,
          minContainerWidth: 360,
          minContainerHeight: 360
        })
      })
    },
    onCropperCancel () {
      if (this.avatarUploading) {
        return
      }
      this.showAvatarCropper = false
    },
    onCropperClosed () {
      this.destroyCropper()
    },
    async onCropperConfirm () {
      if (!this.cropperInstance) {
        this.$message.error(this.$t('common.operationFailed'))
        return
      }
      const canvas = this.cropperInstance.getCroppedCanvas({
        width: 400,
        height: 400,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high'
      })
      if (!canvas) {
        this.$message.error(this.$t('common.operationFailed'))
        return
      }
      const mimeType = (this.pendingAvatarFile && this.pendingAvatarFile.type) || 'image/png'
      this.avatarUploading = true
      try {
        const blob = await this.getCanvasBlob(canvas, mimeType)
        await this.uploadCroppedAvatar(blob)
        this.showAvatarCropper = false
      } catch (error) {
        console.error('Failed to crop or upload avatar', error)
        this.$message.error(this.$t('common.operationFailed'))
      } finally {
        this.avatarUploading = false
      }
    },
    getCanvasBlob (canvas, mimeType) {
      return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Canvas to blob conversion failed'))
          }
        }, mimeType)
      })
    },
    async uploadCroppedAvatar (blob) {
      const fileName = this.pendingAvatarFile ? this.pendingAvatarFile.name : `avatar-${Date.now()}.png`
      const formData = new FormData()
      formData.append('files', blob, fileName)
      const res = await this.$ajax({
        url: '/api-prefix/api/upload-img',
        method: 'POST',
        data: formData,
        roleType: this.roleType,
        customHeaders: this.uploadReqestHeader
      })
      if (!this.$isRequestSuccessful(res.code)) {
        if (res.msg && res.msg[this.$languageType]) {
          this.$message.error(res.msg[this.$languageType])
        } else {
          this.$message.error(this.$t('common.operationFailed'))
        }
        throw new Error('Avatar upload failed')
      }
      const file = {
        file_url: res.data && res.data[0] ? res.data[0] : '',
        raw: blob
      }
      this.handleProductSuccess(res, file)
    },
    destroyCropper () {
      if (this.cropperInstance) {
        this.cropperInstance.destroy()
        this.cropperInstance = null
      }
      if (this.cropperImageUrl) {
        URL.revokeObjectURL(this.cropperImageUrl)
        this.cropperImageUrl = ''
      }
      this.pendingAvatarFile = null
    },
    handleAvatarSuccess (res, file) {
      this.baseSettingForm.user_avatar_url = URL.createObjectURL(file.raw);
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          this.$ajax({
            url: '/api-prefix/api/customer-settings/personal_info',
            method: 'POST',
            data: this.baseSettingForm,
            roleType: this.roleType
          }).then(res => {
            if (this.$isRequestSuccessful(res.code)) {
              this.$message.success(this.$t('common.operationSuccessful'))
              this.getBaseSetting()
              window.dispatchEvent(new CustomEvent('personal-info-updated'))

            }
          }).catch((error) => {
            console.error(error);
          }).finally(() => {
            this.loading = false
          })
        } else {
          return false;
        }
      });
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
    },
    getImage (url) {
      // TODO: 如果url为空 则不显示
      if (!url) {
        return
      }
      let that = this;
      this.$ajax({
        url: "/api-prefix/api/img" + url,
        method: "GET",
        headers: {
          "Content-Type": 'image',
        },
        roleType: this.roleType,
        responseType: 'blob'
      }).then(res => {
        const href = URL.createObjectURL(res);//转成url格式
        if (href !== null && href !== undefined) {
          // 给变量赋�?
          this.imageSrc = href
        }
      })
    },
    getBaseSetting () {
      this.$ajax({
        url: '/api-prefix/api/customer-settings/personal_info',
        method: 'GET',
        roleType: this.roleType
      }).then(res => {
        if (this.$isRequestSuccessful(res.code)) {
          this.baseSettingForm = res.data
          this.getImage(res.data.user_avatar_url)


        }
      })
    },

  },
  computed: {

  },
  mounted () {
    this.uploadReqestHeader = this.getGlobalHeaders(this.roleType)
    // 获取用户基础设置 并赋�?
    this.getBaseSetting()
  },
  beforeDestroy () {
    this.destroyCropper()
  },
  watch: {
    "baseSettingForm.user_avatar_url": {
      handler (url) {
        if (url) {
          this.getImage(url);
        }
      },
      immediate: true
    }
  }
}
</script>
<style scoped lang='css'>
.flex-container {
  display: flex;
  flex-direction: column;
}

.avatar {
  margin-bottom: 16px;
}

.avatar-uploader {
  margin-top: 8px;
}

.avatar-cropper-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 360px;
}

.avatar-cropper-stage {
  position: relative;
  width: 360px;
  height: 360px;
  border-radius: 50%;
  overflow: hidden;
  background: #000;
}

.avatar-cropper-image {
  display: block;
  max-width: 100%;
}

::v-deep .avatar-cropper-stage .cropper-container,
::v-deep .avatar-cropper-stage .cropper-canvas {
  border-radius: 50%;
}

::v-deep .avatar-cropper-stage .cropper-view-box,
::v-deep .avatar-cropper-stage .cropper-face {
  border-radius: 50%;
}

::v-deep .avatar-cropper-stage .cropper-view-box {
  box-shadow: 0 0 0 2000px rgba(0, 0, 0, 0.45);
  border: 2px solid #fff;
}

::v-deep .avatar-cropper-stage .cropper-dashed {
  border-color: transparent;
}
</style>
