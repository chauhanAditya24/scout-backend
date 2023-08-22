const Ground = require('../models/ground')

const groundsCltr = {}

groundsCltr.list = (req, res) => {
    Ground.find()
        .then((ground) => {
            res.json(ground)
        })
        .catch((err) => {
            res.josn(err)
        })
}

groundsCltr.pictureUpdate = (req, res) => {
    const { id } = req.params
    Ground.findById(id)
        .then((ground) => {
            ground.groundPicture = req.file.filename
            console.log('ground',ground)
            Ground.findByIdAndUpdate(id,ground,{new:true,runValidators:true})
                .then((updatedGround) => {
                    console.log('updated ground' ,updatedGround)
                    res.json(updatedGround)
                })
                .catch((err) => {
                    res.json(err)
                })
        })
        .catch((err) => {
            res.json(err)
        })
}

groundsCltr.register = async (req, res) => {
    console.log('ground req',req)
    try {
        const { body } = req
        const { file } = req

        const groundObj = new Ground({
            name:body.name,
            location: body.location,
            city: body.city,
            price: body.price,
            timings: body.timings,
            sport: body.sport,
            slotType: body.slotType,
            userId:body.userId,
            capacity:body.capacity,
            groundPicture:file.filename
        })

        const ground = await groundObj.save()
        res.json(ground)

    //     const grounds = new Ground(body)
    //     grounds.save()
    //         .then((ground) => {
    //             res.json(ground)
    //         })
    //         .catch((err) => {
    //             res.json(err)
    //         })
    }
    catch (err) {
        res.json(err)
    }
}

groundsCltr.usersGround = async (req, res) => {
    try {
        const ground = await Ground.find({ userId: req.userId })
        res.json(ground)
    }
    catch (err) {
        res.json(err)
    }
}

groundsCltr.selectedGround = (req, res) => {
    const id = req.params.id
    Ground.findById(id)
        .then((ground) => {
            res.json(ground)
        })
        .catch((err) => {
            res.json(err)
        })
}

groundsCltr.search = (req, res) => {
    const { body } = req
    console.log(body)
    Ground.find({ city: body.city, sport: body.sport })
        .then((grounds) => {
            res.json(grounds)
        })
        .catch((err) => {
            res.json(err)
        })
}

groundsCltr.delete = (req, res) => {
    console.log('inside the delete')
    const id = req.params.id
    console.log('id',id)
    Ground.findByIdAndDelete(id)
        .then((ground) => {
            console.log(ground)
            res.json(ground)
        })
        .catch((err) => {
            res.json(err)
        })
}

groundsCltr.show = (req, res) => {
    const { id } = req.params
    Ground.findById(id)
        .then((ground) => {
            res.json(ground)
        })
        .catch((err) => {
            console.log(err)
        })
}

groundsCltr.update = (req, res) => {
    const id = req.params.id
    const body = req.body
    Ground.findByIdAndUpdate(id, body, { new: true, runValidators: true })
        .then((ground) => {
            res.json(ground)
        })
        .catch((err) => {
            res.json(err)
        })
}

module.exports = groundsCltr