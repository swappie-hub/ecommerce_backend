const User = require("../models/User");
const Order= require("../models/order");


exports.getUserById=(req,res,next,id)=>{
    User.findById(id).exec((err,user)=>{

if(err|| !user){
return res.status(400).json(
    {
        err:"No User Found in DB"
    }
)
}
req.profile=user;
next()
    })
};

exports.getUser = (req,res)=>{
    req.profile.salt=undefined;
    req.profile.encry_password=undefined;
    return res.json(req.profile)
}
exports.updateUser=(req,res)=>{

User.findByIdAndUpdate(

{
    _id:req.profile._id
},
{
    $set:req.body
},
{
    new:true,useFindAndModify:false
},
(err,user)=>{

    if(err){
        return res.status(400).json({

            error:"You are not authorised to update this user"
        });
    }
    user.salt = undefined;
    user.encry_password = undefined;
    res.json(user)
});

};

exports.userPurchasedList=(req,res)=>{
Order.find({user:req.profile._id
})
 .populate("user","_id name")
 .exec((err,order)=>{
if(err){
    return res.status(400).json({

        error:"No Order under this user"
    });
}
return res.json(order);
});
};
exports.pushOrderInPurchasedList=(req,res)=>{
   let purchases=[]
    req.body.order.products.forEach(product=>{(
purchases.push({
    _id:product._id,
    name:product.name,
    description:product.description,
    category:product.category,
    quantity:product.quantity,
    amount:req.body.order.amount,
    transaction_id:req.body.order.transaction_id

})

    )})
   
   
   //store this in db
   User.findOneAndUpdate(
       {_id:req.profile._id},
   {$push:{purchases:purchases}},
   {new:true},
   (err,purchases) => {

    if(err){
        return res.status(400).json({

            error:"Unable to Save purchase List"
        });
    }
    next();
   }
   );
   
};

