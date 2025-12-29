import json
from datetime import datetime

def handler(event: dict, context) -> dict:
    '''Сохранение заявки на консультацию и отправка уведомления администратору'''
    
    method = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    try:
        data = json.loads(event.get('body', '{}'))
        
        name = data.get('name', '')
        phone = data.get('phone', '')
        email = data.get('email', '')
        date = data.get('date', '')
        question = data.get('question', '')
        
        if not all([name, phone, email, date]):
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Missing required fields'}),
                'isBase64Encoded': False
            }
        
        admin_email = 'sgudz99alex@yandex.ru'
        
        client_message = f'''
Здравствуйте, {name}!

Ваша заявка на консультацию оформлена.
Дата и время: {date}

Наш фармацевт свяжется с вами по телефону {phone} или email {email}.

Спасибо за обращение!

---
С уважением,
Команда «Личный фармацевт»
        '''
        
        admin_message = f'''
НОВАЯ ЗАЯВКА НА КОНСУЛЬТАЦИЮ!

ФИО: {name}
Телефон: {phone}
Email: {email}
Дата и время: {date}
Вопрос: {question if question else 'Не указан'}

---
Время получения: {datetime.now().strftime('%d.%m.%Y %H:%M:%S')}
Свяжитесь с клиентом: {phone} или {email}
        '''
        
        print(f"[ADMIN NOTIFICATION] {admin_message}")
        print(f"[CLIENT NOTIFICATION] To: {email}\n{client_message}")
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True, 
                'message': 'Appointment received',
                'data': {
                    'name': name,
                    'phone': phone,
                    'email': email,
                    'date': date,
                    'admin_email': admin_email
                }
            }),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
