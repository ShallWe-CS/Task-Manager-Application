
Local Setup

Prerequisites

Python 3.11.3
Pip (Python package installer)
Setting up the Virtual Environment

Clone the repository:

git clone https://github.com/your_username/your_project.git
cd your_project
Create a virtual environment:

python setup_venv.py

Activate the virtual environment(if needed):

For Windows: .\venv\Scripts\activate

For macOS/Linux: source venv/bin/activate

Install project dependencies:

pip install -r requirements.txt

Environment Variables

Create a .env file in the root directory with the following content: Replace "https://your-cloud-elasticsearch-url:443" and "your-cloud-api-key" with your actual Cloud Elasticsearch URL and API key.

 CLOUD_ELASTICSEARCH_URL="https://your-cloud-elasticsearch-url:443"
 CLOUD_API_KEY="your-cloud-api-key"
Running the Application

python run.py

Here in run.py you have to set the "API_SERVER_ENABLED = True" and comment out " #flask_thread.start()" "Now you will be able to run the gom_core and api_server in two threats.
