MR

pk, fk, fk+pk

User(id**,** username, password, 

Follow(***id, idFollower***)

Post(*id,* date, description, photoUrl)

Comment(*id,* **idPost, idUser,** date, text)

Upload(***idPost, idUser***)





getFeed query sql



SELECT p.id, p.photoUrl 

FROM Post p

INNER JOIN Upload u 

&#x20;   ON p.id = u.idPost

INNER JOIN Follow f 

&#x20;   ON u.idUser = f.id

WHERE f.idFollower = \[ID\_DEL\_USUARIO\_QUE\_SOLICITA]

ORDER BY p.date DESC;

