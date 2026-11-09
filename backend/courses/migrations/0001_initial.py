import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('content', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Course',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200, verbose_name='Название')),
                ('exam_type', models.CharField(choices=[('ege', 'ЕГЭ'), ('oge', 'ОГЭ')], max_length=3, verbose_name='Экзамен')),
                ('description', models.TextField(blank=True, verbose_name='Описание')),
                ('lessons_count', models.PositiveIntegerField(default=0, verbose_name='Количество занятий')),
                ('duration', models.CharField(blank=True, max_length=100, verbose_name='Срок обучения')),
                ('is_published', models.BooleanField(default=True, verbose_name='Показывать на сайте')),
                ('teacher', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='courses', to='content.teacher', verbose_name='Преподаватель')),
            ],
            options={
                'verbose_name': 'Курс',
                'verbose_name_plural': 'Курсы',
            },
        ),
        migrations.CreateModel(
            name='Tariff',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, verbose_name='Название тарифа')),
                ('price_per_month', models.PositiveIntegerField(verbose_name='Цена в месяц, ₽')),
                ('description', models.TextField(blank=True, verbose_name='Что входит')),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tariffs', to='courses.course', verbose_name='Курс')),
            ],
            options={
                'verbose_name': 'Тариф',
                'verbose_name_plural': 'Тарифы',
            },
        ),
    ]
