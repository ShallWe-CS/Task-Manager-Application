Cloning the repository
--> git clone https://github.com/divanov11/StudyBud.git

--> Move into the directory where we have the project files :
cd StudyBud

--> Create a virtual environment :
# Let's install virtualenv first
pip install virtualenv

# Then we create our virtual environment
virtualenv envname

--> Activate the virtual environment :
envname\scripts\activate
note: If you get "scripts is disabled on this system"
1. First, Open PowerShell with Run as Administrator.
2. Then, run this command in PowerShell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned

--> Install the requirements :
pip install -r requirements.txt


Running the App
--> To run the App, we use :
python manage.py runserver


App Preview :
