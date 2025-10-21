<template>
  <el-collapse-transition>
    <el-card
      v-show="visible"
      class="transition-box notice-list-style"
      v-loading="alarmLoading"
    >
      <div slot="header" class="clearfix" style="line-height: 15px">
        <span style="color: var(--custom-font-color)">
          {{ $t('common.messageList') }}
        </span>
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          icon="el-icon-close"
          size="medium"
          @click="handleClose"
        />
      </div>
      <div v-if="noticeList.length > 0">
        <div class="alarm-info-container">
          <el-row
            v-for="(item, index) in noticeList"
            :key="index"
            class="notice-item"
          >
            <el-col :span="24">
              <div class="alarm-info">
                <div class="alarm-header">
                  <div class="alarm-title">
                    <el-badge
                      is-dot
                      class="alarm-title alarm-badge"
                      :hidden="item.alarm_read"
                    >
                      <span class="el-icon-warning-outline">
                        {{ item.alarm_name[$languageType] }}
                      </span>
                    </el-badge>
                  </div>
                  <div class="button-group">
                    <el-tooltip
                      :content="$t('message.myAccount.markRead')"
                      placement="top"
                      :append-to-body="true"
                      popper-class="alarm-list-tooltip"
                    >
                      <el-button
                        style="padding: 0px 0px; font-size: 20px; margin-right: 10px"
                        icon="el-icon-finished"
                        v-if="!item.alarm_read"
                        @click="markRead(item.entity_id)"
                        class="mark-read-button"
                      />
                    </el-tooltip>
                    <el-tooltip
                      :content="$t('common.delete')"
                      placement="top"
                      :append-to-body="true"
                      popper-class="alarm-list-tooltip"
                    >
                      <el-button
                        style="padding: 0px 0px; color: red; font-size: 20px"
                        icon="el-icon-delete"
                        @click="deleteAlarm(item.entity_id)"
                        class="delete-button"
                      />
                    </el-tooltip>
                  </div>
                </div>
                <el-tooltip
                  :content="item.alarm_content[$languageType]"
                  placement="left-end"
                  :append-to-body="true"
                  popper-class="alarm-list-tooltip"
                >
                  <div class="alarm-content text-ellipsis">
                    {{ item.alarm_content[$languageType] }}
                  </div>
                </el-tooltip>
                <div class="alarm-content alarm-time">
                  {{ item.alarm_time }}
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <el-row type="flex" justify="end" style="margin-top: 10px">
          <el-pagination
            small
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="alarmQueryParams.page_number"
            :page-sizes="[10, 50, 100]"
            :page-size="alarmQueryParams.page_size"
            layout="total,sizes, prev, pager, next"
            :total="total"
          />
        </el-row>
      </div>
      <div v-else>
        <el-empty :description="$t('common.noDataAvailable')" />
      </div>
    </el-card>
  </el-collapse-transition>
</template>

<script>
import { getAlarmList } from '@/common/common-func'
import { config } from '@/common/commonconfig'

