import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Appointment {
  id: number;
  name: string;
  phone: string;
  email: string;
  appointment_date: string;
  question: string;
  created_at: string;
}

const Admin = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAppointments = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/83881173-226b-40bd-b72f-294b6f33751a');
      if (response.ok) {
        const data = await response.json();
        setAppointments(data.appointments || []);
      } else {
        toast.error('Ошибка загрузки заявок');
      }
    } catch (error) {
      toast.error('Ошибка соединения');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" className="animate-spin mx-auto mb-4" size={48} />
          <p className="text-gray-600">Загрузка заявок...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-montserrat font-bold text-4xl text-gray-900 mb-2">Заявки на консультацию</h1>
            <p className="text-gray-600">Всего заявок: {appointments.length}</p>
          </div>
          <Button onClick={loadAppointments} variant="outline">
            <Icon name="RefreshCw" className="mr-2" size={18} />
            Обновить
          </Button>
        </div>

        {appointments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Icon name="Inbox" className="mx-auto mb-4 text-gray-400" size={64} />
              <p className="text-gray-600 text-lg">Пока нет заявок</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {appointments.map((appointment) => (
              <Card key={appointment.id} className="hover:shadow-lg transition">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="font-montserrat text-2xl mb-2">
                        {appointment.name}
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        Заявка #{appointment.id} • {new Date(appointment.created_at).toLocaleString('ru-RU')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <a href={`tel:${appointment.phone}`}>
                        <Button size="sm" variant="outline">
                          <Icon name="Phone" size={16} />
                        </Button>
                      </a>
                      <a href={`mailto:${appointment.email}`}>
                        <Button size="sm" variant="outline">
                          <Icon name="Mail" size={16} />
                        </Button>
                      </a>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="mb-4">
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                          <Icon name="Phone" size={18} />
                          <span className="font-semibold">Телефон:</span>
                        </div>
                        <a href={`tel:${appointment.phone}`} className="text-lg text-primary hover:underline">
                          {appointment.phone}
                        </a>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                          <Icon name="Mail" size={18} />
                          <span className="font-semibold">Email:</span>
                        </div>
                        <a href={`mailto:${appointment.email}`} className="text-lg text-primary hover:underline">
                          {appointment.email}
                        </a>
                      </div>
                    </div>
                    <div>
                      <div className="mb-4">
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                          <Icon name="Calendar" size={18} />
                          <span className="font-semibold">Желаемая дата:</span>
                        </div>
                        <p className="text-lg">{appointment.appointment_date}</p>
                      </div>
                      {appointment.question && (
                        <div>
                          <div className="flex items-center gap-2 text-gray-600 mb-1">
                            <Icon name="MessageSquare" size={18} />
                            <span className="font-semibold">Вопрос:</span>
                          </div>
                          <p className="text-gray-700">{appointment.question}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;