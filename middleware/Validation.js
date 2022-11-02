import {connection} from '../sql/connection.js';
import jwt from"jsonwebtoken";


export const validateRegister = async (req, res, next) => {
    let flag = false;

    if(!req.body.mobile||req.body.mobile.toString().length != 10) { 
        console.log(req.body.mobile.length)
        return res.status(400).send({
            msg: 'Mobile should be 10 characters long '
          });
        }
    else if(!req.body.password||req.body.password.length < 8) { 
        return res.status(400).send({
            msg: 'Password must be at least 8 characters'
          });
    } else if(req.body.password.search(/[a-z]/) < 0) { 
        return res.status(400).send({
            msg: 'Password must contain at least one lowercase letter'
          });
        } else if(req.body.password.search(/[A-Z]/) < 0) { 
            return res.status(400).send({
                msg: 'Password must contain at least one uppercase letter'
              });
        } else if(req.body.password.search(/[0-9]/) < 0) { 
            return res.status(400).send({
                msg: 'Password must contain at least one number'
              });      
        
        }
       else if (req.body.password.search(/^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/) < 0) {
        return res.status(400).send({
            msg: 'Password must contain at least one Special Symbol'
          });  
      }
      else if (req.body.email.search(/^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/) < 0) {
        return res.status(400).send({
            msg: 'enter valid email address'
          });  
      }
      else if(req.body.role != "admin"&&req.body.role != "member"&& req.body.role != "trainer"){
        return res.status(400).send({
            msg: 'enter valid role(admin/member/trainer)'
          });
      }


  
 
   
     
    
    next()
  }

  export const isLoggedIn = (req, res, next)=>{

  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(
      token,
      'SECRETKEY'
    );
    req.userData = decoded;
    next();
  } catch (err) {
    return res.status(401).send({
      msg: 'Your session is not valid!'
    });
  }
}  