import {connection} from '../sql/connection.js';
import bcrypt from "bcryptjs"
import {v4 as uuid} from 'uuid';
import jwt from"jsonwebtoken";
class AuthController{
    signup(req,res){
        connection.query(`SELECT * FROM users WHERE email = '${req.body.email}'`,
        (err, result) => {
           if (result.length) {
            return res.status(400).send({
                   msg: 'This email is already in use!'
               });
       }else{
        connection.query(
            `SELECT * FROM users WHERE mobile = ${connection.escape(
              req.body.mobile
            )};`,
         (err, result) => {
                console.log(req.body.mobile)
     
              if (result.length) {
                return res.status(409).send({
                  msg: 'This phone is already in use!'
                });
              }else{
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                      return res.status(500).send({
                        msg: err
                      });
                    } else {
                      // has hashed pw => add to database
                      console.log(uuid())
                      connection.query(
                        `INSERT INTO users (uid,first_name,last_name,email,mobile,password,role,status)
                         VALUES (
                          '${uuid()}',
                           ${connection.escape(req.body.first_name)},
                          ${connection.escape(req.body.last_name)},
                           ${connection.escape(req.body.email)},
                           ${connection.escape(req.body.mobile)},
                          ${connection.escape(hash)},
                           ${connection.escape(req.body.role)},
                          ${connection.escape(req.body.status)})`,
                        (err, result) => {
                          if (err) {
                            throw err;
                            return res.status(400).send({
                              msg: err
                            });
                          }
                          return res.status(201).send({
                            msg: 'Registered!'
                          });
                        }
                      );
                    }
                  });
              }
            })
       }
       
 
       })
    }

    login (req, res){
        connection.query(
          `SELECT * FROM users WHERE email = ${connection.escape(req.body.email)};`,
          (err, result) => {
            // user does not exists
            if (err) {
              throw err;
              return res.status(400).send({
                msg: err
              });
            }
            if (!result.length) {
              return res.status(401).send({
                msg: 'email is incorrect!'
              });
            }
            // check password
            bcrypt.compare(
              req.body.password,
              result[0]['password'],
              (bErr, bResult) => {
                // wrong password
                if (bErr) {
                  throw bErr;
                  return res.status(401).send({
                    msg: 'password is incorrect!'
                  });
                }
                if (bResult) {
                  const token = jwt.sign({
                    email: result[0].email,
                      userId: result[0].uid
                    },
                    'SECRETKEY', {
                      expiresIn: '30d'
                    }
                  );
                 
                  return res.status(200).send({
                    msg: 'Logged in!',
                    token,
                    user: result[0]
                  });
                }
                return res.status(401).send({
                  msg: 'email or password is incorrect!'
                });
              }
            );
          }
        );
    }
    
    currentUser(req,res){
        console.log(req.userData);
        res.send(req.userData);
    }

    users (req, res){
      let sql = `SELECT * FROM users`
      if(req.query.first_name){
       sql =`SELECT * FROM users WHERE first_name = '${req.query.first_name}'`
      }
      if(req.query.first_name){
        sql =`SELECT * FROM users WHERE last_name = '${req.query.last_name}'`
       }
       if(req.query.first_name){
        sql =`SELECT * FROM users WHERE email = '${req.query.email}'`
       }
       if(req.query.first_name){
        sql =`SELECT * FROM users WHERE mobile = '${req.query.mobile}'`
       }
       if(req.query.first_name){
        sql =`SELECT * FROM users WHERE role = '${req.query.role}'`
       }
       if(req.query.first_name){
        sql =`SELECT * FROM users WHERE status = '${req.query.status}'`
       }
      
      connection.query(
        sql,
        (err, result) => {
         if (result) {
            return res.status(200).send({
              result
            });
          }
    })
  }
    
        
}

export const authController = new AuthController