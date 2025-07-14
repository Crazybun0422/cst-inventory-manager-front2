<!--
* @description  日志时间线  可以用于订单日志、物流产品日志等
* @fileName  log-list
* @author wjp
* @date 2024-06-06 16:56:37
!-->
<template>
  <div id="log-list" class="log-list">
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="35%"
      :before-close="handleClose"
    >
      <div style="height: 450px; overflow-y: scroll; padding: 20px">
        <el-timeline :reverse="true">
          <el-timeline-item
            v-for="(logInfo, index) in logInfoList"
            :key="index"
            color="#409EFF"
            :timestamp="logInfo.created_time"
            icon="el-icon-more"
          >
            <el-collapse class="custom-collapse">
              <el-row :gutter="24">
                <el-collapse-item>
                  <template slot="title">
                    <!-- <i class="header-icon el-icon-info"></i> -->
                    <!-- <el-tooltip
                      :content="logInfo.messages[$languageType]"
                      placement="top"
                    > -->
                    <div
                      style="
                        white-space: normal;
                        line-height: 1.6;
                        padding: 10px; /* 或者根据实际需要调整 */
                      "
                    >
                      {{ logInfo.messages[$languageType] }}
                    </div>
                    <!-- </el-tooltip> -->
                  </template>

                  <div
                    v-if="
                      logInfo.details && Object.keys(logInfo.details).length > 0
                    "
                    v-for="(value, key) in logInfo.details"
                    :key="key"
                  >
                    <el-col :span="12" v-if="key !== 'products'">
                      <div style="margin-bottom: 10px">
                        <span class="field-name"
                          >{{ logFieldMapping?.[key] }}:</span
                        >
                        <span class="old-data">
                          {{ value.old !== null ? value.old : 'null' }}</span
                        >
                        <i
                          class="el-icon-right new-data"
                          style="margin: 0 5px; color: #67c23a"
                        ></i>
                        <span class="new-data">
                          {{ value.new !== null ? value.new : 'null' }}</span
                        >
                      </div>
                    </el-col>
                    <el-col :span="24" v-else>
                      <div style="margin-bottom: 10px">
                        <div
                          v-if="value?.old && value?.old.length > 0"
                          class="product-flex"
                        >
                          <span class="field-name"
                            >{{ logFieldMapping?.[key] }}:
                          </span>
                          <div class="old-data">
                            <div
                              v-for="(product, index) in value.old"
                              :key="`old-${product.pid}`"
                              class="product-info"
                            >
                              <!-- <div v-if="product.old && product.old.length > 0">
                                <div
                                  v-for="oldVariant in product.old"
                                  :key="oldVariant.vid"
                                > -->
                              <span class="sku">{{ product.sku }}:</span>
                              <span class="quantity">{{
                                product.quantity
                              }}</span>
                              <!-- </div>
                              </div> -->
                            </div>
                          </div>

                          <i
                            class="el-icon-right"
                            style="margin: 0 15px; color: #67c23a"
                          ></i>

                          <div class="new-data">
                            <div
                              v-for="(product, index) in value.new"
                              :key="`new-${product.pid}`"
                              class="product-info"
                            >
                              <!-- <div
                                v-if="
                                  product.variants &&
                                  product.variants.length > 0
                                "
                              >
                                <div
                                  v-for="variant in product.variants"
                                  :key="variant.vid"
                                > -->
                              <span class="sku">{{ product.sku }}:</span>
                              <span class="quantity">{{
                                product.quantity
                              }}</span>
                              <!-- </div>
                              </div> -->
                            </div>
                          </div>
                        </div>
                        <div v-else>No product changes.</div>
                      </div>
                    </el-col>
                  </div>
                </el-collapse-item>
              </el-row>
            </el-collapse>
          </el-timeline-item>
        </el-timeline>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose"> {{ $t('common.cancel') }} </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getLog } from '@/common/common-func'
import { logFieldMapping } from '@/common/field-maping'
export default {
  name: 'log-list',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    currentData: {
      type: Object,
      default: () => { }
    },
    title: {
      type: String,
      default: ''
    }
  },
  components: {},
  data () {
    return {
      dialogVisible: false,
      logInfoList: [],
      logFieldMapping
    }
  },
  methods: {
    getLog,
    handleClose () {
      this.$emit('close')
    },
    getLogList () {
      let queryParam = {
        related_id: this.currentData.order_id
      }
      this.getLog(queryParam).then((res) => {
        if (this.$isRequestSuccessful(res.code)) {
          this.logInfoList = res.data
        }
      })
    }
  },
  computed: {},
  mounted () { },
  watch: {
    visible (val) {
      this.dialogVisible = val
      if (val) {
        this.getLogList()
      }
    }
  }
}
</script>
<style scoped lang="scss">
::v-deep .custom-collapse .el-collapse-item,
::v-deep .custom-collapse .el-collapse-item__wrap {
  border-bottom: none !important; /* 移除边框 */
}

::v-deep .custom-collapse .el-collapse-item__header {
  border-bottom: none !important; /* 移除标题下的边框线 */
}
.product-flex {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.field-name {
  font-weight: bold;
  margin-right: 10px;
}
.old-data {
  color: #f56c6c;
}
.new-data {
  color: #67c23a;
}
.product-info {
  display: flex;
  flex-direction: column; /* 确保产品信息是上下排列的 */
  align-items: center; /* 水平居中 */
  justify-content: center; /* 垂直居中 */
  .sku {
    text-align: center; /* 文本居中显示 */
    margin-right: 5px;
  }
  .quantity {
    text-align: center; /* 文本居中显示 */
    margin-left: 5px; /* 适当间隔 */
  }
}
</style>
