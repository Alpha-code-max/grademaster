"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const course_1 = require("../controllers/course");
const middleware_1 = require("../middleware");
const router = express_1.default.Router();
// All routes require authentication
router.post('/', middleware_1.verifyToken, course_1.createCourse);
router.get('/', middleware_1.verifyToken, course_1.getAllCourses);
router.get('/:id', middleware_1.verifyToken, course_1.getCourseById);
router.put('/:id', middleware_1.verifyToken, course_1.updateCourse);
router.delete('/:id', middleware_1.verifyToken, course_1.deleteCourse);
exports.default = router;
//# sourceMappingURL=courseRoutes.js.map