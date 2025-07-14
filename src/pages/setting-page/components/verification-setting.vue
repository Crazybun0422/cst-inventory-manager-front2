<!--
* @description  参数1
* @fileName  verification-setting
* @author wjp
* @date 2023-12-04 22:58:18
!-->
<template>
  <div
    id="verification-setting"
    class="verification-setting"
    v-loading="loading"
  >
    <PageHead :title="$t('message.myAccount.authenticationSettings')">
    </PageHead>
    <el-form
      label-position="top"
      :model="verificationForm"
      ref="verificationForm"
      label-width="100px"
      class="demo-dynamic"
      :rules="verificationRules"
    >
      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item
            prop="email"
            :label="$t('message.myAccount.authenticationType')"
          >
            <el-select
              v-model="verificationForm.verify_type"
              :placeholder="$t('message.myAccount.authenticationTypeSelect')"
            >
              <el-option
                v-for="item in verify_type"
                :key="item.value"
                :label="item.label[$languageType]"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24" type="flex" align="top">
        <el-col :span="8" class="flex-container">
          <el-form-item
            prop="verify_name"
            :label="$t('message.myAccount.authenticationName')"
          >
            <el-input v-model.trim="verificationForm.verify_name"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24" type="flex" align="top">
        <el-col :span="8" class="flex-container">
          <el-form-item
            prop="verify_id"
            :label="$t('message.myAccount.authenticationID')"
          >
            <el-input v-model.trim="verificationForm.verify_id"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24" type="flex" align="top">
        <el-col :span="8" class="flex-container">
          <el-form-item
            :label="$t('message.myAccount.uploadDocuments')"
            prop="verify_photo_url"
          >
            <ImageUpload
              :image-url="verificationForm.verify_photo_url"
              @change="handleUploadImage(arguments, verificationForm)"
            ></ImageUpload>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" @click="submitForm('verificationForm')">{{
          $t('common.save')
        }}</el-button>
        <el-button @click="resetForm('verificationForm')">{{
          $t('common.reset')
        }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { verifyTypeMap } from '@/common/field-maping'
import { provider } from "@/common/commonconfig"
import PageHead from '@/components/page-head.vue'
import ImageUpload from '@/pages/product-manage/components/image-upload.vue'
export default {
  name: 'verification-setting',
  props: {
  },
  data () {
    return {
      loading: false,
      provider,
      imageUrl: '',
      imageSrc: '',
      verify_type: verifyTypeMap,
      picturePreviewList: [],
      verificationForm: {
        verify_type: 1,
        verify_name: '',
        verify_id: '',
        verify_photo_url: ''
      },
      verificationRules: {
        verify_type: [
          { required: true, message: this.$t('message.myAccount.authenticationTypeSelect'), trigger: 'blur' },
        ],
        verify_name: [
          { required: true, message: this.$t('message.myAccount.authenticationNamePlaceholder'), trigger: 'blur' },
        ],
        verify_id: [
          { required: true, message: this.$t('message.myAccount.authenticationIDPlaceholder'), trigger: 'blur' },
        ],
        verify_photo_url: [
          { required: true, message: this.$t('message.myAccount.uploadDocumentsPlaceholder'), trigger: 'blur' },
        ],
      }
    }
  },
  components: {
    ImageUpload,
    PageHead
  },
  methods: {
    errorHandler () {
      return true
    },
    // 图片上传
    handleProductSuccess (res, file, fileList) {
      if (res.data[0].code) {
        this.$message.error(res.data[0].msg.zh_cn)
      } else {
        file.file_url = res.data[0].file_url.slice(1)
        this.verificationForm.user_avatar_url = res.data[0].file_url.slice(1)
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
      this.verificationForm.user_avatar_url = URL.createObjectURL(file.raw);
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          this.$ajax({
            url: '/api-prefix/api/customer-settings/verification_info',
            method: 'POST',
            data: this.verificationForm,
            roleType: this.roleType
          }).then(res => {
            if (this.$isRequestSuccessful(res.code)) {
              this.$message.success(this.$t('common.operationSuccessful'))
              this.getVerification()
            }
          }).catch(error => {
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

    getVerification () {
      let queryParam = {
      }
      if (this.roleType === this.provider) {
        queryParam['user_related_id'] = localStorage.getItem('pUserRelatedId')
      }
      this.$ajax({
        url: '/api-prefix/api/customer-settings/verification_info',
        method: 'GET',
        params: queryParam,
        roleType: this.roleType
      }).then(res => {
        if (this.$isRequestSuccessful(res.code)) {
          this.verificationForm = res.data
        }
      })
    },
    handleUploadImage (fileList, verificationForm) {
      // 主图片处理函数
      if (arguments[0] && arguments[0].length !== 0 && arguments[0][0] && arguments[0][0].length !== 0) {
        this.$set(verificationForm, 'verify_photo_url', arguments[0][0][0].file_url)
      } else {
        arguments[1].verify_photo_url = undefined
      }
    },
  },
  computed: {

  },
  mounted () {
    this.getVerification()
  },
  watch: {

  }
}
</script>
<style scoped lang='css'>
</style>