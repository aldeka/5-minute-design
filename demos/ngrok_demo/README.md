To set up the ngrok part of the tutorial:

* cd demos/mysite
* virtualenv .
* bin/pip install -r requirements.txt
* bin/python manage.py runserver

Switch user to "dummy", and run:

* ngrok -subdomain="pycon" 8000

It's a fine idea to do all that before the talk actually
starts.
