// pdfDownloadMixin.js
export default {
  methods: {
    getPrintPdf (data) {
      for (const [fileName, fileUrl] of Object.entries(data)) {
        const urlObj = new URL(fileUrl);
        const urlPath = '/api-prefix' + urlObj.pathname + urlObj.search;
        const params = new URLSearchParams(urlObj.search);
        const filenameWithExtension = params.get('filename');
        const filenameId = filenameWithExtension.split('.')[0];

        this.$ajax({
          url: urlPath,
          method: 'get',
          responseType: 'blob'
        }).then(res => {
          const pdfBlob = new Blob([res], { type: 'application/pdf' });
          const downloadUrl = window.URL.createObjectURL(pdfBlob);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = fileName + '-' + filenameId;
          document.body.appendChild(link);
          link.click();

          document.body.removeChild(link);
          window.URL.revokeObjectURL(downloadUrl);
        }).catch(error => {
          console.error('下载 PDF 文件时出错:', error);
        });
      }
    },
    getFileIndependently (params, fileType = 'pdf') {
      // 此函数在下载完成后会删除文件，一般用于导出 p使用是需要携带providerUuid
      let fileTypeMap = {
        pdf: 'application/pdf',
        excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
      this.$ajax({
        url: '/api-prefix/api/get-file-independently/',
        method: 'get',
        responseType: 'blob', // 确保以 blob 类型接收响应数据
        roleType: this.roleType,
        params: params
      }).then(res => {
        // 创建 Blob 对象
        const excelBlob = new Blob([res], { type: fileTypeMap[fileType] });

        // 创建临时下载链接
        const downloadUrl = window.URL.createObjectURL(excelBlob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = params.filename; // 设置下载的文件名
        document.body.appendChild(link);
        link.click();

        // 清理并移除链接
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      }).catch(error => {
        console.error('下载 Excel 文件时出错:', error);
      });
    }

  }
}
