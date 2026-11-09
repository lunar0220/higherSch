# API личного кабинета. Все адреса доступны только вошедшему ученику (IsAuthenticated).
from datetime import date

from django.shortcuts import get_object_or_404
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Enrollment, Homework, Lesson, LessonProgress, Submission


# ---------- Вспомогательные функции ----------

def progress_percent(user, course):
    """Сколько процентов уроков курса ученик уже прошёл."""
    total = course.lessons.count()
    if total == 0:
        return 0
    done = LessonProgress.objects.filter(student=user, lesson__course=course).count()
    return round(done * 100 / total)


def course_data(user, enrollment):
    """Данные курса для ученика: прогресс и «траектория» баллов."""
    course = enrollment.course
    return {
        "id": course.id,
        "title": course.title,
        "exam_type": course.exam_type,
        "description": course.description,
        "teacher_name": course.teacher.name if course.teacher else None,
        "lessons_count": course.lessons.count(),
        "progress": progress_percent(user, course),
        "start_score": enrollment.start_score,
        "current_score": enrollment.current_score,
        "target_score": enrollment.target_score,
    }


def homework_data(homework, submission):
    """Задание вместе с ответом ученика. Нет ответа = «не выполнено»."""
    status = submission.status if submission else Submission.Status.NOT_DONE
    return {
        "id": homework.id,
        "title": homework.title,
        "description": homework.description,
        "kind": homework.kind,
        "kind_label": homework.get_kind_display(),
        "deadline": homework.deadline,
        "lesson_id": homework.lesson_id,
        "lesson_title": homework.lesson.title,
        "course_title": homework.lesson.course.title,
        "status": str(status),
        "status_label": Submission.Status(status).label,
        "grade": submission.grade if submission else None,
        "answer": submission.answer if submission else "",
        "teacher_comment": submission.teacher_comment if submission else "",
    }


def lesson_for_student(user, lesson_id):
    """Находит урок, но только если ученик записан на этот курс. Иначе 404."""
    lesson = get_object_or_404(Lesson.objects.select_related("course"), id=lesson_id)
    if not Enrollment.objects.filter(student=user, course=lesson.course).exists():
        raise NotFound()
    return lesson


# ---------- Адреса ----------

class MyCourses(APIView):
    """GET /api/my/courses/ — курсы ученика с прогрессом."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        enrollments = Enrollment.objects.filter(student=request.user).select_related("course", "course__teacher")
        return Response([course_data(request.user, e) for e in enrollments])


class MyCourseDetail(APIView):
    """GET /api/my/courses/<id>/ — один курс со списком уроков."""
    permission_classes = [IsAuthenticated]

    def get(self, request, course_id):
        enrollment = get_object_or_404(
            Enrollment.objects.select_related("course", "course__teacher"),
            student=request.user, course_id=course_id,
        )
        done_ids = set(
            LessonProgress.objects.filter(student=request.user, lesson__course_id=course_id)
            .values_list("lesson_id", flat=True)
        )
        lessons = [
            {
                "id": lesson.id,
                "title": lesson.title,
                "description": lesson.description,
                "completed": lesson.id in done_ids,
                "homework_count": lesson.homeworks.count(),
            }
            for lesson in enrollment.course.lessons.all()
        ]
        data = course_data(request.user, enrollment)
        data["lessons"] = lessons
        return Response(data)


class LessonDetail(APIView):
    """GET /api/lessons/<id>/ — урок: видео, конспект и задания."""
    permission_classes = [IsAuthenticated]

    def get(self, request, lesson_id):
        lesson = lesson_for_student(request.user, lesson_id)
        submissions = {
            s.homework_id: s
            for s in Submission.objects.filter(student=request.user, homework__lesson=lesson)
        }
        homeworks = [
            homework_data(h, submissions.get(h.id))
            for h in lesson.homeworks.select_related("lesson", "lesson__course")
        ]
        return Response({
            "id": lesson.id,
            "title": lesson.title,
            "description": lesson.description,
            "video_url": lesson.video_url,
            "notes": lesson.notes,
            "course_id": lesson.course_id,
            "course_title": lesson.course.title,
            "completed": LessonProgress.objects.filter(student=request.user, lesson=lesson).exists(),
            "homeworks": homeworks,
        })


class LessonComplete(APIView):
    """POST /api/lessons/<id>/complete/ — отметить урок пройденным (или снять отметку)."""
    permission_classes = [IsAuthenticated]

    def post(self, request, lesson_id):
        lesson = lesson_for_student(request.user, lesson_id)
        completed = bool(request.data.get("completed", True))
        if completed:
            LessonProgress.objects.get_or_create(student=request.user, lesson=lesson)
        else:
            LessonProgress.objects.filter(student=request.user, lesson=lesson).delete()
        return Response({"completed": completed, "progress": progress_percent(request.user, lesson.course)})


class MyHomework(APIView):
    """GET /api/my/homework/ — все задания ученика (домашки и пробники)."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        homeworks = (
            Homework.objects.filter(lesson__course__enrollments__student=request.user)
            .select_related("lesson", "lesson__course")
            .distinct()
        )
        submissions = {s.homework_id: s for s in Submission.objects.filter(student=request.user)}
        data = [homework_data(h, submissions.get(h.id)) for h in homeworks]
        # Сначала ближайшие по сроку, задания без срока в конце
        data.sort(key=lambda item: (item["deadline"] is None, item["deadline"] or date.max))
        return Response(data)


class SubmitHomework(APIView):
    """POST /api/homework/<id>/submit/ — сдать ответ на задание."""
    permission_classes = [IsAuthenticated]

    def post(self, request, homework_id):
        homework = get_object_or_404(Homework.objects.select_related("lesson", "lesson__course"), id=homework_id)
        if not Enrollment.objects.filter(student=request.user, course=homework.lesson.course).exists():
            raise NotFound()

        answer = str(request.data.get("answer", "")).strip()
        if not answer:
            return Response({"answer": ["Напишите ответ"]}, status=400)

        # Если ответ уже был, он обновится; статус снова становится «Выполнено»
        submission, _ = Submission.objects.update_or_create(
            homework=homework, student=request.user,
            defaults={"answer": answer, "status": Submission.Status.DONE},
        )
        return Response(homework_data(homework, submission))
