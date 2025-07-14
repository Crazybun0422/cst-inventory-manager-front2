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
                :size="100"
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
    </div>
  </div>
</template>

<script>
import PageHead from '@/components/page-head.vue'
import { getGlobalHeaders, loadHomeData } from '@/common/common-func'
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
    loadHomeData,
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
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isAllowedType) {
        this.$message.error(this.$t('message.signUp.imgFormatError'));
      }
      if (!isLt2M) {
        this.$message.error(this.$t('message.signUp.imgSizeLimitError'));
      }
      return isAllowedType && isLt2M;
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
              this.loadHomeData().then((res) => {
                if (this.$isRequestSuccessful(res.code)) {
                  const { avatar_base64 } = res.data
                  localStorage.setItem('avatarBase64', avatar_base64)
                  //刷新页面
                  window.location.reload()
                }
                // 统一拦截里面做了其他code的处理
              }).catch((error) => {
                console.error(error);
              })

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
          // 给变量赋值
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
    // 获取用户基础设置 并赋值
    this.getBaseSetting()
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
</style>