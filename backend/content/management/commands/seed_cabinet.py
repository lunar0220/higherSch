from datetime import date, timedelta

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from content.models import FAQ, Teacher
from courses.models import Course, Enrollment, Homework, Lesson, LessonProgress, Submission

User = get_user_model()


COURSES = [
    {
        "title": "Математика ОГЭ",
        "subject": "Математика",
        "description": "Подготовка к ОГЭ по математике: от диагностики до пробного экзамена.",
        "scores": (10, 17, 24),
        "done_lessons": 2,
        "lessons": [
            "Числа и вычисления",
            "Алгебраические выражения",
            "Уравнения и неравенства",
            "Текстовые задачи",
            "Функции и графики",
            "Геометрия: треугольники",
        ],
    },
    {
        "title": "Русский язык ОГЭ",
        "subject": "Русский язык",
        "description": "Курс подготовки к ОГЭ по русскому языку.",
        "scores": (15, 22, 28),
        "done_lessons": 1,
        "lessons": [
            "Сжатое изложение",
            "Орфография",
            "Синтаксис и пунктуация",
            "Средства выразительности",
            "Сочинение-рассуждение",
            "Лексика и фразеология",
        ],
    },
]


OGE_FAQ = [
    (1, "Какие предметы сдают на ОГЭ?",
     "Обязательны русский язык и математика, ещё два предмета ученик выбирает самостоятельно."),
    (3, "С чего начинается обучение?",
     "С диагностики: мы выясняем текущий уровень и составляем персональный план подготовки."),
]


class Command(BaseCommand):
    help = "Создаёт демо-ученика, курсы ОГЭ, уроки и задания для личного кабинета"

    def handle(self, *args, **options):
        student, created = User.objects.get_or_create(
            username="student",
            defaults={"first_name": "Анна", "last_name": "Смирнова", "role": "student", "phone": "+79001234567"},
        )
        if created:
            student.set_password("demo12345")
            student.save()

        today = date.today()

        for course_data in COURSES:
            teacher = Teacher.objects.filter(subject=course_data["subject"]).first()
            course, _ = Course.objects.get_or_create(
                title=course_data["title"],
                defaults={
                    "exam_type": "oge",
                    "description": course_data["description"],
                    "teacher": teacher,
                    "lessons_count": len(course_data["lessons"]),
                    "duration": "6 месяцев",
                },
            )

            start, current, target = course_data["scores"]
            Enrollment.objects.get_or_create(
                student=student, course=course,
                defaults={"start_score": start, "current_score": current, "target_score": target},
            )

            lessons = []
            for number, title in enumerate(course_data["lessons"], start=1):
                lesson, _ = Lesson.objects.get_or_create(
                    course=course, title=title,
                    defaults={
                        "order": number,
                        "description": f"Урок {number}. Разбираем тему «{title}» на примерах заданий ОГЭ.",
                        "notes": (
                            f"Конспект урока «{title}».\n\n"
                            "1. Повторяем теорию по теме.\n"
                            "2. Разбираем типовые задания ОГЭ.\n"
                            "3. Закрепляем материал на практике."
                        ),
                    },
                )
                lessons.append(lesson)

                if number == len(course_data["lessons"]):
                    Homework.objects.get_or_create(
                        lesson=lesson, title="Пробный экзамен №1",
                        defaults={
                            "kind": Homework.Kind.MOCK,
                            "deadline": today + timedelta(days=14),
                            "description": "Решите пробный вариант ОГЭ и напишите ответы на задания.",
                        },
                    )
                else:
                    Homework.objects.get_or_create(
                        lesson=lesson, title=f"Домашнее задание: {title}",
                        defaults={
                            "kind": Homework.Kind.HOMEWORK,
                            "deadline": today + timedelta(days=2 * number),
                            "description": "Выполните задания по теме урока и напишите ответы в поле ниже.",
                        },
                    )


            for lesson in lessons[: course_data["done_lessons"]]:
                LessonProgress.objects.get_or_create(student=student, lesson=lesson)

            first = Homework.objects.filter(lesson=lessons[0]).first()
            Submission.objects.get_or_create(
                homework=first, student=student,
                defaults={
                    "answer": "Все задания решила, сомневаюсь в номере 5.",
                    "status": Submission.Status.DONE, "grade": 5,
                    "teacher_comment": "Хорошая работа!",
                },
            )
            if len(lessons) > 1:
                second = Homework.objects.filter(lesson=lessons[1]).first()
                Submission.objects.get_or_create(
                    homework=second, student=student,
                    defaults={
                        "answer": "Решила часть заданий.",
                        "status": Submission.Status.PARTIAL, "grade": 3,
                        "teacher_comment": "Исправь ошибки в заданиях 3 и 4.",
                    },
                )


        for order, question, answer in OGE_FAQ:
            FAQ.objects.update_or_create(
                question=question, exam_type="oge",
                defaults={"answer": answer, "order": order},
            )

        self.stdout.write(self.style.SUCCESS("Демо-данные кабинета созданы. Вход: student / demo12345"))
