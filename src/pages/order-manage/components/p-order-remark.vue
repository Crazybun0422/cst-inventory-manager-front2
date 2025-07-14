<!--
* @description  参数1
* @fileName  p-order-remark
* @author wjp
* @date 2024-06-06 16:43:55
!-->
<template>
  <div id="p-order-remark" class="p-order-remark">
    <el-dialog
      :title="$t('message.orderManagement.orderNotes')"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <el-row>
        <el-card>
          <div slot="header" class="clearfix">
            <span>{{ $t('common.add') }}</span>
          </div>
          <el-form :model="form" label-width="80px">
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item
                  :label="$t('message.orderManagement.notes')"
                  prop="remark"
                >
                  <el-input
                    type="textarea"
                    rows="2"
                    v-model="form.remark"
                    maxlength="50"
                    show-word-limit
                    :placeholder="
                      $t('message.orderManagement.notesPlaceholder')
                    "
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="remarkUser">
                  <el-button type="primary" @click="onSubmit">{{
                    $t('common.save')
                  }}</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </el-row>
      <el-row>
        <el-card>
          <div slot="header" class="clearfix">
            <span>{{ $t('message.orderManagement.notesList') }}</span>
          </div>
          <el-table :data="currentTableData" style="width: 100%" height="250">
            <el-table-column prop="date" :label="$t('common.date')" width="180">
            </el-table-column>
            <el-table-column
              prop="name"
              :label="$t('common.operator')"
              width="180"
            >
            </el-table-column>
            <el-table-column prop="remark" label="备注"> </el-table-column>
          </el-table>
        </el-card>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose"> {{ $t('common.cancel') }} </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'p-order-remark',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    tableData: {
      type: Array,
      default: () => []
    }
  },
  components: {

  },
  data () {
    return {
      reflashFlag: false,
      dialogVisible: false,
      form: {
        remark: ''
      },
      currentTableData: []
    }
  },
  methods: {
    onSubmit () {
      this.currentTableData.push({
        date: new Date().toLocaleString(),
        name: 'admin',
        remark: this.form.remark
      })
      this.reflashFlag = true
    },
    handleClose () {
      this.$emit('close', this.reflashFlag)
    }
  },
  computed: {

  },
  mounted () {

  },
  watch: {
    visible (val) {
      this.dialogVisible = val
      this.currentTableData = this.tableData
    }
  }
}
</script>
<style scoped lang='css'>
</style>