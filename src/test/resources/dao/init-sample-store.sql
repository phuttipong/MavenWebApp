-- DEBUG: org.hibernate.persister.entity.AbstractEntityPersister -  Insert 0: insert into Sample (rank, rating, title, votes, year, id) values (?, ?, ?, ?, ?, ?)
-- DEBUG: org.hibernate.persister.entity.AbstractEntityPersister -  Update 0: update Sample set rank=?, rating=?, title=?, votes=?, year=? where id=?
-- DEBUG: org.hibernate.persister.entity.AbstractEntityPersister -  Delete 0: delete from Sample where id=?

INSERT INTO Sample (id, title, year, votes, rating, rank) VALUES (X'6942f636297f11e6b67b9e71128cae77', 'The Shawshank Redemption', '1994', 678790, 9.2, 1);

