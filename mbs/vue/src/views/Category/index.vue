<template>
  <div class="app-container">
    <div class="top-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px;margin-bottom: 15px;"
        type="primary"
        icon="el-icon-refresh"
        @click="updateHandle"
      >{{ $t('category.update_index') }}</el-button>
    </div>

    <tree-table :data="data" :eval-func="func" :eval-args="args" :expand-all="expandAll" border>
      <el-table-column label="分类名">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="ID">
        <template slot-scope="scope">
          <span style="color:sandybrown">{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="图片">
        <template slot-scope="scope">
          <img style="width: 80px; height: 80px" :src="scope.row.icon" :fit="'contain'" />
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
    </tree-table>
  </div>
</template>

<script>
/**
  Auth: Lei.j1ang
  Created: 2018/1/19-14:54
*/
import treeTable from "@/components/TreeTable";
import treeToArray from "../../utils/customEval";
import { fetchIndex, updateIndex } from "@/api/category";

export default {
  name: "CategoryIndex",
  components: { treeTable },
    filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        hidden: "danger"
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      func: treeToArray,
      expandAll: false,
      data: {},
      args: [null, null, "timeLine"]
    };
  },
  created() {
    this.getList();
  },
  methods: {
    message(row) {
      this.$message.info(row.event);
    },
    getList() {
      fetchIndex().then(response => {
        this.data = response.data.items;
      });
    },

    updateHandle() {
      updateIndex().then(response => {
        let res = response.data;
        if (res.success_code == 200) {
          this.$notify({
            title: "成功",
            message: "操作成功",
            type: "success",
            duration: 2000
          });
        } else {
          this.$notify({
            title: "失败",
            message: res.message,
            type: "info",
            duration: 2000
          });
        }
      });
    }
  }
};
</script>