export default {
  name: 'AlarmList',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    roleType: {
      type: String,
      default: ''
    },
    providerUuid: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      noticeList: [],
      alarmLoading: false,
      alarmQueryParams: {
        page_size: 10,
        page_number: 1
      },
      total: 0,
      lastUnreadCount: 0
    }
  },
  watch: {
    visible (next) {
      if (next) {
        this.refresh()
      }
    },
    providerUuid () {
      this.resetAndRefresh()
    }
  },
  methods: {
    getAlarmList,
    async markRead (alarmId) {
      if (!alarmId) return
      this.alarmLoading = true
      try {
        const res = await this.$ajax({
          url: '/api/alarms/mark_read/',
          method: 'put',
          data: { alarm_id: alarmId },
          roleType: this.resolveRoleType()
        })
        if (this.$isRequestSuccessful(res.code)) {
          await this.refresh()
        }
      } catch (error) {
        console.error(error)
      } finally {
        this.alarmLoading = false
      }
    },
    async deleteAlarm (alarmId) {
      if (!alarmId) return
      this.alarmLoading = true
      try {
        const res = await this.$ajax({
          url: '/api/alarms/delete/',
          method: 'delete',
          data: { alarm_ids: [alarmId] },
          roleType: this.resolveRoleType()
        })
        if (this.$isRequestSuccessful(res.code)) {
          this.alarmQueryParams.page_number = 1
          await this.refresh()
        }
      } catch (error) {
        console.error(error)
      } finally {
        this.alarmLoading = false
      }
    },
    handleSizeChange (val) {
      this.alarmQueryParams.page_size = val
      this.refresh()
    },
    handleCurrentChange (val) {
      this.alarmQueryParams.page_number = val
      this.refresh()
    },
    async refresh () {
      const role = this.resolveRoleType()
      const params = { ...this.alarmQueryParams }
      if (config.pRoleList.includes(role) && this.providerUuid) {
        params.provider_uuid = this.providerUuid
      }
      this.alarmLoading = true
      try {
        const res = await this.getAlarmList(params, { roleType: role })
        if (this.$isRequestSuccessful(res.code)) {
          const result = Array.isArray(res.data?.result) ? res.data.result : []
          const unreadCandidates = [
            res?.data?.unread_count,
            res?.data?.unread,
            res?.data?.unreadTotal,
            res?.data?.unread_total
          ].map((val) => (val === undefined || val === null ? null : Number(val)))
          const unreadFromResponse = unreadCandidates.find(
            (val) => typeof val === 'number' && !Number.isNaN(val)
          )
          const fallbackUnread = result.reduce(
            (count, item) => count + (!item?.alarm_read ? 1 : 0),
            0
          )
          const unread = unreadFromResponse != null ? unreadFromResponse : fallbackUnread
          this.noticeList = result
          this.total = res.data?.total || 0
          this.emitUnreadChange(unread)
        }
      } catch (error) {
        console.error(error)
      } finally {
        this.alarmLoading = false
      }
    },
    resetAndRefresh () {
      this.alarmQueryParams.page_number = 1
      this.refresh()
    },
    handleClose () {
      this.$emit('close')
    },
    emitUnreadChange (count) {
      if (count === this.lastUnreadCount) return
      this.lastUnreadCount = count
      this.$emit('unread-change', count)
    },
    resolveRoleType () {
      if (this.roleType) return this.roleType
      if (typeof this.$store?.state?.user?.role === 'string') {
        return this.$store.state.user.role
      }
      return ''
    }
  }
}
</script>

<style scoped lang="scss">
.notice-list-style {
  position: absolute;
  right: 0;
  top: 60px;
  width: 420px;
  max-width: 90vw;
  height: calc(100vh - 64px);
  z-index: 9999;
  box-shadow:
    0 6px 16px rgba(0, 0, 0, 0.08),
    0 9px 28px rgba(0, 0, 0, 0.05),
    0 12px 48px rgba(0, 0, 0, 0.03);
  border-radius: 12px;
  border: none;
  background-color: var(--custom-background-color, #fff);
  overflow: hidden;
}

.alarm-info-container {
  height: calc(100vh - 230px);
  overflow-y: auto;
}

.transition-box {
  transition: all 0.5s;
  overflow: hidden;
}

.alarm-info {
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-bottom: 1px solid var(--custom-border-color);
}

.alarm-title {
  span {
    font-weight: bold;
  }

  .el-icon-warning-outline:before {
    color: var(--custom-color-danger);
    margin-right: 5px;
  }
}

.alarm-title,
.button-group {
  display: flex;
  justify-content: space-between;
}

.alarm-time {
  color: var(--custom-font-color2);
  font-size: 14px;
}

.button-group {
  visibility: hidden;
  float: right;

  ::v-deep .el-button {
    border-width: 0px;
  }
}

.alarm-info:hover .button-group {
  visibility: visible;
}

.alarm-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  line-height: 40px;
}

.alarm-content {
  margin-top: 10px;
  white-space: pre-line;
  width: 100%;
  margin-left: 10px;
  line-height: 40px;
}

.alarm-badge {
  ::v-deep .el-badge__content {
    top: 4px;
    right: -4px;
    height: 10px;
    width: 10px;
  }
}

::v-deep .el-card__body {
  padding-bottom: 0px;
}
</style>

<style lang="scss">
.alarm-list-tooltip {
  z-index: 12000 !important;
}
</style>
