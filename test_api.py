import urllib.request
import json
import urllib.error

req = urllib.request.Request(
    'http://127.0.0.1:5000/login',
    data=json.dumps({"email":"admin@gmail.com","password":"admin123"}).encode('utf-8'),
    headers={'Content-Type': 'application/json'}
)
resp = urllib.request.urlopen(req)
data = json.loads(resp.read().decode('utf-8'))
token = data['token']

req2 = urllib.request.Request(
    'http://127.0.0.1:5000/admin/products',
    headers={'Authorization': f'Bearer {token}'}
)
try:
    resp2 = urllib.request.urlopen(req2)
    dashboard_data = json.loads(resp2.read().decode('utf-8'))
    print(json.dumps(dashboard_data, indent=2))
except urllib.error.HTTPError as e:
    print(e.read().decode('utf-8'))
