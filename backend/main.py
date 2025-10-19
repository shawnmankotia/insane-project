from flask import Flask, send_from_directory, jsonify


import os
app = Flask(__name__, static_folder='frontend_dist', static_url_path='')


# Serve frontend build index.html for all non-API routes
@app.route('/')
@app.route('/<path:path>')
def serve_frontend(path=''):
    if path != '' and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True)


# Example API endpoint
@app.route('/api/message')
def api_message():
    return jsonify({"message": "Hello from Flask API!"})