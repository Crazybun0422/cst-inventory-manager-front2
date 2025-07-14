<!--
* @description  参数1
* @fileName  warehousing
* @author wjp
* @date 2023-05-29 22:23:14
!-->
<template>
  <div id="warehousing">
    <el-row type="flex" justify="space-between">
      <el-col :span="4">
        <span class="warehousing-title">{{
          $t('message.storage.warehouse')
        }}</span>
      </el-col>
      <el-col :span="3">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="small"
          @click="showModal(null)"
        >
          {{ $t('message.storage.associatedWarehousing') }}
        </el-button>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-row>
      <el-col :span="6">
        <el-input
          v-model.trim="warehousingName"
          clearable
          :placeholder="$t('message.storage.namePlaceholder')"
        ></el-input>
      </el-col>
    </el-row>
    <div class="warehousing-info-list">
      <el-card
        class="box-card"
        v-for="(warehousingInfo, index) in warehousingInfoList"
        :key="index"
      >
        <el-descriptions
          :title="$t('message.storage.warehouseInfo')"
          :column="1"
        >
          <el-descriptions-item
            :label="$t('message.storage.warehousingName')"
            >{{ warehousingInfo.name }}</el-descriptions-item
          >
          <!-- <el-descriptions-item label="仓库代码">{{
            warehousingInfo.code
          }}</el-descriptions-item> -->
          <el-descriptions-item :label="$t('message.storage.inventory')">
            <el-tag
              size="small"
              v-if="warehousingInfo.ava_inventory >= 5000"
              type="success"
            >
              {{ warehousingInfo.ava_inventory }}
            </el-tag>
            <el-tag
              size="small"
              v-else-if="
                warehousingInfo.ava_inventory >= 1000 &&
                warehousingInfo.ava_inventory < 5000
              "
              type="warning"
            >
              {{ warehousingInfo.ava_inventory }}
            </el-tag>
            <el-tag size="small" v-else type="danger">
              {{ warehousingInfo.ava_inventory }}
            </el-tag>
          </el-descriptions-item>
          <!-- <el-descriptions-item :label="$t('message.myAccount.location')">
            {{ warehousingInfo.location }}
          </el-descriptions-item> -->
        </el-descriptions>
        <!-- <div class="edit-btn">
          <el-button
            type="primary"
            round
            icon="el-icon-edit"
            size="small"
            @click="showModal(warehousingInfo)"
            >编辑
          </el-button>
        </div> -->
      </el-card>
    </div>
    <!-- <WarehousingForm
      :visible="relationWarehousingVisible"
      :currentData="currentData"
      :provider_uuid="provider_uuid"
      @close="onCloseModal"
      @getData="getWhDataList"
    ></WarehousingForm> -->
    <RelationWarehousing
      :visible="relationWarehousingVisible"
      @close="onCloseModal"
      @getData="getWarehousing"
    ></RelationWarehousing>
  </div>
</template>

<script>
import { getLanguage } from '@/common/language'
import WarehousingForm from '@/components/warehousingForm.vue'
import { toLoginPage } from '@/common/common-func'
import RelationWarehousing from '@/pages/warehousing-servers/components/relation-warehousing.vue'
const langType = getLanguage()
export default {
  name: 'warehousing',
  props: {},
  data () {
    return {
      relationWarehousingVisible: false,
      warehousingName: '',
      warehousingInfoList: [],
      currentData: {},
      provider_uuid: ''
    }
  },
  watch: {
    provider_uuid: {
      handler (value) {
        this.getWarehousing()
      }
    }
  },
  components: {
    WarehousingForm,
    RelationWarehousing
  },
  methods: {
    getWarehousing () {
      if (!this.provider_uuid) {
        // 没有相关信息则返回登录
        // this.$router.push("/login")
        const loginPath = toLoginPage(this.roleType)
        this.$router.push(loginPath)
        return
      }
      this.$ajax({
        url: '/api-prefix/api/storage/query-storage',
        method: 'get'
      })
        .then((res) => {
          if (this.$isRequestSuccessful(res.code)) {
            const whDataList = res.data.map((item) => ({
              code: item.code,
              name: item.name,
              location: item.location,
              ava_inventory: item.ava_inventory,
              storage_define_uuid: item.storage_define_uuid
            }))
            this.warehousingInfoList = whDataList
          }
        })
        .catch((error) => {
          console.error(error)
        })
    },
    // 弹窗
    showModal (info) {
      this.relationWarehousingVisible = true
      if (info) {
        this.currentData = info
      } else {
        this.currentData = {}
      }
    },
    onCloseModal () {
      this.relationWarehousingVisible = false
    }
  },
  mounted () {
    this.provider_uuid = this.$store.state.shopProviderUuid.shopInfo
      .provider_uuid
      ? this.$store.state.shopProviderUuid.shopInfo.provider_uuid
      : localStorage.getItem('shop_provider_uuid')
  }
}
</script>
<style scoped lang="scss">
#warehousing {
  width: 100%;
  height: 100%;
}
.warehousing-title {
  font-size: 18px;
  line-height: 32px;
}

//数据展示区样式-----start-----
.warehousing-info-list {
  display: flex;
  padding: 20px;
  // justify-content: space-evenly;
  flex-wrap: wrap;
}
::v-deep .el-card {
  width: 30%;
  margin: 20px;
}
.edit-btn {
  display: flex;
  justify-content: flex-end;
}
//数据展示区样式-----end-----
::v-deep .el-divider--horizontal {
  margin: 15px 0;
}
</style>
