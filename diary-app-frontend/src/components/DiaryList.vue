<template>
  <div>
    <h2>Diary List</h2>

    <!-- 검색 UI -->
    <div class="search-bar">
      <select v-model="searchFilter">
        <option value="title">Title</option>
        <option value="content">Content</option>
      </select>
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
        <!-- 삭제 버튼 -->
        <button @click="deleteDiary(entry.id)">Delete</button>
      </li>
    </ul>
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
      searchFilter: "title", // 검색 필터 (기본값: title)
    };
  },
  created() {
    this.fetchDiaries(); // 초기 데이터 로드
  },
  methods: {
    // 다이어리 데이터 가져오기
    fetchDiaries(search = "", filter = "title") {
      console.log("Search Query Sent:", search, "Filter:", filter); // 검색어 및 필터 확인

      apiClient
        .get("/diary", { params: { search, filter } }) // 검색어와 필터 전달
        .then((response) => {
          console.log("Fetched diaries:", response.data); // 응답 확인
          this.diaries = response.data;
        })
        .catch((error) => {
          console.error("Error fetching diaries:", error.message);
        });
    },
    // 검색 실행
    searchDiaries() {
      this.fetchDiaries(this.searchQuery, this.searchFilter); // 검색어와 필터 전달
    },
    // 다이어리 삭제
    deleteDiary(id) {
      if (confirm("Are you sure you want to delete this diary?")) {
        apiClient
          .delete(`/diary/${id}`) // 삭제 요청
          .then(() => {
            alert("Diary deleted successfully.");
            this.fetchDiaries(); // 삭제 후 목록 갱신
          })
          .catch((error) => {
            console.error("Error deleting diary:", error.message);
            alert("Failed to delete diary.");
          });
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
ul {
  list-style: none;
  padding: 0;
}
ul li {
  margin-bottom: 10px;
}
ul li button {
  margin-top: 5px;
  padding: 5px 10px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
ul li button:hover {
  background-color: darkred;
}
</style>