const express = require('express');
//add router from express
const router = express.Router();

//Item Model
const Item = require('../../models/Items');

//Create routes
//@route GET api/items
//@desc Get All Items
//@access Public
//if server, we use app.get
// started at '/' from server api 
router.get('/', async (req,res) => {
    try {
        const items = await Item.find();
        if (!items) throw Error('No items');

        res.status(200).json(items);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});

//@route GET api/items
//@desc Get All Items
//@access Public

router.post('/', async (req,res) => {
    try {
        const newItem = new Item({
            name: req.body.name
        });
        CheckItem(newItem, (err2, item) => {
            if(err2 || !item) {
                res.status(400).json({ msg: err2});
            }else{
                res.status(200).json(item);
            }
        });        
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});

//Item.findById(req.params.id) returns item in .then

router.delete('/:id', (req,res) => {
    Item.findById(req.params.id)
        .then(item => item.remove().then(() => res.json({success: true})))
        .catch(err => res.status(404).json({success: false}));     
});



function CheckItem(item,cb) {
    Item.find({name: item.name}, (err,data) => {
        console.log(item)
        if(data.length){
            cb('Item already exists', null);
        }else {
            item.save((err) => {
                cb(err,item);
            });
        }
    });
}

module.exports = router;