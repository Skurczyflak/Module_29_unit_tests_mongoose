const Employees = require('../models/employees.model');

exports.getAll = async (req, res) => {
  try{
    res.json(await Employees.find().populate('department'));
  }catch(err){
    res.status(500).json({ message: err });
  }
};

exports.getRandom = async (req, res) => {
  try{
    const count = await Employees.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const emp = await Employees.findOne().populate('department').skip(rand);
    if(!emp) res.status(404).json({ message: 'Not found' });
    else res.json(emp);

  }catch(err){
    res.status(500).json({ message: err });
  }
};

exports.getOne = async (req, res) => {
  try{
    const emp = await Employees.findById(req.params.id).populate('department');
    if(!emp) res.status(404).json({ message: 'Not found' });
    else res.json(emp);
  }catch(err){
    res.status(500).json({ message: err });
  }
};

exports.addOne = async (req, res) => {
  try {
    const { firstName, lastName, department } = req.body;
    const newEmployee = new Employees({ firstName, lastName, department });
    await newEmployee.save();
    res.json({ message: 'OK' });
  }catch(err){
    res.status(500).json({ message: err });
  }
};

exports.updateOne = async (req, res) => {
  try{
    const { firstName, lastName, department } = req.body;
    await Employees.updateOne({ _id: req.params.id }, { $set: { firstName: firstName, lastName: lastName, department: department }});
    res.json({ message: 'OK' });

  }catch(err){
    res.status(500).json({ message: err });
  }
};

exports.deleteOne = async (req, res) => {
  try{
    const emp = await Employees.findById(req.params.id);
    if(emp){
      await Employees.deleteOne({ _id: req.params.id });
      res.json({ message: 'OK' });
    }
    else res.status(404).json({ message: 'Not found...' });
  }catch(err){
    res.status(500).json({ message: err });
  }
};