const { default: axios } = require('axios')
const Ground = require('../models/ground')
const { validationResult } = require('express-validator')
const cloudinary = require('cloudinary').v2
const groundsCltr = {}


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

groundsCltr.list = (req, res) => {
    Ground.find()
        .then((ground) => {
            res.json(ground)
        })
        .catch((err) => {
            res.josn(err)
        })
}

groundsCltr.pictureUpdate = async (req, res) => {
    try {
        const { id } = req.params

        // cloudinary

        const cloudinaryUploadResult = await cloudinary.uploader.upload(file.path, (err, result) => {
            if (err) {
                console.log('error in upload ', err)
            } else {
                console.log('success fully uploaded', result)
            }
        })


        Ground.findById(id)
            .then((ground) => {
                ground.groundPicture = cloudinaryUploadResult.secure_url
                console.log('ground', ground)
                Ground.findByIdAndUpdate(id, ground, { new: true, runValidators: true })
                    .then((updatedGround) => {
                        console.log('updated ground', updatedGround)
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
    catch (err) {
        console.log(err)
    }
}

groundsCltr.register = async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        res.json({ errors: errors.array() })
    } else {
        // console.log('ground req', req)
        try {
            const { body } = req
            const { file } = req

            // uploading file to cloudinary
            const cloudinaryUploadResult = await cloudinary.uploader.upload(file.path, (err, result) => {
                if (err) {
                    console.log('error in upload ', err)
                } else {
                    console.log('success fully uploaded', result)
                }
            })

            const groundObj = new Ground({
                name: body.name,
                location: body.location,
                city: body.city,
                price: body.price,
                timings: body.timings,
                sport: body.sport,
                slotType: body.slotType,
                userId: body.userId,
                capacity: body.capacity,
                groundPicture: cloudinaryUploadResult.secure_url
            })

            // const res = await axios.get(`https://www.openstreetmap.org/search?${groundObj.location}`)
            // console.log("GEO CODE F",res.data)


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
    console.log('id', id)
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