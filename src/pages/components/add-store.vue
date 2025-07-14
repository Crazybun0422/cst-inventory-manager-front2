<!--
* @Description:
* @Author: tj
* @Date: 2022
* @LastEditors: tj
* @LastEditTime: 2022
-->
<template>
  <div>
    <el-form
      label-position="right"
      label-width="80px"
      :model="formLabelAlign"
      ref="form"
      :rules="rules"
    >
      <el-form-item
        prop="name_of_provider"
        :label="$t('message.signUp.storeName')"
        align="top"
        label-width="120px"
      >
        <el-input
          v-model.trim="formLabelAlign.name_of_provider"
          clearable
          :placeholder="$t('message.signUp.storeNamePlaceholder')"
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('message.signUp.storeLogo')"
        align="top"
        label-width="120px"
      >
        <ul class="el-upload-list el-upload-list--picture-card image-upload">
          <li
            v-for="item in fileUploadList"
            :key="item.url"
            class="el-upload-list__item is-success"
          >
            <img :src="item.url" class="el-upload-list__item-thumbnail" />
            <!-- <span class="el-upload-list__item-actions">
              <span class="el-upload-list__item-delete">
                <i class="el-icon-delete"></i>
              </span>
            </span> -->
          </li>
          <el-upload
            class="upload-avatar"
            action="#"
            :file-list="fileUploadList"
            :on-change="onChangeFile"
            :auto-upload="false"
            ref="uploadImag"
            list-type="picture-card"
            :http-request="uploadFile"
            :show-file-list="false"
          >
            <i slot="default" class="el-icon-plus"></i>
          </el-upload>
        </ul>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  props: {},
  components: {},
  data () {
    return {
      fileUploadList: [],
      formLabelAlign: {
        name_of_provider: '',
        logo_of_provider: ''
      },
      rules: {
        name_of_provider: [
          {
            required: true,
            message: this.$t('message.signUp.storeName'),
            trigger: ['blur', 'change']
          }
        ],
      },
    }
  },
  mounted () { },
  methods: {
    uploadFile (param) {
      this.logo_of_provider = param.file
    },
    onChangeFile (file) {
      // 图片上传之前的钩子函数，进行文件类型和大小的校验
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
      const isAllowedType = allowedTypes.includes(file.raw.type)
      const isAllowedSize = file.raw.size / 1024 / 1024 < 5 // 文件大小限制为5MB

      if (!isAllowedType) {
        this.$message.error(this.$t('message.signUp.imgFormatError'))
        this.fileUploadList = []
        return false
      }
      if (!isAllowedSize) {
        this.$message.error(this.$t('message.signUp.imgSizeLimitError'))
        this.fileUploadList = []
        return false
      }

      this.fileUploadList = []
      this.fileUploadList[0] = file
      this.formLabelAlign.logo_of_provider = file.raw
      return isAllowedType && isAllowedSize // 返回校验结果
    },
    // //限制上传文件数量
    //   handleExceed () {
    //     this.$alert(this.$t('message.signUp.imgNumberLimitError'), {
    //       confirmButtonText: this.$t('message.signUp.confirmBtnText')
    //     })
    // }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-form-item {
  margin-bottom: 28px;
}
.signup-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60%;
  border-radius: 40px;
  padding: 24px;
  box-sizing: border-box;
  box-shadow: 5px 5px 10px var(--custom-theme-box-shadow);
}
.signup-left-img {
  margin: 0 auto;
}
.signup-form {
  padding: 24px 24px 0 0;
  width: 500px;
}
.register-or-login {
  display: flex;
  align-items: center;
  flex-direction: column;
}
.to-login:hover {
  text-decoration: underline;
  cursor: pointer;
}
.image-upload {
  display: flex;
  flex-wrap: wrap;
}
</style>
