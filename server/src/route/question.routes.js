import express from 'express';
import questionController from '../controller/question.controller.js';

const router = express.Router();

// Định nghĩa API lấy danh sách câu hỏi
router.get('/', questionController.getAllQuestions);

export default router;