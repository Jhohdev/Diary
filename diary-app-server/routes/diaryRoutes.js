const express = require('express');
const router = express.Router();
const db = require('../db/connection'); // MySQL 연결
const multer = require('multer'); // multer를 가져옵니다.

// Multer 설정: 파일 업로드 처리
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // 업로드된 파일 저장 경로
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // 파일 이름 설정
  },
});
const upload = multer({ storage });

router.get('/diary', async (req, res) => {
  console.log('GET /diary called'); // 라우트 호출 확인
  const { search, filter } = req.query;

  console.log('Search Parameter:', search); // 검색어 확인
  console.log('Filter Parameter:', filter); // 필터 확인

  try {
    let query = 'SELECT * FROM diary';
    const params = [];

    if (search && search.trim()) {
      if (filter === 'title') {
        query += ' WHERE title LIKE ?';
        params.push(`%${search.trim()}%`);
      } else if (filter === 'content') {
        query += ' WHERE content LIKE ?';
        params.push(`%${search.trim()}%`);
      } else {
        console.log('Invalid filter provided.');
      }
    }

    console.log('Generated Query:', query); // SQL 쿼리 로그
    console.log('Query Params:', params); // SQL 파라미터 로그

    const [rows] = await db.execute(query, params);
    console.log('Query Result:', rows); // SQL 결과 로그

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching diaries:', error.message);
    res.status(500).json({ error: 'Failed to fetch diaries' });
  }
});

// GET 요청: 특정 다이어리 가져오기
router.get('/diary/:id', async (req, res) => {
  const diaryId = req.params.id;

  try {
    console.log('GET request for diary ID:', diaryId); // 라우트 호출 확인
    const [rows] = await db.execute('SELECT * FROM diary WHERE id = ?', [diaryId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Diary not found' });
    }

    console.log('Fetched Data:', rows[0]); // 데이터베이스에서 가져온 데이터
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error fetching diary:', error.message);
    res.status(500).json({ error: 'Failed to fetch diary' });
  }
});

// POST 요청: 새로운 다이어리 작성
router.post('/diary', upload.single('photo'), async (req, res) => {
  try {
    const { title, content } = req.body;
    const photoPath = req.file ? req.file.path : null;

    const [result] = await db.execute(
      'INSERT INTO diary (title, content, photo_path) VALUES (?, ?, ?)',
      [title, content, photoPath]
    );

    console.log('Inserted Diary ID:', result.insertId); // 삽입된 데이터 ID
    res.status(201).json({ message: '다이어리가 성공적으로 저장되었습니다!' });
  } catch (error) {
    console.error('Error in POST /diary:', error.message);
    res.status(500).json({ message: '서버에서 오류가 발생했습니다.' });
  }
});

// PUT 요청: 다이어리 수정
router.put('/diary/:id', upload.single('photo'), async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const photoPath = req.file ? req.file.path : null;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required.' });
  }

  try {
    const query = photoPath
      ? 'UPDATE diary SET title = ?, content = ?, photo_path = ? WHERE id = ?'
      : 'UPDATE diary SET title = ?, content = ? WHERE id = ?';

    const params = photoPath
      ? [title, content, photoPath, id]
      : [title, content, id];

    const [result] = await db.execute(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Diary not found.' });
    }

    res.status(200).json({ message: 'Diary updated successfully.' });
  } catch (error) {
    console.error('Error updating diary:', error.message);
    res.status(500).json({ error: 'Failed to update diary' });
  }
});

// DELETE 요청: 다이어리 삭제
router.delete('/diary/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.execute('DELETE FROM diary WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Diary not found.' });
    }

    res.status(200).json({ message: 'Diary deleted successfully.' });
  } catch (error) {
    console.error('Error deleting diary:', error.message);
    res.status(500).json({ error: 'Failed to delete diary' });
  }
});

router.delete('/diary/:id', async (req, res) => {
  const { id } = req.params;

  try {
    console.log('DELETE request for diary ID:', id); // 삭제 요청 로그
    const [result] = await db.execute('DELETE FROM diary WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Diary not found.' });
    }

    console.log('Diary deleted successfully, ID:', id);
    res.status(200).json({ message: 'Diary deleted successfully.' });
  } catch (error) {
    console.error('Error deleting diary:', error.message);
    res.status(500).json({ error: 'Failed to delete diary' });
  }
});

module.exports = router;