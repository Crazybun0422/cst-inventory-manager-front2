import { config } from '@/common/commonconfig'

export const configMixin = {
  data () {
    return { config: config }
  },
  computed: {
    roleType () {
      return this.$getRoleType(this.$route.path)
    },
    dsCurrentProviderUuid () {
      return this.$store.state.user.dsCurrentProviderUuid
    },
    providerUuidBySelectStore () {
      return this.$store.state.shopProviderUuid.shopInfo.provider_uuid // 这是p当前选择门店的p_uuid
    },
  },
}
