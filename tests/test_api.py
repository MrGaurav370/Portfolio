def test_health(client):
    assert client.get("/api/health").json()["status"] == "ok"


def test_seeded_profile_skills_projects(client):
    p = client.get("/api/profile").json()
    assert p["name"] == "Gaurav Gaur" and p["email"]
    assert len(client.get("/api/skills").json()) == 4
    projects = client.get("/api/projects").json()
    assert len(projects) == 7
    featured = client.get("/api/projects?featured=true").json()
    assert featured and all(x["featured"] for x in featured)


def test_project_not_found(client):
    assert client.get("/api/projects/999").status_code == 404


def test_write_requires_admin_key(client, admin):
    body = {"title": "T", "description": "D", "technologies": ["x"]}
    assert client.post("/api/projects", json=body).status_code == 401
    assert client.post("/api/projects", json=body, headers={"X-Admin-Key": "nope"}).status_code == 401
    created = client.post("/api/projects", json=body, headers=admin)
    assert created.status_code == 200 and created.json()["id"] == 8


def test_project_update_and_delete(client, admin):
    r = client.put("/api/projects/1", json={"title": "New"}, headers=admin)
    assert r.json()["title"] == "New"
    assert client.put("/api/projects/999", json={"title": "x"}, headers=admin).status_code == 404
    assert client.delete("/api/projects/1", headers=admin).status_code == 200
    assert client.get("/api/projects/1").status_code == 404


def test_profile_update(client, admin):
    assert client.put("/api/profile", json={"title": "X"}).status_code == 401
    assert client.put("/api/profile", json={"title": "X"}, headers=admin).json()["title"] == "X"


def test_contact_flow_and_validation(client, admin):
    good = {"name": "A", "email": "a@example.com", "subject": "Hi", "message": "Hello there"}
    assert client.post("/api/contact", json=good).json()["success"] is True
    assert client.post("/api/contact", json={**good, "email": "bad"}).status_code == 422
    assert client.post("/api/contact", json={**good, "message": "x"}).status_code == 422
    assert client.get("/api/contact/messages").status_code == 401  # private
    msgs = client.get("/api/contact/messages", headers=admin).json()
    assert len(msgs) == 1 and msgs[0]["subject"] == "Hi"


def test_contact_rate_limit(client):
    good = {"name": "A", "email": "a@example.com", "subject": "Hi", "message": "Hello there"}
    codes = [client.post("/api/contact", json=good).status_code for _ in range(4)]
    assert codes == [200, 200, 200, 429]
