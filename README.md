# Weryfikator Fachowca

---

### Running

`docker compose up --build` - clean build and run

`docker compose up` - run from existing resources

`Ctrl + C` - stop running everything

`docker compose down` - stop and remove containers (keeps database)

`docker compose down -v` - stop remove containers and volumes (deletes database)

`nginx -s stop` - stopping all nginx services (can fix port in use issues)

Problems:

- if frontend fail to build you can try deleting `node_modules`
- if backend fail to build you can try deleting `target`

---
