const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')


const app = express()
const port = 3000

// mysql connection 생성// mysql connection 생성
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1dnjsvltm!',
    database: 'jolup'
});

connection.connect(function(err) {
    if (err) throw err;
    connection.query("SELECT * FROM jolup.privacy", function(err, result, fields) {
        if (err) throw err;
        console.log(result);
    });
})

//get은 보안상의 문제로 안쓰는게 좋다고 생각중 그래서 post로 하려고 시도중
app.get('/getUserData', (req, res) => { // getUserData 경로에 GET 요청이 왔을 경우
    console.log(`param id : ${req.query.id}`)
    connection.query(
        `SELECT * FROM jolup.privacy WHERE user_id = ${req.query.id};`, // 전달 받은 id(학번) 의 값으로 학생 조회
        (err, rows, fields) => { // SQL 문 Callback 함수
            res.send(rows);
            console.log(rows);
        });
})

// 하 왜 안되는거지
app.post('/setUserData', (req, res) => {
    console.log(req.body);
    console.log(`body : ${JSON.stringify(req.body)}`)
    connection.query(
        // 쿼리 문 작성 시 리터럴 함수를 사용하더라도 '' string 표시는 꼭! 해주어야 한다.
        `INSERT INTO jolup.privacy ('id', 'name', 'password', 'live_code', 'admin') VALUES ("${req.body.id}", "${req.body.name}", "${req.body.password}", 0, 0);`,
        //"INSERT INTO jolup.privacy (`name`, `id`, `password`, `live_code`, `admin`) VALUES ('김성우', 'voicemaker', 'aas212', 0, 0)";
        (err, rows, fields) => {
            if (err) { // sql 문 에러 발생 시, error 전송
                res.status(300).send({
                    state: "ERROR",
                    message: err.sqlMessage
                });
            } else { // success 전송
                res.status(200).send({
                    state: "OK",
                    message: "Data insert success!"
                });
            }
        });
})



// database 연결 종료
//connection.end();

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})