const express = require('express');
const bodyParser = require('body-parser');
const diaryRoutes = require('./routes/diaryRoutes');

const app = express();
const PORT = 3000;
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:8080', // 프론트엔드 URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// JSON 및 URL-encoded 데이터 처리
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 정적 파일 제공 (업로드된 파일)
app.use('/uploads', express.static('uploads'));

// 라우터 등록
// app.use('/', diaryRoutes); // 라우터를 `/` 경로에 연결

// JSON 요청 파싱
app.use(bodyParser.json());

// 라우트 등록
// const diaryRoutes = require('./routes/diaryRoutes');
app.use('/api', diaryRoutes);
// 서버 실행
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});