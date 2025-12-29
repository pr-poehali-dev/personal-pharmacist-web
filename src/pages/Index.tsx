import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { toast } from 'sonner';

const Index = () => {
  const [date, setDate] = useState<Date>();
  const [showForm, setShowForm] = useState(false);
  const [showThanks, setShowThanks] = useState(false);
  const [medications, setMedications] = useState<string[]>(['']);
  const [interactions, setInteractions] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowForm(false);
    setShowThanks(true);
    toast.success('Заявка отправлена!');
  };

  const addMedication = () => {
    setMedications([...medications, '']);
  };

  const updateMedication = (index: number, value: string) => {
    const newMeds = [...medications];
    newMeds[index] = value;
    setMedications(newMeds);
  };

  const checkInteractions = () => {
    const filled = medications.filter(m => m.trim() !== '');
    if (filled.length < 2) {
      toast.error('Добавьте минимум 2 препарата');
      return;
    }
    
    const mockInteractions = [
      'Препарат А может усилить эффект Препарата Б',
      'Рекомендуется принимать с интервалом 2 часа',
      'Комбинация безопасна при соблюдении дозировок'
    ];
    
    setInteractions(mockInteractions.slice(0, Math.min(filled.length, 3)));
    toast.success('Анализ завершён');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-2xl">
              💊
            </div>
            <div>
              <h1 className="font-montserrat font-bold text-xl text-gray-900">Личный фармацевт</h1>
              <p className="text-sm text-gray-600">Консультации и помощь 24/7</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="tel:+79490072910" className="flex items-center gap-2 text-gray-700 hover:text-primary transition">
              <Icon name="Phone" size={18} />
              <span className="font-medium">+7 949 007 29 10</span>
            </a>
            <a href="mailto:sgudz99alex@yandex.ru" className="flex items-center gap-2 text-gray-700 hover:text-primary transition">
              <Icon name="Mail" size={18} />
              <span className="font-medium">sgudz99alex@yandex.ru</span>
            </a>
          </div>
        </div>
      </header>

      <section className="container mx-auto px-4 py-20 text-center animate-fade-in">
        <Badge className="mb-4 bg-accent text-white">Быстро • Безопасно • Профессионально</Badge>
        <h2 className="font-montserrat font-bold text-5xl md:text-6xl text-gray-900 mb-6">
          Получите консультацию<br />
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            фармацевта онлайн
          </span>
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Профессиональная помощь в подборе лекарств, проверке совместимости препаратов и консультации по любым вопросам
        </p>
        <Button size="lg" className="text-lg px-8 py-6 animate-scale-in" onClick={() => setShowForm(true)}>
          <Icon name="Calendar" className="mr-2" size={20} />
          Записаться на консультацию
        </Button>
      </section>

      <section className="container mx-auto px-4 py-16">
        <Card className="max-w-4xl mx-auto shadow-xl border-2 border-primary/20 animate-fade-in">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardTitle className="font-montserrat text-2xl flex items-center gap-2">
              <Icon name="Shield" className="text-primary" />
              Проверка взаимодействия препаратов
            </CardTitle>
            <CardDescription>
              Узнайте, совместимы ли ваши лекарства и как их правильно принимать
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {medications.map((med, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Препарат ${index + 1}`}
                    value={med}
                    onChange={(e) => updateMedication(index, e.target.value)}
                    className="flex-1"
                  />
                  {index === medications.length - 1 && (
                    <Button variant="outline" size="icon" onClick={addMedication}>
                      <Icon name="Plus" size={18} />
                    </Button>
                  )}
                </div>
              ))}
              <Button onClick={checkInteractions} className="w-full" size="lg">
                <Icon name="Search" className="mr-2" size={18} />
                Проверить совместимость
              </Button>
            </div>

            {interactions.length > 0 && (
              <div className="mt-6 space-y-3 animate-fade-in">
                <Separator />
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Icon name="AlertCircle" className="text-accent" size={20} />
                  Результаты анализа:
                </h3>
                {interactions.map((interaction, index) => (
                  <div key={index} className="flex gap-3 p-3 bg-blue-50 rounded-lg">
                    <Icon name="Info" className="text-secondary flex-shrink-0 mt-1" size={18} />
                    <p className="text-gray-700">{interaction}</p>
                  </div>
                ))}
                <p className="text-sm text-gray-500 italic">
                  ⚠️ Это примерные данные. Для точной консультации запишитесь к фармацевту
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="font-montserrat font-bold text-4xl text-center mb-12 text-gray-900">Наши услуги</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            {
              icon: 'MessageSquare',
              title: 'Консультации по лекарствам',
              description: 'Подробная информация о препаратах, дозировках и правилах приёма'
            },
            {
              icon: 'Repeat',
              title: 'Подбор аналогов',
              description: 'Помощь в выборе более доступных или подходящих аналогов лекарств'
            },
            {
              icon: 'CheckCircle2',
              title: 'Проверка совместимости',
              description: 'Анализ взаимодействия препаратов для безопасного лечения'
            }
          ].map((service, index) => (
            <Card key={index} className="hover:shadow-lg transition hover:scale-105 duration-300">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mb-4">
                  <Icon name={service.icon as any} className="text-white" size={28} />
                </div>
                <CardTitle className="font-montserrat text-xl">{service.title}</CardTitle>
                <CardDescription className="text-base leading-relaxed">{service.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-montserrat font-bold text-4xl text-center mb-8 text-gray-900">О нас</h2>
          <Card className="shadow-lg">
            <CardContent className="pt-6">
              <p className="text-lg text-gray-700 leading-relaxed text-center">
                Мы — команда профессиональных фармацевтов, готовых помочь вам 24/7. 
                Наша миссия — обеспечить доступные и качественные консультации для каждого. 
                Мы используем современные технологии для быстрой и точной помощи в вопросах здоровья. 
                Ваше здоровье — наш приоритет.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-montserrat font-bold text-xl mb-4">Контакты</h3>
              <div className="space-y-3">
                <a href="tel:+79490072910" className="flex items-center gap-2 hover:text-primary transition">
                  <Icon name="Phone" size={18} />
                  +7 949 007 29 10
                </a>
                <a href="mailto:sgudz99alex@yandex.ru" className="flex items-center gap-2 hover:text-primary transition">
                  <Icon name="Mail" size={18} />
                  sgudz99alex@yandex.ru
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-montserrat font-bold text-xl mb-4">Режим работы</h3>
              <p className="text-gray-300">Онлайн-консультации 24/7</p>
              <p className="text-gray-300">Ответ в течение 15 минут</p>
            </div>
            <div>
              <h3 className="font-montserrat font-bold text-xl mb-4">Документы</h3>
              <div className="space-y-2">
                <a href="#" className="block text-gray-300 hover:text-primary transition">Политика конфиденциальности</a>
                <a href="#" className="block text-gray-300 hover:text-primary transition">Пользовательское соглашение</a>
              </div>
            </div>
          </div>
          <Separator className="my-8 bg-gray-700" />
          <p className="text-center text-gray-400">© 2024 Личный фармацевт. Все права защищены.</p>
        </div>
      </footer>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-montserrat text-2xl">Запись на консультацию</DialogTitle>
            <DialogDescription>
              Заполните форму, и наш фармацевт свяжется с вами в указанное время
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">ФИО *</Label>
              <Input id="name" required placeholder="Иванов Иван Иванович" />
            </div>
            <div>
              <Label htmlFor="phone">Телефон *</Label>
              <Input id="phone" type="tel" required placeholder="+7 (999) 123-45-67" />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" required placeholder="example@mail.ru" />
            </div>
            <div>
              <Label>Дата и время консультации *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <Icon name="Calendar" className="mr-2" size={18} />
                    {date ? format(date, 'PPP', { locale: ru }) : 'Выберите дату'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} locale={ru} />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="question">Ваш вопрос (необязательно)</Label>
              <Textarea id="question" placeholder="Опишите вашу ситуацию..." rows={4} />
            </div>
            <div className="flex items-start space-x-2">
              <Checkbox id="terms" required />
              <label htmlFor="terms" className="text-sm text-gray-600 leading-snug">
                Согласен на обработку персональных данных в соответствии с политикой конфиденциальности *
              </label>
            </div>
            <Button type="submit" className="w-full" size="lg">
              <Icon name="Send" className="mr-2" size={18} />
              Отправить заявку
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showThanks} onOpenChange={setShowThanks}>
        <DialogContent>
          <DialogHeader>
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Check" className="text-white" size={32} />
            </div>
            <DialogTitle className="font-montserrat text-2xl text-center">Спасибо за заявку!</DialogTitle>
            <DialogDescription className="text-center text-base">
              Ваша заявка принята. Наш фармацевт свяжется с вами в ближайшее время по указанным контактам.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => setShowThanks(false)} size="lg" className="w-full">
            Закрыть
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
