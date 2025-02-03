<template>
  <div>
    <h2>Diary List</h2>

    <!-- 검색 UI -->
    <div class="search-bar">
      <!-- 검색 필터 -->
      <select v-model="searchFilter">
        <option value="title">Title</option>
        <option value="content">Content</option>
      </select>

      <!-- 검색어 입력 -->
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search diaries"
      />
      <button @click="searchDiaries">Search</button>
    </div>

    <!-- 다이어리 목록 -->
    <ul>
      <li v-for="entry in diaries" :key="entry.id">
        <strong>
          <router-link :to="`/edit/${entry.id}`">{{ entry.title }}</router-link>
        </strong>
        <br />
        {{ entry.content }}<br />
        <em>{{ new Date(entry.created_at).toLocaleString() }}</em>
      </li>
    </ul>

    <!-- 페이지네이션 -->
    <div class="pagination">
      <button
        v-for="page in totalPages"
        :key="page"
        @click="changePage(page)"
        :class="{ active: page === currentPage }"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>

<script>
import apiClient from "../services/api.js";

export default {
  name: "DiaryList",
  data() {
    return {
      diaries: [], // 다이어리 데이터
      searchQuery: "", // 검색어
      searchFilter: "title", // 기본 검색 필터
      currentPage: 1, // 현재 페이지
      totalPages: 1, // 총 페이지 수
      limit: 15, // 페이지당 항목 수
    };
  },
  created() {
    this.fetchDiaries(); // 초기 데이터 로드
  },
  methods: {
    // 다이어리 데이터 가져오기
    fetchDiaries() {
      const params = {
        search: this.searchQuery,
        filter: this.searchFilter, // 검색 필터 추가
        page: this.currentPage,
        limit: this.limit,
      };

      apiClient
        .get("/diary", { params })
        .then((response) => {
          console.log("Fetched diaries:", response.data);
          this.diaries = response.data.data; // 현재 페이지 데이터
          this.totalPages = Math.ceil(response.data.total / this.limit); // 총 페이지 계산
        })
        .catch((error) => {
          console.error("Error fetching diaries:", error.message);
        });
    },
    // 검색 실행
    searchDiaries() {
      this.currentPage = 1; // 검색 시 첫 페이지로 이동
      this.fetchDiaries();
    },
    // 페이지 변경
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.fetchDiaries();
      }
    },
  },
};
</script>

<style scoped>
.search-bar {
  margin-bottom: 20px;
}
.search-bar input {
  padding: 8px;
  width: 300px;
  margin-right: 10px;
}
.search-bar select {
  padding: 8px;
  margin-right: 10px;
}
.search-bar button {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.search-bar button:hover {
  background-color: #0056b3;
}
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 10px;
}
.pagination button {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.pagination button.active {
  background-color: #0056b3;
  font-weight: bold;
}
.pagination button:hover {
  background-color: #0056b3;
}
</style>