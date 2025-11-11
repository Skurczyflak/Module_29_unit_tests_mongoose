const Department = require('../models/department.model');

exports.getAll = async (req, res) => {
    try {
        res.json(await Department.find());
    }
    catch(err) {
        res.status(500).json({ message: err });
    }
};

exports.getRandom = async (req, res) => {
  try {
    const count = await Department.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const dep = await Department.findOne().skip(rand);
    if(!dep) res.status(404).json({ message: 'Not found' });
    else res.json(dep);
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.getOne = async (req, res) => {
  try {
    const dep = await Department.findById(req.params.id);
    if(!dep) res.status(404).json({ message: 'Not found' });
    else res.json(dep);
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.addOne = async (req, res) => {
  try {
    const { name } = req.body;
    const newDepartment = new Department({ name: name });
    await newDepartment.save();
    const departments = await Department.find();
    res.json(departments);

  } catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.updateOne = async (req, res) => {
  try {
    const { name } = req.body;
    const dep = await Department.findById(req.params.id);
    if(dep) {
      await Department.updateOne({ _id: req.params.id }, { $set: { name: name }});
      const departments = await Department.find();
      res.json(departments);
    }
    else res.status(404).json({ message: 'Not found...' });
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.deleteOne = async (req, res) => {
  try {
    const dep = await Department.findById(req.params.id);
    if(dep) {
      await Department.deleteOne({ _id: req.params.id });
      const departments = await Department.find();
      res.json(departments);
    }
    else res.status(404).json({ message: 'Not found...' });
  }
  catch(err){
    req.status(500).json({ message: err });
  }
};