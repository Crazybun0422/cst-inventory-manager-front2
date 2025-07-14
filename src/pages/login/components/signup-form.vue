<!--
* @description  参数1
* @fileName  signup-page
* @author wjp
* @date 2023-05-14 18:33:11
!-->
<template>
  <div class="signup-form">
    <el-form
      :model="formData"
      :rules="rules"
      ref="formData"
      label-width="150px"
      size="medium"
      v-loading="loading"
    >
      <el-form-item prop="username" :label="$t('message.signUp.userName')">
        <el-input
          prefix-icon="el-icon-user"
          v-model="formData.username"
          :placeholder="this.$t('message.signUp.enterUsername')"
        ></el-input>
      </el-form-item>
      <el-form-item
        prop="role"
        :label="$t('message.signUp.role')"
        v-if="pageType !== 'thirdVerify' && pageType !== 'addOperator'"
      >
        <el-select
          v-model="formData.role"
          :placeholder="$t('message.signUp.roleSelect')"
          prefix-icon="el-icon-s-custom"
          style="width: 100%"
        >
          <el-option
            :label="$t('message.signUp.provider')"
            :value="config.provider.roleName"
          ></el-option>
          <el-option
            :label="$t('message.signUp.dropShipper')"
            :value="config.dropShipper.roleName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="password" :label="$t('message.signUp.password')">
        <el-input
          prefix-icon="el-icon-lock"
          type="password"
          :show-password="true"
          auto-complete="new-password"
          :placeholder="$t('message.signUp.enterPassword')"
          v-model="formData.password"
        ></el-input>
        <el-progress
          v-if="showProgress"
          style="font-size: 10px; margin-top: 10px"
          :percentage="passwordStrength"
          :format="pwdFormatF"
          :color="pwdColorF"
        ></el-progress>
      </el-form-item>
      <el-form-item
        :label="$t('message.signUp.confirmPassword')"
        prop="confirmPassword"
        v-if="pageType !== 'thirdVerify'"
      >
        <el-input
          v-model="formData.confirmPassword"
          :show-password="true"
          prefix-icon="el-icon-lock"
          auto-complete="new-password"
          :placeholder="$t('message.signUp.confirmPasswordMsg')"
          type="password"
        ></el-input>
      </el-form-item>

      <el-form-item prop="phone" :label="$t('message.signUp.phone')">
        <el-input
          prefix-icon="el-icon-mobile-phone"
          v-model="formData.phone"
          :placeholder="$t('message.signUp.enterPhone')"
        ></el-input>
      </el-form-item>
      <el-form-item prop="email" :label="$t('message.signUp.email')">
        <el-input
          prefix-icon="el-icon-message"
          v-model="formData.email"
          :placeholder="$t('message.signUp.enterEmail')"
        ></el-input>
      </el-form-item>
      <el-form-item prop="address" :label="$t('message.signUp.address')">
        <el-input
          prefix-icon="el-icon-s-home"
          v-model="formData.address"
          :placeholder="$t('message.signUp.enterAddress')"
        ></el-input>
      </el-form-item>

      <el-form-item prop="fire" :label="$t('message.signUp.userAvatar')">
        <!-- 图片展示 -->
        <ul class="el-upload-list el-upload-list--picture-card image-upload">
          <li
            v-for="item in fileUploadList"
            :key="item.url"
            class="el-upload-list__item is-success"
          >
            <img :src="item.url" class="el-upload-list__item-thumbnail" />
            <!-- <span class="el-upload-list__item-actions">
              <span
                class="el-upload-list__item-delete"
              
              >
                <i class="el-icon-delete"></i>
              </span>
            </span> -->
          </li>
          <!-- 文件上传 -->
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
      <slot name="formButton"></slot>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "signup-page",
  props: {
    pageType: { type: String, default: 'signup' } // signup 注册 edit 修改账密
  },
  data () {

    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$t('message.signUp.enterPassword')));
      } else {
        //6-20位包含字符、数字和特殊字符
        // 包含 大小字母 数字 特殊字符
        var ls = 0;
        if (this.formData.password !== '') {
          if (this.formData.password.match(/([a-z])+/)) {
            ls++;
          }
          if (this.formData.password.match(/([0-9])+/)) {
            ls++;
          }
          if (this.formData.password.match(/([A-Z])+/)) {
            ls++;
          }
          if (this.formData.password.match(/([\W])+/) && !this.formData.password.match(/(![\u4E00-\u9FA5])+/)) {
            ls++;
          }
          if (this.formData.password.length < 6 || this.formData.password.length > 20) {
            callback(new Error(this.$t('message.signUp.passwordLengthError')));
            ls = 0;
          }
          if (this.formData.password.match(/([\u4E00-\u9FA5])+/)) {
            callback(new Error(this.$t('message.signUp.passwordFormatError')));
            ls = 0;
          }
          if (ls > 3 && this.formData.password.length < 12) {
            // 当满足四种类型 但是长度小于12级减少1
            ls--;
          }
          if (ls >= 3 && this.formData.password.length >= 12) {
            // 满足三种类型但是长度大于12时等级加1
            ls++;
          }
          switch (ls) {
            case 0: this.passwordStrength = 10; callback(new Error(this.$t('message.signUp.passwordRequirements'))); break;
            case 1: this.passwordStrength = 33; callback(new Error(this.$t('message.signUp.passwordRequirements'))); break;
            case 2: this.passwordStrength = 33; callback(new Error(this.$t('message.signUp.passwordRequirements'))); break;
            case 3: this.passwordStrength = 66; break;
            case 4: this.passwordStrength = 100; break;
            case 5: this.passwordStrength = 100; break;
            default: this.passwordStrength = 0; break;
          }
        }
        callback();
      }
    };
    return {
      loading: false,
      fileUploadList: [],
      src: "../assets/cst.jpg",
      passwordStrength: 0, // 用于保存密码强度
      formData: {
        username: "",
        password: "",
        confirmPassword: '',
        phone: '',
        email: '',
        address: '',
        role: '',
        avatar: ''
      },
      rules: {
        username: [
          {
            required: true,
            message: this.$t('message.signUp.enterUsername'),
            trigger: ["blur", "change"],
          },
          {
            //字母数字开头允许-_ 总长度大于等于5的正则
            pattern: /^(?:[a-zA-Z0-9][-_a-zA-Z0-9]{4,}|[a-zA-Z0-9]+[a-zA-Z0-9._-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/,
            message: this.$t('message.signUp.formatErrorUsername'),
            trigger: ["blur", "change"]
          }
        ],
        password: [
          {
            required: true,
            message: this.$t('message.signUp.enterPassword'),
            trigger: ["blur", "change"],
          },
          {
            // validator: (rule, value, callback) => {
            //   if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{9,}/.test(value)) {
            //     callback(new Error(this.$t('message.signUp.formatErrorPassword')));
            //   } else {
            //     callback();
            //   }
            validator: validatePassword,
            trigger: ["blur", "change"],
          }

        ],
        confirmPassword: [
          { required: true, message: this.$t('message.signUp.confirmPasswordMsg'), trigger: 'blur' },
          { validator: this.checkConfirmPassword, trigger: ["blur", "change"] },
        ],
        phone: [
          {
            message: this.$t('message.signUp.enterPhone'),
            trigger: ["blur", "change"],
          },
          { pattern: /^1[3456789]\d{9}$/, message: this.$t('message.signUp.formatErrorPhone'), trigger: 'blur' }

        ],
        email: [
          {
            message: this.$t('message.signUp.enterEmail'),
            trigger: ["blur", "change"],
          },
          {
            pattern: /^[\w.%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/,
            message: this.$t('message.signUp.formatErrorEmail'),
            trigger: 'blur'
          }
        ],
        address: [
          {
            message: this.$t('message.signUp.enterAddress'),
            trigger: ["blur", "change"],
          },
        ],
        role: [
          {
            required: true,
            message: this.$t('message.signUp.roleSelect'),
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  methods: {
    handleRemove (file) {
      this.fileUploadList = []
    },
    checkConfirmPassword (rule, value, callback) {
      if (value === this.formData.password) {
        callback();
      } else {
        callback(new Error(this.$t('message.signUp.confirmPasswordErrorMsg')));
      }
    },
    uploadFile (param) {
      this.avatar = param.file;
    },
    onChangeFile (file) {
      // 图片上传之前的钩子函数，进行文件类型和大小的校验
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const isAllowedType = allowedTypes.includes(file.raw.type);
      const isAllowedSize = file.raw.size / 1024 / 1024 < 5; // 文件大小限制为5MB

      if (!isAllowedType) {
        this.$message.error(this.$t('message.signUp.imgFormatError'));
        this.fileUploadList = []
        return false
      }
      if (!isAllowedSize) {
        this.$message.error(this.$t('message.signUp.imgSizeLimitError'));
        this.fileUploadList = []
        return false
      }
      // 每次都格式化 因为只保留一个图片
      this.fileUploadList = []
      this.fileUploadList[0] = file
      this.formData.avatar = file.raw
      return isAllowedType && isAllowedSize; // 返回校验结果
    },
    // 动态显示指定内容
    pwdFormatF () {
      return this.passwordStrength <= 33 ? this.$t('message.signUp.passwordStrengthWeak') : this.passwordStrength == 66 ? this.$t('message.signUp.passwordStrengthMedium') : this.passwordStrength == 100 ? this.$t('message.signUp.passwordStrengthStrong') : this.$t('message.signUp.passwordStrengthDefault')
    },
    // 动态改变颜色
    pwdColorF () {
      return this.passwordStrength <= 33 ? '#FF5340' : this.passwordStrength == 66 ? '#FFB640' : this.passwordStrength == 100 ? '#25DC1B' : '#FF5340'
    },
  },
  computed: {
    showProgress () {
      return this.formData.password !== "";
    },
  },
};
</script>
<style scoped lang='scss'>
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