<!--
* @description  参数1
* @fileName  security-setting
* @author wjp
* @date 2023-12-04 22:19:15
!-->
<template>
  <div id="security-setting" class="security-setting" v-loading="loading">
    <PageHead :title="$t('message.myAccount.securitySettings')"> </PageHead>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-input v-model="input" :type="inputType" readonly ref="apiKeyInput"
          ><i
            slot="suffix"
            :class="[
              'el-input__icon',
              'iconfont',
              isIconOff ? 'icon-view-off' : 'icon-view'
            ]"
            @click="changeType"
          ></i>
        </el-input>
      </el-col>
      <el-col :span="2">
        <el-popconfirm
          :title="$t('message.myAccount.updateTheKeyDesc')"
          placement="top"
          @confirm="updateKey"
        >
          <el-button slot="reference">{{
            $t('message.myAccount.updateTheKey')
          }}</el-button>
        </el-popconfirm>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PageHead from '@/components/page-head.vue'
export default {
  name: 'security-setting',
  props: {
  },
  data () {
    return {
      loading: false,
      input: '',
      inputType: 'password',
      fullscreenLoading: false,
      isIconOff: true,

    }
  },
  components: {
    PageHead
  },
  methods: {
    changeType () {
      this.isIconOff = !this.isIconOff;
      this.inputType = this.inputType === 'password' ? 'text' : 'password'
    },

    updateKey () {

      this.loading = true
      this.$ajax({
        method: 'put',
        url: '/api-prefix/api/customer-settings/modify-api-key',
        roleType: this.roleType
      }).then(res => {
        if (this.$isRequestSuccessful(res.code)) {
          this.$message({
            message: this.$t('common.editSuccessful'),
            type: 'success'
          })

          this.input = res.data
        } else {
          this.$message({
            message: res.msg[this.$languageType],
            type: 'error'
          })

        }

      }).catch(error => {
        console.error(error);
      }).finally(() => {
        this.loading = false
      })
    },
    getKey () {
      this.$ajax({
        method: 'get',
        url: '/api-prefix/api/customer-settings/get-api-key',
        roleType: this.roleType
      }).then(res => {
        if (this.$isRequestSuccessful(res.code)) {
          this.input = res.data
        } else {
          this.$message({
            message: res.msg[this.$languageType],
            type: 'error'
          })
        }
      })

    }
  },
  computed: {

  },
  mounted () {
    this.getKey()
  },
  watch: {

  }
}
</script>
<style scoped lang='css'>
</style>