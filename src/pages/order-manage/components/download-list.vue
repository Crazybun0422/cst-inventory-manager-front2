<!--
* @description  参数1
* @fileName  download-list
* @author wjp
* @date 2024-01-08 22:22:47
!-->
<template>
  <div id="download-list" class="download-list">
    <el-dialog
      :title="$t('message.orderManagement.listToBeDownloaded')"
      :visible.sync="dialogFormVisible"
      width="30%"
      :before-close="handleClose"
      v-loading="loading"
    >
      <el-table :data="downloadFileList" style="width: 100%" max-height="300">
        <el-table-column prop="name" :label="$t('common.fileName')" width="230">
        </el-table-column>
        <el-table-column prop="type" :label="$t('common.status')" width="120">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type === 'pending'" type="warning">{{
              $t('message.orderManagement.pending')
            }}</el-tag>
            <el-tag v-else-if="scope.row.type === 'completed'" type="success">{{
              $t('message.orderManagement.completed')
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="action"
          :label="$t('common.operation')"
          width="120"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="downloadFile(scope.row)"
              >{{ $t('common.download') }}</el-button
            >
            <!-- <el-button type="text" size="small">{{$t('common.delete')}}</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'download-list',
  props: {
    visible: { type: Boolean, default: false },
    downloadObject: { type: Object, default: () => { } }
  },
  components: {

  },
  data () {
    return {
      dialogFormVisible: false,
      downloadFileList: [],
      loading: false
    }
  },
  methods: {
    async downloadFile (file) {
      try {
        this.loading = true
        const fileName = file.name
        const res = await this.$ajax({
          url: '/api-prefix/api/get-file-independently/',
          method: 'get',
          responseType: 'blob',
          params: {
            filename: fileName
          }
        })
        const blob = new Blob([res], { type: "application/vnd.ms-excel" });
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName; // 设置下载的文件名
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl); // 清除内存中的引用
        // 删除列表中对应的文件
        const index = this.downloadFileList.findIndex(item => item.name === fileName)
        this.downloadFileList.splice(index, 1)
      }
      catch (err) {
        console.error(err)
      }
      finally {
        this.loading = false
      }

    },
    handleClose () {
      this.$emit('close')
    },
    formatDownloadList (downloadObject) {
      this.downloadFileList = []
      for (let status in downloadObject) {
        let files = downloadObject[status];
        files.forEach(file => {
          this.downloadFileList.push({ name: file, type: status });
        });
      }
    }
  },
  computed: {

  },
  mounted () {

  },
  watch: {
    visible: {
      handler (newValue) {
        this.dialogFormVisible = newValue
        this.formatDownloadList(this.downloadObject)

      },
      immediate: true
    }

  }
}
</script>
<style scoped lang='css'>
</style>