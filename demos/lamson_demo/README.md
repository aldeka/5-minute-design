To get the Lamson demo going:

* cd stuff
* virtualenv .
* bin/pip install -r requirements.txt
* cd mymailserver
* ../bin/lamson stop
* ../bin/lamson start
* ssh  -R 2525:localhost:8823 debdev.xvm.mit.edu
* in a new terminal tab: function mutt() { cd ~/projects/servertalk/demos/lamson_demo/stuff/mymailserver/run/queue ; git ls-files -o cur new | xargs rm ; cd ../.. ; (sleep 60 ; git merge origin/plus_more_mail) &! /usr/bin/mutt -F muttrc  }


To test it:

* Visit webmail somewhere and send an email to
  hello@pycon.duckdns.org

* Make sure it shows up in the mutt interface in
  5-10 seconds.
