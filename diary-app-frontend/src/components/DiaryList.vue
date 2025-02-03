<template>
  <div>
    <h2 @click="reset">Diary List</h2>

    <!-- 검색 UI -->
    <button @click="checkFiltter">검색하기</button>
    <button @click="checkListFiltter">리스트보기</button>
      <div class="search-bar" v-if="chkFiltter == true">
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

    <!-- 검색이 실행되었고, 결과가 있는 경우에만 리스트 표시 -->
    <ul v-if="(searchClicked || chkListFiltter) && diaries.length > 0">
      <li v-for="entry in diaries" :key="entry.id">
        <strong>
          <router-link :to="`/edit/${entry.id}`">{{ entry.title }}</router-link>
        </strong>
        <br />
        {{ entry.content }}<br />
        <em>{{ new Date(entry.created_at).toLocaleString() }}</em>
      </li>
    </ul>

    <!-- 검색 결과가 없거나 검색을 실행하지 않은 경우 캘린더 표시 -->
    <CalendarList v-else />

    <!-- 페이지네이션 (검색이 실행되었고, 결과가 있는 경우에만 표시) -->
    <div class="pagination" v-if="(searchClicked || chkListFiltter) && diaries.length > 0">
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
import CalendarList from "./CalendarList.vue";

export default {
  name: "DiaryList",
  components: {
    CalendarList,
  },
  data() {
    return {
      diaries: [], // 다이어리 데이터
      searchQuery: "", // 검색어
      searchFilter: "title", // 기본 검색 필터
      currentPage: 1, // 현재 페이지
      totalPages: 1, // 총 페이지 수
      limit: 15, // 페이지당 항목 수
      searchClicked: false, // 검색 버튼을 눌렀는지 여부 체크
      chkFiltter: false, // 검색 버튼을 눌렀는지 여부 체크
      chkListFiltter: false, // 검색 버튼을 눌렀는지 여부 체크
    };
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
      this.searchClicked = true; // 검색 버튼을 눌렀음을 표시
      this.currentPage = 1; // 검색 시 첫 페이지로 이동
      this.fetchDiaries();
    },
    checkFiltter() {
      this.chkFiltter = true; // 검색하기 버튼을 눌렀음을 표시
    },
    checkListFiltter() {
      this.chkListFiltter = true; // 검색하기 버튼을 눌렀음을 표시
      this.fetchDiaries(); // 리스트 보기 버튼을 누르면 데이터 로드
    },
    // 초기화
    reset() {
      this.searchClicked = false; // 검색 버튼을 눌렀음을 표시
      this.chkFiltter = false; // 검색하기 버튼을 눌렀음을 표시
      this.chkListFiltter = false; // 검색하기 버튼을 눌렀음을 표시
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