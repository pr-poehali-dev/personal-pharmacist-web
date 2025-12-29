import json
import os
import psycopg2
from datetime import datetime

def handler(event: dict, context) -> dict:
    '''Сохранение заявок на консультацию в базу данных'''
    
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
    
    try:
        db_url = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        cur.execute('''
            INSERT INTO appointments (name, phone, email, appointment_date, question)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id
        ''', (name, phone, email, date, question))
        
        appointment_id = cur.fetchone()[0]
        conn.commit()
        
        cur.close()
        conn.close()
        
        admin_email = 'sgudz99alex@yandex.ru'
        print(f'''
🔔 НОВАЯ ЗАЯВКА #{appointment_id}

ФИО: {name}
Телефон: {phone}
Email: {email}
Дата: {date}
Вопрос: {question if question else 'Не указан'}

Администратор: {admin_email}
        ''')
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True, 
                'message': 'Заявка принята',
                'id': appointment_id
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
            'body': json.dumps({'error': f'Ошибка: {str(e)}'}),
            'isBase64Encoded': False
        }