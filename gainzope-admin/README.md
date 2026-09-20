# GAINZOPE Admin

This panel shows website email sign-ups stored in MongoDB. It does not send email automatically.

Open `index.html` through a local static server, for example `py -m http.server 5174`.

Before use, configure `gainzope-backend/.env`, install backend dependencies, and add `http://localhost:5174` to `ADMIN_ORIGIN` and Firebase Authentication's authorized domains. The signed-in Firebase user must have an `admin: true` custom claim or an email listed in `ADMIN_EMAILS`.
