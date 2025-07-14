import { mapActions } from 'vuex';
import { dsAddStorage } from "@/common/common-func";

export default {
  data () {
    return {
    }
  },
  computed: {
  },
  methods: {
    ...mapActions('storeManagement', ['fetchStorageListIfNeeded', "fetchStorageDefinitionListIfNeeded",
      "fetchStorageList", "fetchStorageDefinitionList"]),
    dsAddStorage,
    async getAssociatedStorageList (provider_uuid = '') {
      // 获取已关联的仓储列表
      const resData = await this.fetchStorageListIfNeeded({ username: localStorage.getItem(this.config[this.roleType].userName), provider_uuid });
      return resData
    },
    async getStorageDefinitionList (provider_uuid) {
      const resData = await this.fetchStorageDefinitionListIfNeeded(
        { username: localStorage.getItem(this.config[this.roleType].userName), provider_uuid }
      );
      return resData
    },

    dsAddStorageAndReflashStorageList (storageData) {
      // 在实现ds新增仓储的同时实现重置Vuex中的仓储列表
      return new Promise((resolve, reject) => {
        this.dsAddStorage(storageData).then(res => {
          this.fetchStorageList({ username: localStorage.getItem(this.config[this.roleType].userName), provider_uuid: storageData.provider_uuid });
          resolve(res)
        }).catch((error) => {
          reject(error)
        })
      })
    }
    // TODO：实现增加仓储定义时的重置
  }
}