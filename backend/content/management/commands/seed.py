from django.core.management.base import BaseCommand

from content.models import FAQ, Review, Teacher
from courses.models import Course, Tariff


class Command(BaseCommand):
    help = "Заполняет базу тестовыми данными"

    def handle(self, *args, **options):
        Tariff.objects.all().delete()
        Course.objects.all().delete()
        Teacher.objects.all().delete()
        Review.objects.all().delete()
        FAQ.objects.all().delete()

        people = [
            ("Анна Петрова", "Русский язык", 9, "ege,oge"),
            ("Дмитрий Орлов", "Математика", 7, "ege,oge"),
            ("Елена Соколова", "Биология", 6, "ege,oge"),
            ("Игорь Лебедев", "Обществознание", 5, "ege"),
            ("Валерия Владимировна", "Английский язык", 8, "ege,oge"),
            ("Мария Ким", "Химия", 6, "ege"),
            ("Артём Громов", "Информатика", 5, "ege"),
        ]
        teachers = {}
        for i, (name, subject, years, exams) in enumerate(people, start=1):
            if name == "Валерия Владимировна":
                facts = (
                    "Преподаватель английского языка с 8-летним стажем\n"
                    "28 стобалльников и 2 472 сдали на 80+\n"
                    "3 красных диплома о высшем образовании\n"
                    "Езда в США на 3,5 месяца по студенческой программе"
                )
            else:
                facts = (
                    f"Преподаватель предмета «{subject}» со стажем {years} лет\n"
                    "Ученики регулярно сдают на 80+\n"
                    "Красный диплом о высшем образовании"
                )
            teachers[subject] = Teacher.objects.create(
                name=name, subject=subject, bio=facts,
                experience=f"{years} лет", typical_score="80-95 баллов",
                social_link="https://t.me/example", exam_types=exams, order=i,
            )


        Review.objects.create(author_name="Алина", exam_type="ege", score="92 балла",
                              text="Занималась полгода, результат превзошёл ожидания.")
        Review.objects.create(author_name="Дмитрий", exam_type="ege", score="85 баллов",
                              text="Удобная платформа, понятные домашки и записи уроков.")
        Review.objects.create(author_name="Мама Софии", exam_type="oge", score="5 по предмету",
                              text="Дочь стала увереннее, спасибо преподавателям.")


        FAQ.objects.create(question="Что такое Выше?", exam_type="", order=1,
                           answer="Онлайн-школа подготовки к ОГЭ и ЕГЭ: маршрут от стартовой точки до пробного экзамена.")
        FAQ.objects.create(question="Чем Выше лучше репетитора или самоподготовки?", exam_type="", order=2,
                           answer="У вас есть чёткий план, куратор, автопроверка заданий и пробные экзамены.")
        FAQ.objects.create(question="Можно ли будет поменять тариф?", exam_type="", order=3,
                           answer="Да, тариф можно изменить в любой момент, написав куратору.")
        FAQ.objects.create(question="Как проходят занятия?", exam_type="", order=4,
                           answer="Вебинары с преподавателем в рабочей тетради, видеоуроки и задания с автопроверкой.")
        FAQ.objects.create(question="Сколько длится подготовка к ЕГЭ?", exam_type="ege", order=1,
                           answer="Обычно от 6 до 9 месяцев.")
        FAQ.objects.create(question="Сколько длится подготовка к ОГЭ?", exam_type="oge", order=1,
                           answer="Обычно от 4 до 6 месяцев.")


        Course.objects.create(title="Математика ЕГЭ", exam_type="ege", teacher=teachers["Математика"],
                              description="Полный курс подготовки к ЕГЭ по математике.",
                              lessons_count=60, duration="9 месяцев")
        Course.objects.create(title="Английский язык ЕГЭ", exam_type="ege", teacher=teachers["Английский язык"],
                              description="Подготовка к ЕГЭ по английскому языку.",
                              lessons_count=50, duration="8 месяцев")
        Course.objects.create(title="Русский язык ОГЭ", exam_type="oge", teacher=teachers["Русский язык"],
                              description="Курс подготовки к ОГЭ по русскому языку.",
                              lessons_count=36, duration="6 месяцев")


        Tariff.objects.create(
            name="Стандарт", price_per_month=3990, order=1,
            features="Диагностика и персональный план\n"
                     "Занятия по 1 предмету: видеоуроки и вебинар\n"
                     "Задания с автопроверкой\n"
                     "Один пробный экзамен в месяц\n"
                     "Чат учеников",
        )
        Tariff.objects.create(
            name="Про", price_per_month=5790, order=2,
            features="Всё из «Стандарта»\n"
                     "Куратор проверяет домашние задания\n"
                     "Разбор ошибок после каждого пробника\n"
                     "2 пробных экзамена в месяц\n"
                     "Ежемесячный отчёт",
        )
        Tariff.objects.create(
            name="Про+", price_per_month=9790, order=3,
            features="Всё из «Про»\n"
                     "Две индивидуальные консультации с преподавателем в месяц\n"
                     "Личный наставник и корректировка плана\n"
                     "Помощь с выбором вуза и стратегией поступления\n"
                     "Ежемесячный созвон",
        )

        self.stdout.write(self.style.SUCCESS("Тестовые данные добавлены."))
