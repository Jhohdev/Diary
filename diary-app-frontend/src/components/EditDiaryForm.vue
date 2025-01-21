<template>
  <div>
    <h1 @click="goback()">다이어리 수정</h1>
    <form @submit.prevent="updateDiary">
      <label>
        제목:
        <input type="text" v-model="diary.title" required />
      </label>
      <label>
        컨텐츠:
        <textarea v-model="diary.content" required></textarea>
      </label>

      <!-- 기존 사진 또는 미리보기 표시 -->
      <div>
        <p>사진 미리보기:</p>
        <img
          v-if="previewPhoto"
          :src="previewPhoto"
          alt="New Preview"
          style="max-width: 200px; border: 1px solid #ccc; margin-bottom: 10px;"
        />
        <img
          v-else-if="diary.photoPath"
          :src="`http://localhost:3000/${diary.photoPath}`"
          alt="Current Photo"
          style="max-width: 200px; border: 1px solid #ccc; margin-bottom: 10px;"
        />
      </div>

      <!-- 커스텀 파일 선택 버튼 -->
      <div>
        <label for="file-upload" class="file-upload-label">
          사진 변경
        </label>
        <input id="file-upload" type="file" @change="onFileChange" class="file-input" />
      </div>

      <button type="submit">Update</button>
    </form>
    <!-- 목록으로 가기 버튼 -->
    <button @click="goToList">목록으로 가기</button>
    <button @click="deleteDiary" class="delete-button">다이어리 삭제</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      diary: {
        title: '',
        content: '',
        photoPath: '', // 기존 사진 경로
      },
      newPhoto: null, // 새로 선택한 사진 파일
      previewPhoto: null, // 새로 선택한 사진의 미리보기 URL
    };
  },
  async created() {
    const diaryId = this.$route.params.id;
    try {
      const response = await fetch(`http://localhost:3000/api/diary/${diaryId}`);
      const data = await response.json();
      this.diary = {
        title: data.title,
        content: data.content,
        photoPath: data.photo_path, // 서버에서 받은 기존 사진 경로
      };
    } catch (err) {
      alert('다이어리를 불러오지 못했습니다.');
    }
  },
  methods: {
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.newPhoto = file;

        // FileReader를 사용해 미리보기 생성
        const reader = new FileReader();
        reader.onload = (e) => {
          this.previewPhoto = e.target.result; // 미리보기 URL 업데이트
        };
        reader.readAsDataURL(file); // 파일 읽기
      }
    },
    async updateDiary() {
      const diaryId = this.$route.params.id;

      const formData = new FormData();
      formData.append('title', this.diary.title);
      formData.append('content', this.diary.content);

      if (this.newPhoto) {
        formData.append('photo', this.newPhoto); // 새로 선택한 사진 추가
      }

      try {
        const response = await fetch(`http://localhost:3000/api/diary/${diaryId}`, {
          method: 'PUT',
          body: formData,
        });

        if (response.ok) {
          alert('다이어리를 업데이트 했어요!');
          this.$router.push('/'); // 목록 페이지로 이동
        } else {
          const error = await response.json();
          alert(`Error: ${error.message}`);
        }
      } catch (err) {
        alert(`Request failed: ${err.message}`);
      }
    },
    goToList() {
      this.$router.push('/'); // 목록 페이지로 이동
    },
    goback() {
      this.$router.push('/'); // 목록 페이지로 이동
    },
    async deleteDiary() {
      const diaryId = this.$route.params.id;

      if (confirm('정말로 이 다이어리를 삭제하시겠습니까?')) {
        try {
          const response = await fetch(`http://localhost:3000/api/diary/${diaryId}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            alert('다이어리를 삭제했어요!');
            this.$router.push('/'); // 삭제 후 목록 페이지로 이동
          } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
          }
        } catch (err) {
          alert(`Request failed: ${err.message}`);
        }
      }
    },
  },
};
</script>

<style scoped>
.file-input {
  display: none; /* 파일 입력 필드를 숨김 */
}

.file-upload-label {
  display: inline-block;
  background-color: #007bff;
  color: white;
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  margin-bottom: 10px;
}
.file-upload-label:hover {
  background-color: #0056b3;
}
</style>