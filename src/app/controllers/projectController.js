const express = require("express")
const authMiddleware = require("../middlewares/auth")

const Project = require('../models/project')
const Task = require('../models/task')

const router = express.Router()

router.use(authMiddleware)

//list
router.get("/", async(req,res)=>{
    try{
        const projects = await Project.find().populate(["user","tasks"])

        return res.send({projects})
    }catch(err){
        res.status(400).send({error:"Error loading projects"})
    }
})

//show
router.get("/:projectId", async (req,res)=>{
    try{
        const project = await Project.findById(req.params.projectId).populate(["user","tasks"])

        return res.send({project})
    }catch(err){
        res.status(400).send({error:"Error loading project"})
    }
})

//create 
router.post("/", async (req,res)=>{
    try{
        const {title,description,tasks} = req.body
        const project = await Project.create({title, description, user: req.userId})
        await Promise.all(tasks.map(async task=>{
            const projectTask = new Task({...task, project: project._id})

            await projectTask.save()
            project.tasks.push(projectTask)
        }))
        await project.save()

        return res.send({project})
    }catch(err){
        
        res.status(400).send({error:"Error creating new project"})
    }
})

//atualizar
router.put("/:projectId", async (req,res)=>{
    try{
        const {title,description,tasks} = req.body
        const project = await Project.findByIdAndUpdate(req.params.projectId,{
            title, 
            description,
        },{new:true})
        project.tasks = []
        await Task.remove({project: project._id})


        await Promise.all(tasks.map(async task=>{
            const projectTask = new Task({...task, project: project._id})

            await projectTask.save()
            project.tasks.push(projectTask)
        }))
        await project.save()

        return res.send({project})
    }catch(err){
        console.log(err);
        res.status(400).send({error:"Error updating new project"})
    }
})

//delete
router.delete("/:projectId", async (req,res)=>{
    try{
        await Project.findByIdAndRemove(req.params.projectId)
        return res.send()
    }catch(err){
        res.status(400).send({error:"Error project"})
    }
})
module.exports  = app => app.use("/projects", router)