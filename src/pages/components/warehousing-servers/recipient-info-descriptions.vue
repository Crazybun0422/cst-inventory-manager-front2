<template>
  <el-descriptions :column="2" size="medium" border>
    <el-descriptions-item :label="$t('message.orderManagement.consignee')">
      {{ recipient_info?.recipient_name }}
    </el-descriptions-item>

    <el-descriptions-item :label="$t('common.phone')">
      {{ recipient_info?.recipient_phone }}
    </el-descriptions-item>
    <el-descriptions-item :label="$t('common.country')">
      {{ recipient_info?.country }}
    </el-descriptions-item>
    <el-descriptions-item :label="$t('common.mobilePhone')">
      {{ recipient_info?.recipient_mobile }}
    </el-descriptions-item>

    <el-descriptions-item :label="$t('common.stateProvince')">
      {{ recipient_info?.state }}
    </el-descriptions-item>
    <el-descriptions-item :label="$t('message.orderInfo.cityLabel')">
      {{ recipient_info?.city }}
    </el-descriptions-item>
    <el-descriptions-item label="地区">
      {{ recipient_info?.area }}
    </el-descriptions-item>
    <el-descriptions-item label="房号">
      {{ recipient_info?.house_number }}
    </el-descriptions-item>
    <el-descriptions-item label="收货地址1">
      {{ recipient_info?.address_1 }}
    </el-descriptions-item>
    <el-descriptions-item label="收货地址2">
      {{ recipient_info?.address_2 }}
    </el-descriptions-item>
    <el-descriptions-item :label="$t('message.orderInfo.zipCodeLabel')">
      {{ recipient_info?.zip_code }}
    </el-descriptions-item>
    <el-descriptions-item
      :label="$t('message.orderManagement.nameOfReceivingCompany')"
    >
      {{ recipient_info?.company_name }}
    </el-descriptions-item>
    <el-descriptions-item label="电子邮件地址">
      {{ recipient_info?.recipient_email }}
    </el-descriptions-item>
    <el-descriptions-item label="货到付款类型">
      {{ recipient_info?.cod_type }}
    </el-descriptions-item>

    <el-descriptions-item label="货到付款金额">
      {{ recipient_info?.cod_amount }}
    </el-descriptions-item>
    <el-descriptions-item label="IOSS号码（欧洲销售税号）">
      {{ recipient_info?.ioss_number }}
    </el-descriptions-item>
    <el-descriptions-item label="增值税号码">
      {{ recipient_info?.vat_number }}
    </el-descriptions-item>
  </el-descriptions>
</template>

<script>
export default {
  name: 'RecipientInfo',
  props: {
    recipient_info: {
      type: Object,
      default: () => { }
    }
  }
};
</script>
