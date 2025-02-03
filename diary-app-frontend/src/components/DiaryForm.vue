<template>
  <div>
    <h1>다이어리 작성</h1>
    <form @submit.prevent="submitDiary">
      <div>
        <label for="title">제목</label>
        <input v-model="title" type="text" id="title" required placeholder="제목을 입력하세요" />
      </div>
      <div>
        <label for="content">내용</label>
        <textarea v-model="content" id="content" required placeholder="내용을 입력하세요"></textarea>
      </div>
      <div>
        <label for="photo">사진 업로드</label>
        <input type="file" @change="handleFileUpload" accept="image/*" />
      </div>
      <button type="submit">작성</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'DiaryForm',
  data() {
    return {
      title: '',
      content: '',
      created_at: this.$route.query.date,
      photo: null, // 업로드할 파일 데이터
    };
  },
  methods: {
    handleFileUpload(event) {
      this.photo = event.target.files[0]; // 파일 데이터를 상태에 저장
    },
    getLocalDate() {
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // ✅ UTC → KST 변환
      return now.toISOString().split("T")[0]; // "YYYY-MM-DD" 형식
    },
    async submitDiary() {
      try {
        const formData = new FormData();
        formData.append("title", this.title);
        formData.append("content", this.content);

        if (this.photo) {
          formData.append("photo", this.photo);
        }

        // ✅ 현재 시간을 `YYYY-MM-DD HH:MM:SS` 형식으로 변환
        const selectedDate = this.$route.query.date || this.getLocalDate();
        formData.append("created_at", selectedDate);

        console.log("📌 [FRONTEND] 보낼 데이터:", {
          title: this.title,
          content: this.content,
          created_at: selectedDate,
          photo: this.photo,
        });

        await axios.post("http://localhost:3000/api/diary", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("✅ [FRONTEND] 응답 수신");
        alert("다이어리가 성공적으로 작성되었습니다!");
        this.$router.push("/");
      } catch (error) {
        console.error("❌ [FRONTEND] 다이어리 작성 중 오류:", error);
        alert("다이어리를 작성하는 데 문제가 발생했습니다.");
      }
    }
  },
};
</script>

<style>
/* 간단한 스타일 추가 */
form div {
  margin-bottom: 1rem;
}
</style>