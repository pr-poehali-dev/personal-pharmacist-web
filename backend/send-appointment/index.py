import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime

def handler(event: dict, context) -> dict:
    '''Отправка заявок на консультацию на email администратора'''
    
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
            'body': json.dumps({'error': 'Заполните все обязательные поля'}),
            'isBase64Encoded': False
        }
    
    smtp_host = os.environ.get('SMTP_HOST')
    smtp_port = int(os.environ.get('SMTP_PORT', '465'))
    smtp_user = os.environ.get('SMTP_USER')
    smtp_password = os.environ.get('SMTP_PASSWORD')
    
    if not all([smtp_host, smtp_user, smtp_password]):
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Настройки SMTP не заданы'}),
            'isBase64Encoded': False
        }
    
    admin_email = 'sgudz99alex@yandex.ru'
    
    admin_msg = MIMEMultipart()
    admin_msg['From'] = smtp_user
    admin_msg['To'] = admin_email
    admin_msg['Subject'] = '🔔 НОВАЯ ЗАЯВКА на консультацию!'
    
    admin_body = f'''
НОВАЯ ЗАЯВКА НА КОНСУЛЬТАЦИЮ!

━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 ФИО: {name}
📞 Телефон: {phone}
📧 Email: {email}
📅 Дата и время: {date}
❓ Вопрос: {question if question else 'Не указан'}
━━━━━━━━━━━━━━━━━━━━━━━━━━

⏰ Время получения: {datetime.now().strftime('%d.%m.%Y %H:%M:%S')}

💡 Свяжитесь с клиентом:
   Телефон: {phone}
   Email: {email}

---
Личный фармацевт
    '''
    
    admin_msg.attach(MIMEText(admin_body, 'plain', 'utf-8'))
    
    client_msg = MIMEMultipart()
    client_msg['From'] = smtp_user
    client_msg['To'] = email
    client_msg['Subject'] = '✅ Ваша заявка принята — Личный фармацевт'
    
    client_body = f'''
Здравствуйте, {name}!

Ваша заявка на консультацию успешно оформлена.

📅 Дата и время: {date}

Наш фармацевт свяжется с вами в ближайшее время по телефону {phone} или email {email}.

Спасибо за обращение!

---
С уважением,
Команда «Личный фармацевт»
    '''
    
    client_msg.attach(MIMEText(client_body, 'plain', 'utf-8'))
    
    try:
        if smtp_port == 465:
            server = smtplib.SMTP_SSL(smtp_host, smtp_port)
        else:
            server = smtplib.SMTP(smtp_host, smtp_port)
            server.starttls()
        
        server.login(smtp_user, smtp_password)
        server.send_message(admin_msg)
        server.send_message(client_msg)
        server.quit()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'success': True, 'message': 'Заявка отправлена'}),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': f'Ошибка отправки: {str(e)}'}),
            'isBase64Encoded': False
        }
