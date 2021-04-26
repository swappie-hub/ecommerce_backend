const Product=require("../models/product");
const formidable=require("formidable");
const _ =require("lodash");
const fs =require("fs");


exports.getProductById=(req,res,next,id)=>{
Product.findById(id)
.populate("Category")
.exec((err,product)=>{
if(err){
    return res.status(400).json({
error:"Product Not Found"
    })
}
req.product=product;
next();
})
};
exports.createProduct=(req,res)=>{
let form =new formidable.IncomingForm();
form.keepExtension=true;
form.parse(req,(err,fields,file)=>{
    if(err){
        return res.status(400).json({
            error:"problem with Image"
        });        
    }
    //TODO: restrictions on field
    let product =new Product(fields);

//handle file here
    if (file.photo){
        if (file.photo.size>300000){
            return res.status(400).json({
                error:"File size too big!"
            });
        }
        product.photo.data=fs.readFileSync(file.photo.path);
        product.photo.contentType=file.photo.type;


    }
    //save to DB
    product.save((err,product)=>{
if(err){
    return res.status(400).json({
error:"Saving tshirt in db failed"
    });
}
res.json(product);
    })
});
};