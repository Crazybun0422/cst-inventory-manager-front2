<!--
* @description  参数1
* @fileName  mark-order
* @author wjp
* @date 2024-01-10 21:47:53
!-->
<template>
  <div id="mark-order" class="mark-order">
    <el-dialog
      :title="$t('common.mark')"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
      v-loading="loading"
    >
      <el-form label-width="80px" :model="markOrderForm" ref="markOrderForm">
        <el-form-item :label="$t('common.mark')">
          <el-select
            v-model="markOrderForm.mark"
            :placeholder="$t('common.pleaseSelect')"
          >
            <el-option
              v-for="item in markOptions"
              :key="item.value"
              :label="item.label[$languageType]"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleOk">{{
          $t('common.confirm')
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { set } from 'vue';
import { orderMarkMap } from '@/common/field-maping'
export default {
  name: 'mark-order',
  props: {
    visible: { type: Boolean, default: false },
    markOrderIds: { type: Array, default: () => [] }
  },
  components: {

  },
  data () {
    return {
      loading: false,
      dialogVisible: false,
      markOrderForm: {
        mark: '1'
      },
      markOptions: orderMarkMap
    }
  },
  methods: {
    handleClose () {
      this.$emit('close')
    },
    async handleOk () {
      this.loading = true
      let markOrderIds = this.markOrderIds
      let reqBody = {
        mark: this.markOrderForm.mark,
        order_ids: markOrderIds
      }
      // try{
      //   this.loading = false
      //   const res = await this.$ajax({
      //     method: 'post',
      //     url: '/order/mark',
      //     data: reqBody
      //   })
      // }
      // catch(err){
      //   console.log('handleOk: ', err);
      // }
      // finally{
      //   this.loading = false
      //   this.dialogVisible = false
      //   this.$emit('ok')
      // }
      setTimeout(() => {
        this.loading = false
        this.dialogVisible = false
        this.$emit('confirm')
      }, 2000);

    }
  },
  computed: {

  },
  mounted () {

  },
  watch: {
    visible (val) {
      this.dialogVisible = val
    }

  }
}
</script>
<style scoped lang='css'>
</style>